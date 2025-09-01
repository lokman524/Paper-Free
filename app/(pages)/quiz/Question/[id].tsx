import { View, Text, ScrollView, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Results from '@/components/Results'
import QuestionNav from './questionNav'
import { useSavedStore } from '@/store/saved.store'
import uuid from 'react-native-uuid'
import ErrorBookSelect from '@/components/ErrorBookSelect'
import CustomDropdown from '@/components/DropdownList'


export interface Question {
    id: string,
    title: string,
    type: "MULTIPLE_CHOICE" | "LONG_ANSWER",
    question?: string, // Optional for LONG_ANSWER type
    options?: string[], // Optional for MULTIPLE_CHOICE type
    answer: string, // For LONG_ANSWER, this is the model answer
    minWords?: number, // Optional for LONG_ANSWER type, specifies minimum words required
    modelAnswer?: string // Optional for LONG_ANSWER type, provides a model answer
}

interface questionBank {
    courseName: string,
    courseID: string,
    questions: Question[]
}

const questionDBData: questionBank[] = [
    {
        courseName: "Math",
        courseID: "1204889572890471",
        questions: [
            {
                id: uuid.v4(),
                title: "Question 1",
                type: "MULTIPLE_CHOICE",
                question: "What is 2+2?",
                options: ["3", "4", "5", "6"],
                answer: "4"
            },
            {
                id: uuid.v4(),
                title: "Question 2",
                type: "LONG_ANSWER",
                question: "Is π greater than 3?",
                answer: "Yes"
            },
            {
                id: uuid.v4(),
                title: "Question 3",
                type: "LONG_ANSWER",
                question: "What is 1+1?",
                answer: "2"
            },
        ],
    },
    {
        courseName: "Science",
        courseID: "5987259123456789",
        questions: [
            {
                id: uuid.v4(),
                title: "Question 1",
                type: "MULTIPLE_CHOICE",
                question: "What is the chemical symbol for water?",
                options: ["H2O", "CO2", "O2", "NaCl"],
                answer: "H2O"

            },
            {
                id: uuid.v4(),
                title: "Question 2",
                type: "LONG_ANSWER",
                question: "Is the earth flat?",
                answer: "Yes",
            }
        ],
    }
]

const DisplayQuestion = () => {
    //fetch saved questions from the store
    const savedDBData: questionBank[] = useSavedStore(state => state.savedQuestions)

    const [startTime, setStartTime] = useState(new Date().getTime());
    const [finishTime, setFinishTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const params = useLocalSearchParams();
    const id: string = params.id as string || ''; //course ID
    const courseName: string = params.courseName as string || '';
    const isTimerEnabled: string = params.isTimerEnabled as string || 'false';
    const call: string = params.call as string || '';
    const startQuestion: number = Number(params.startQuestion) || 1;
    const numberOfQuestions: number = Number(params.numberOfQuestions) || 1;
    //Get questionList param if present
    const questionListParam = params.questionList as string | undefined;
    const questionList: Question[] | undefined = questionListParam ? JSON.parse(questionListParam) : undefined;

    const [questions, setQuestions] = useState<Question[]>([]); // Initialize with an empty array

    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(startQuestion - 1);  //current question is used to navigate in the questionbank array
    const [currentIndex, setCurrentIndex] = useState<number>(1);                        //current index is used to show on the UI the question the user is doing
    const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

    //Debug log
    /* useEffect (() => {
        console.log("startQuestion: " + startQuestion + 
                    " numberOfQuestions: " + numberOfQuestions + 
                    " currentQuestion: " + currentQuestion)
    }, [startQuestion, numberOfQuestions, currentQuestion]) */

    //fetch the question bank data based on the id and call 
    useEffect(() => {

        //when the component mounts, we need to find the question bank for the subject
        // If questionList is provided, use it directly
        // Otherwise, fetch the question bank based on the id and call
        const fetchData = async () => {
            if (questionList && questionList.length > 0) {
                setQuestions(questionList);
                setUserAnswers(new Array(questionList.length).fill(''));
            } else {
                const questionBankData = (call === "subject_selection")
                    ? questionDBData.find(item => item.courseID === id)
                    : savedDBData.find(item => item.courseID === id);
                if (questionBankData) {
                    setQuestions(questionBankData.questions);
                    setUserAnswers(new Array(questionBankData.questions.length).fill(''));
                }
            }
        };

        fetchData();

    }, [])

    // Set up an interval to update elapsed time every second
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            setElapsedTime(currentTime - startTime);
        }, 1000);
        return () => clearInterval(interval); // Clear the interval on component unmount
    }, []);

    //format the elapsed time to a readable format (hours:minutes:seconds)
    const formatElapsedTime = (time: number) => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function handleSelectedOption(option : string) {
        const newUserAnswers = [...userAnswers];
        newUserAnswers[currentQuestion - startQuestion + 1] = option;
        setUserAnswers(newUserAnswers);
    }

    function goToPrev() {
        if (currentIndex > 1){
            setCurrentIndex(currentIndex - 1);
            setCurrentQuestion(currentQuestion - 1);
        }
    }

    function goToNext() {
        if (currentIndex === numberOfQuestions){
            const currentTime = new Date().getTime();
            setFinishTime(currentTime);
            setIsQuizFinished(true);
        }
        else {
            setCurrentQuestion(currentQuestion + 1);
            setCurrentIndex(currentIndex + 1);
        }
    }

    function restartQuiz() {
        setUserAnswers([]); // Initialize user answers
        setCurrentQuestion(0);
        setIsQuizFinished(false);
    }

    function renderQuestionContent() {
        if (!questions[currentQuestion]) {
            return <Text className="text-lg text-gray-600">Question not found</Text>;
        }
        return (
            <>
                <Text className="text-2xl text-gray-800 leading-8 mb-6">
                    {questions[currentQuestion].question}
                </Text>
                {renderQuestionInput()}
            </>
        );
    }

    function renderQuestionInput() {
        // For LONG_ANSWER type questions, render a TextInput for user input
        if (questions[currentQuestion].type === "LONG_ANSWER") {
            return (
                <View className="mt-4">
                    <TextInput
                        className="border border-gray-300 rounded-lg p-4 min-h-32 text-xl"
                        placeholder="Type your answer here"
                        multiline
                        value={userAnswers[currentQuestion - startQuestion + 1] || ''}
                        onChangeText={text => handleSelectedOption(text)}
                    />
                </View>
            )
        }

        // For MULTIPLE_CHOICE type questions, render options as native radio buttons
        if (questions[currentQuestion].type === "MULTIPLE_CHOICE" && questions[currentQuestion].options) {
            const currentAnswer = userAnswers[currentQuestion - startQuestion + 1];
            
            return (
                <View className="mt-4">
                    {questions[currentQuestion].options?.map((option, index) => {
                        const isSelected = currentAnswer === option;
                        
                        return (
                            <TouchableOpacity
                                key={index}
                                className="flex-row items-center p-3 mb-2 border border-gray-200 rounded-lg"
                                onPress={() => handleSelectedOption(option)}
                            >
                                {/* Radio Button */}
                                <View className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3 items-center justify-center">
                                    {isSelected && (
                                        <View className="w-3 h-3 rounded-full bg-blue-500" />
                                    )}
                                </View>
                                
                                {/* Option Text */}
                                <Text className={`text-xl flex-1 ${
                                    isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
                                }`}>
                                    {String.fromCharCode(index + 65)}. {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )
        }
    }

    const addSavedQuestion = useSavedStore(state => state.addSavedQuestion);

    //data to pass to DropdownList component
    const dropdownData = savedDBData.map(book => ({
        label: book.courseName,
        value: book.courseID,
    }));

    //To control the dropdown for adding to error book
    const [showDropdown, setShowDropdown] = useState(false);
    const [recordToAdd, setRecordToAdd] = useState<any | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');

    //Function to sanitize the question object before adding to saved questions
    //This ensures that the question object matches the expected structure in saved.store.ts
    const sanitizeQuestion = (q: any) => ({
        id: uuid.v4(),
        title: q.title,
        type: q.type,
        question: q.question,
        options: q.options ? q.options : [],
        answer: q.answer,
    });

    const handleAddSingle = (question: any) => {
        setShowDropdown(true);
        setRecordToAdd(sanitizeQuestion(question));
    }

    const handleDropdownSelect = (courseID: any) => {
        let recordsToAdd = [recordToAdd];
        //Supposed add to backend, but for now i will add to savedQuestionStore locally
        addSavedQuestion(recordsToAdd, courseID);
        Alert.alert("Record(s) added");
        setShowDropdown(false);
        setRecordToAdd(null);
    }

    if (isQuizFinished) {
        return <Results 
            userAnswers={userAnswers} 
            questionBank={questions} 
            restartQuiz={restartQuiz} 
            startTime={startTime} 
            finishTime={finishTime} 
            call={call} 
            isTimerEnabled={isTimerEnabled} 
            startQuestion={startQuestion}
            numberOfQuestions={numberOfQuestions}
        />;
    }

    return (
        <View className="flex-1 flex-row">
            {/* Sidebar Navigation */}
            <QuestionNav 
                questions={questions} 
                setQuestion={setCurrentQuestion} 
                setCurrentIndex={setCurrentIndex} 
                startQuestion={startQuestion} 
                numberOfQuestions={numberOfQuestions}
                currentIndex={currentIndex}
                userAnswers={userAnswers}
            />
            
            {/* Main Content Area */}
            <View className="flex-1 p-6">
                {/* Header */}
                <View className="mb-4 mt-5">
                    <Text className="text-4xl font-bold text-gray-800 mb-2">{courseName}</Text>
                    <Text className="text-2xl text-gray-600">Question {currentIndex} of {numberOfQuestions}</Text>
                    {isTimerEnabled === "true" && <Text className="text-lg text-gray-500 mt-1">Time Elapsed: {formatElapsedTime(elapsedTime)}</Text>}
                </View>
                
                {/* Question Content */}
                <ScrollView className="flex-1 mb-6">
                    <View className="bg-white p-6 rounded-lg shadow-sm">
                        {renderQuestionContent()}
                    </View>
                </ScrollView>
                
                {/* Action Buttons */}
                <View className="flex-row justify-between items-center">
                    <Button title='Previous' onPress={goToPrev} disabled={currentIndex === 1} />
                    <Button title='Save to 錯題簿' onPress={() => handleAddSingle(questions[currentQuestion])} disabled={call === "saved"}/>
                    <Button title={(currentIndex === numberOfQuestions) ? "Finish Quiz" : "Next"} onPress={goToNext} />
                </View>
            </View>
            <Modal
                visible={showDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
            >
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View className="bg-white rounded-lg p-6 m-4 ">
                    <Text className="text-lg font-semibold text-gray-800 mb-2">Add to Error Book</Text>
                    <Text className="text-gray-600 mb-4">Choose an error book to add these questions:</Text>
                    <CustomDropdown
                        data={dropdownData}
                        value={selectedCourseId}
                        onSelect={(val: string) => setSelectedCourseId(val)}
                        placeholder="Select error book"
                        sheetTitle="Select Error Book"
                    />
                    <ErrorBookSelect 
                        data={dropdownData} 
                        onSelect={handleDropdownSelect} 
                    />
                    <View className="mt-6 space-y-3">
                        <Button
                        title="Add"
                        onPress={() => selectedCourseId && handleDropdownSelect(selectedCourseId)}
                        disabled={!selectedCourseId}
                        />
                        <Button title="Cancel" onPress={() => { setShowDropdown(false); setRecordToAdd(null); setSelectedCourseId(''); }} />
                    </View>
                    </View>    
                </View>
            </Modal>
        </View>
    )
}

export default DisplayQuestion;