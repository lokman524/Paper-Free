import CustomDropdown from '@/components/DropdownList'
import { images } from '@/constants/images'
import { Link, router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Alert, Button, FlatList, Image, Switch, Text, TextInput, View } from 'react-native'


const Subject = ({ }) => {

    type TestTypeInterface = "1" | "2" | "3" | "-1";

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [numberOfQuestionsInput, setNumberOfQuestionsInput] = useState("");
    const [startQuestionInput, setStartQuestionInput] = useState("1");
    const [isTimerEnabled, setIsTimerEnabled] = useState(false);
    const [isRandomEnabled, setIsRandomEnabled] = useState(false);

    // Test type can be "1", "2", "3" or "-1" (not selected)
    // This is used to determine the type of test the user wants to take
    const [testType, setTestType] = useState<TestTypeInterface>("-1");

    //convert the query to string and number separately
    const params = useLocalSearchParams();
    const id: string = params.id as string;
    const courseName: string = params.subject as string;
    const questionCount: number = Number(params.questionCount);
    const call: string = params.call as string;


    // Check if the input is an integer
    const isInteger = (value: string) => {
        const regex = /^-?\d+$/;
        return regex.test(value);
    };

    // Get the question bank from the subject_selection file
    const handleDropdownSelect = (item: TestTypeInterface) => {
        setTestType(item);
    }

    const toggleTimerSwitch = () => setIsTimerEnabled(previousState => !previousState);

    const toggleRandomSwitch = () => setIsRandomEnabled(previousState => !previousState);

    //Validates the form input when the from is submitted
    const handleSubmit = () => {
        if (testType === "-1") {
            Alert.alert("Please select a test type");
        }
        else if (numberOfQuestionsInput === "") {
            Alert.alert("Please enter number of questions");
        }
        else if (!isInteger(numberOfQuestionsInput)) {
            Alert.alert("Number of questions must be an integer");
        }
        else if (Number(numberOfQuestionsInput) <= 0) {
            Alert.alert("Number of questions must be greater than 0");
        }
        else if (Number(numberOfQuestionsInput) > questionCount) {
            Alert.alert("Number of question cannot be larger than the total number of questions")
        }
        else if (!isInteger(startQuestionInput)) {
            Alert.alert("Question number must be an integer");
        }
        else if (Number(startQuestionInput) < 1) {
            Alert.alert("Question number must be greater than 1")
        }
        else if (Number(startQuestionInput) > questionCount) {
            Alert.alert("Question number cannot be larger than the total number of questions")
        }
        else if((Number(startQuestionInput)-1+Number(numberOfQuestionsInput)-1) > questionCount-1 ){
            Alert.alert("Number of questions in this range is larger than the total number of questions")
        }
        else {
            setIsFormSubmitted(true);
            // Navigate to the actual quiz page with the selected parameters
            router.push({
                pathname: "/quiz/Question/[id]",
                params: {
                    id: id,                     //This is the course ID
                    courseName: courseName,     //This is the course name
                    isTimerEnabled: isTimerEnabled.toString(), 
                    call: call,                 //To determine weather the call is from the questionbank or saved page
                    startQuestion: startQuestionInput,   
                    numberOfQuestions: numberOfQuestionsInput,
                }
            });
        }
    }

    const handleGoBack = () => {
        setIsFormSubmitted(false);
        setNumberOfQuestionsInput("");
        setStartQuestionInput("1");
        setTestType("-1");
        setIsTimerEnabled(false);
        setIsRandomEnabled(false);
        router.back;
    }

    /* useEffect (() => {
        console.log("Test type: " + testType + 
                    " Number of Questions: " + numberOfQuestionsInput +
                    " Start Question: " + startQuestionInput +
                    " Is Timer Enabled: " + isTimerEnabled +
                    " Is Random Enabled: " + isRandomEnabled)
    }, [isFormSubmitted]) */

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className="text-5xl text-white font-bold mt-5 mb-3">{courseName}</Text>
            <View>
                <Text className='text-white'>Test type</Text>
                <CustomDropdown
                    data={[
                        { label: 'Type 1', value: '1' },
                        { label: 'Type 2', value: '2' },
                        { label: 'Type 3', value: '3' },
                    ]}
                    onSelect={handleDropdownSelect}
                />
                <Text className='text-white'>Number of questions {"/ " + questionCount}</Text>
                <TextInput
                    className='h-10 border border-white rounded p-2 text-white'
                    placeholder="Enter number of questions here"
                    placeholderTextColor="lightgray"
                    onChangeText={text => setNumberOfQuestionsInput(text)}
                />
                {!isRandomEnabled &&
                    <>
                        <Text className='text-white'>Start from question number: </Text>
                        <TextInput
                            className='h-10 border border-white rounded p-2 text-white'
                            placeholder="1"
                            placeholderTextColor="lightgray"
                            onChangeText={text => setStartQuestionInput(text)}
                        />
                    </>
                }
                <Text className='text-white'>Enable Timer?</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isTimerEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTimerSwitch}
                    value={isTimerEnabled}
                />
                <Text className='text-white'>Random?</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isRandomEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleRandomSwitch}
                    value={isRandomEnabled}
                />
                <Button title='submit' onPress={handleSubmit} />
                <Button title='go back' onPress={router.back} />
            </View>

        </View>
    )
}

export default Subject;
