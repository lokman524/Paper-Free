import { View, Text, Image, ScrollView, TextInput, Button, Alert, Modal } from 'react-native'
import { images } from '@/constants/images'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Results from '@/components/Results'
import QuestionNav from './questionNav'
import { useSavedStore } from '@/store/saved.store'
import uuid from 'react-native-uuid'
import ErrorBookSelect from '@/components/ErrorBookSelect'


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
            return <Text className='text-xl text-white font-bold mt-5 mb-3'>Question not found</Text>;
        }
        return (
            <>
                <Text className='text-xl text-white font-bold mt-5 mb-3'>{questions[currentQuestion].question}</Text>
                {renderQuestionInput()}
            </>
        );
    }

    function renderQuestionInput() {

        // if (!questions[currentQuestion]) {
        //     return <Text className='text-xl text-white font-bold mt-5 mb-3'>Question not found</Text>;
        // }

        // For LONG_ANSWER type questions, render a TextInput for user input
        if (questions[currentQuestion].type === "LONG_ANSWER") {
            return (
                <TextInput
                    className='h-10 border border-white rounded p-2 mt-5 text-white'
                    placeholder="Type your answer here"
                    placeholderTextColor="lightgray"
                    onChangeText={text => handleSelectedOption(text)}
                />
            )
        }

        // For MULTIPLE_CHOICE type questions, render options as buttons
        if (questions[currentQuestion].type === "MULTIPLE_CHOICE" && questions[currentQuestion].options) {
            return (
                <View className='mt-5'>
                    {questions[currentQuestion].options?.map((option, index) => (
                        <Button
                            key={index}
                            title={String.fromCharCode(index + 65) + ": " + option}
                            onPress={() => handleSelectedOption(option)}
                        />
                    ))}
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
        
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className="text-5xl text-white font-bold mt-5 mb-3">{courseName}</Text>
            <QuestionNav questions={questions} setQuestion={setCurrentQuestion} setCurrentIndex={setCurrentIndex} startQuestion={startQuestion} numberOfQuestions={numberOfQuestions}/>
            <Text className='text-white text-xl mb-5'>Question {currentIndex} of {numberOfQuestions}</Text>
            {isTimerEnabled === "true" && <Text className='text-white text-lg mb-5'>Time Elapsed: {formatElapsedTime(elapsedTime)} </Text>}
            <ScrollView>
                {renderQuestionContent()}
            </ScrollView>
            <Button title='previous question ' onPress={goToPrev} disabled={currentIndex === 1} />
            <Button title='save to 錯題簿' onPress={() => handleAddSingle(questions[currentQuestion])} disabled={call === "saved"}/>
            <Button title={(currentIndex === numberOfQuestions) ? "Finish Quiz" : "Next"} onPress={goToNext} />
            {/* Dropdown for selecting error book */}
            <Modal
                            visible={showDropdown}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setShowDropdown(false)}
                        >
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.3)'
                            }}>
                                <View style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    padding: 20,
                                    minWidth: 200,
                                    alignItems: 'center'
                                }}>
                                    <Text className='text-black mb-2'>Select an error book to add record(s):</Text>
                                    <ErrorBookSelect 
                                        data={dropdownData} 
                                        onSelect={handleDropdownSelect} 
                                    />
                                    <Button title="Cancel" onPress={() => {
                                        setShowDropdown(false);
                                        setRecordToAdd(null);
                                    }}/>
                                </View>
                            </View>
            </Modal>
        </View>
        
    )
}

export default DisplayQuestion;