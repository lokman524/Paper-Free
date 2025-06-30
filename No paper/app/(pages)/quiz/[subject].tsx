import CustomDropdown from '@/components/DropdownList'
import { images } from '@/constants/images'
import { Link, router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Alert, Button, FlatList, Image, Switch, Text, TextInput, View } from 'react-native'
import { questionBank } from '../subject_selection'
import { savedQuestions } from '@/app/(tabs)/saved'



const Subject = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [numberOfQuestionsInput, setNumberOfQuestionsInput] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [startQuestionInput, setStartQuestionInput] = useState("1");
    const [startQuestion, setStartQuestion] = useState(1);
    const [isTimerEnabled, setIsTimerEnabled] = useState(false);
    const [isRandomEnabled, setIsRandomEnabled] = useState(false);
    const [testType, setTestType] = useState("-1");
    const {subject, call} = useLocalSearchParams();

    const questions = (call === "subject_selection")? questionBank: savedQuestions;

    const renderItem = ({item , index}) => {
        if ('options' in item) {
            return (
                <Link
                    href={{
                        pathname: "/quiz/Question/[id]",
                        params: { 
                            id: item.id,
                            subject: item.subject
                        },
                    }}
                >
                    <Text className='text-white'>{index+1}. {item.title}</Text>
                </Link>
            );
        } else {
            return (
                <Link
                    href={{
                        pathname: "/quiz/Question/[id]",
                        params: { 
                            id: item.id,
                            subject: item.subject
                        },
                    }}
                >
                    <Text className='text-white'>{index+1}. {item.title}</Text>
                </Link>
            );
        }
    };

    const isInteger = (value) => {
        const regex = /^-?\d+$/; 
        return regex.test(value);
    };

    const handleDropdownSelect = (item) => {
        setTestType(item);
    } 

    const toggleTimerSwitch = () => setIsTimerEnabled(previousState => !previousState);

    const toggleRandomSwitch = () => setIsRandomEnabled(previousState => !previousState);

    const handleSubmit = () => {
        if (testType === "-1" ){
            Alert.alert("Please select a test type");
        }
        else if (numberOfQuestionsInput === "") {
            Alert.alert("Please enter number of questions");
        }
        else if (!isInteger(numberOfQuestionsInput)){
            Alert.alert("Number of questions must be an integer");
        }
        else if (Number(numberOfQuestionsInput) <= 0){
            Alert.alert("Number of questions must be greater than 0");
        }
        else if (Number(numberOfQuestionsInput) > questionBank[subject as keyof typeof questionBank].length){
            Alert.alert("Number of question cannot be larger than the total number of questions")
        }
        else if (!isInteger(startQuestionInput)){
            Alert.alert("Question number must be an integer");
        }
        else if(Number(startQuestionInput) <1){
            Alert.alert("Question number must be greater than 1")
        }
        else if (Number(startQuestionInput) > questionBank[subject as keyof typeof questionBank].length){
            Alert.alert("Question number cannot be larger than the total number of questions")
        }
        else {
            setNumberOfQuestions(Number(numberOfQuestionsInput));
            setStartQuestion(Number(startQuestionInput));
            setIsFormSubmitted(true);
        }
    }

    const handleGoBack = () => {
        setIsFormSubmitted(false);
        setNumberOfQuestions(0);
        setNumberOfQuestionsInput("");
        setStartQuestionInput("1");
        setStartQuestion(1);
        setTestType("-1");
        setIsTimerEnabled(false);
        setIsRandomEnabled(false);
        router.back;
    }

    /*useEffect (() => {
        console.log("Test type: " + testType + 
                    " Number of Questions: " + numberOfQuestions +
                    " Start Question: " + startQuestion +
                    " Is Timer Enabled: " + isTimerEnabled +
                    " Is Random Enabled: " + isRandomEnabled)
    }, [isFormSubmitted])*/

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className="text-5xl text-white font-bold mt-5 mb-3">{subject}</Text>
            {!isFormSubmitted && 
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
                    <Text className='text-white'>Number of questions {"/ " + questions[subject as keyof typeof questions].length}</Text>
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
                    <Button title='go back' onPress={router.back}/>
                </View>
            }

            {isFormSubmitted && 
                <FlatList 
                    data={questions[subject as keyof typeof questions]}
                    renderItem={renderItem}
                    ListFooterComponent={<Button title='go back' onPress={handleGoBack}/>}
                />

            }
            
        </View>
    )
}

export default Subject;