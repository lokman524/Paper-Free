import CustomDropdown from '@/components/DropdownList'
import { router, useLocalSearchParams, Stack } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Button, Switch, Text, TextInput, View } from 'react-native'


const Subject = ({ }) => {

    type TestTypeInterface = "1" | "2" | "3" | "-1";

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [numberOfQuestionsInput, setNumberOfQuestionsInput] = useState("1");
    const [startQuestionInput, setStartQuestionInput] = useState("1");
    const [isTimerEnabled, setIsTimerEnabled] = useState(false);
    const [isRandomEnabled, setIsRandomEnabled] = useState(false);

    // Test type can be "1", "2", "3" or "-1" (not selected)
    // This is used to determine the type of test the user wants to take
    const [testType, setTestType] = useState<TestTypeInterface>("-1");

    //convert the query to string and number separately
    const params = useLocalSearchParams();
    const id: string = params.id as string || '';
    const courseName: string = params.subject as string || '';
    const questionCount: number = Number(params.questionCount) || 0;
    const call: string = params.call as string || '';
    const prevTitle = call === 'subject_selection' ? 'Subjects' : call === 'saved' ? 'Saved' : 'Back';


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
        else if ((Number(startQuestionInput) - 1 + Number(numberOfQuestionsInput) - 1) > questionCount - 1) {
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
        setNumberOfQuestionsInput("1");
        setStartQuestionInput("1");
        setTestType("-1");
        setIsTimerEnabled(false);
        setIsRandomEnabled(false);
        router.back();
    }

    /* useEffect (() => {
        console.log("Test type: " + testType + 
                    " Number of Questions: " + numberOfQuestionsInput +
                    " Start Question: " + startQuestionInput +
                    " Is Timer Enabled: " + isTimerEnabled +
                    " Is Random Enabled: " + isRandomEnabled)
    }, [isFormSubmitted]) */

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: '',
                    headerBackTitle: prevTitle,
                }}
            />
            
            {/* Main Content Area */}
            <View className="flex-1 p-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Start A Test</Text>
                    <Text className="text-lg text-gray-600">Test your knowledge by revising what you have did wrong.</Text>
                </View>
                
                {/* Course Info Card */}
                <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">{courseName}</Text>
                    <Text className="text-sm text-gray-500">Total Questions Available: {questionCount}</Text>
                </View>
                
                {/* Form Card */}
                <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <View className="space-y-6">
                        {/* Test Type */}
                        <View>
                            <Text className="text-lg font-semibold text-gray-700 mb-3">Test Type</Text>
                            <CustomDropdown
                                data={[
                                    { label: 'Type 1', value: '1' },
                                    { label: 'Type 2', value: '2' },
                                    { label: 'Type 3', value: '3' },
                                ]}
                                value={testType === '-1' ? '' : testType}
                                onSelect={(val: string) => setTestType(val as TestTypeInterface)}
                            />
                        </View>
                        
                        {/* Number of Questions */}
                        <View>
                            <Text className="text-lg font-semibold text-gray-700 mb-3">Number of Questions</Text>
                            <TextInput
                                value={numberOfQuestionsInput}
                                keyboardType="phone-pad"
                                inputMode="numeric"
                                placeholder="1"
                                placeholderTextColor="#9CA3AF"
                                className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
                                onChangeText={(text) => {
                                    const cleaned = text.replace(/[^0-9]/g, '');
                                    if (cleaned === '') {
                                        setNumberOfQuestionsInput('');
                                        return;
                                    }
                                    const n = Number(cleaned);
                                    const clamped = Math.min(Math.max(1, n), Math.max(1, questionCount));
                                    setNumberOfQuestionsInput(String(clamped));
                                }}
                            />
                        </View>
                        
                        {/* Start Question (only if not random) */}
                        {!isRandomEnabled && (
                            <View>
                                <Text className="text-lg font-semibold text-gray-700 mb-3">Start from Question Number</Text>
                                <TextInput
                                    value={startQuestionInput}
                                    keyboardType="phone-pad"
                                    inputMode="numeric"
                                    placeholder="1"
                                    placeholderTextColor="#9CA3AF"
                                    className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
                                    onChangeText={(text) => {
                                        const cleaned = text.replace(/[^0-9]/g, '');
                                        if (cleaned === '') {
                                            setStartQuestionInput('');
                                            return;
                                        }
                                        const n = Number(cleaned);
                                        const clamped = Math.min(Math.max(1, n), Math.max(1, questionCount));
                                        setStartQuestionInput(String(clamped));
                                    }}
                                />
                            </View>
                        )}
                        
                        {/* Timer Toggle */}
                        <View className="flex-row items-center justify-between py-2">
                            <View>
                                <Text className="text-lg font-semibold text-gray-700">Enable Timer</Text>
                                <Text className="text-sm text-gray-500 mt-1">Track your completion time</Text>
                            </View>
                            <Switch
                                onValueChange={toggleTimerSwitch}
                                value={isTimerEnabled}
                            />
                        </View>
                        
                        {/* Random Toggle */}
                        <View className="flex-row items-center justify-between py-2">
                            <View>
                                <Text className="text-lg font-semibold text-gray-700">Random Order</Text>
                                <Text className="text-sm text-gray-500 mt-1">Randomize question sequence</Text>
                            </View>
                            <Switch
                                onValueChange={toggleRandomSwitch}
                                value={isRandomEnabled}
                            />
                        </View>
                    </View>
                </View>
                
                {/* Submit Button */}
                <View className="bg-white p-4 rounded-lg shadow-sm">
                    <Button title="Start Test" onPress={handleSubmit} />
                </View>
            </View>
        </View>
    )
}

export default Subject;