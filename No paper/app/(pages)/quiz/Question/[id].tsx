import { View, Text, Image, ScrollView, TextInput, Button } from 'react-native'
import { images } from '@/constants/images'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Results from '@/components/Results'
import QuestionNav from './questionNav'


export interface Question {
    key: number,
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
                key: 1,
                title: "Question 1",
                type: "MULTIPLE_CHOICE",
                question: "What is 2+2?",
                options: ["3", "4", "5", "6"],
                answer: "4"
            },
            {
                key: 2,
                title: "Question 2",
                type: "LONG_ANSWER",
                question: "Is π greater than 3?",
                answer: "Yes"
            }
        ],
    },
    {
        courseName: "Science",
        courseID: "5987259123456789",
        questions: [
            {
                key: 1,
                title: "Question 1",
                type: "MULTIPLE_CHOICE",
                question: "What is the chemical symbol for water?",
                options: ["H2O", "CO2", "O2", "NaCl"],
                answer: "H2O"

            },
            {
                key: 2,
                title: "Question 2",
                type: "LONG_ANSWER",
                question: "Is the earth flat?",
                answer: "Yes",
            }
        ],
    }
]

const DisplayQuestion = () => {

    const [startTime, setStartTime] = useState<number>(new Date().getTime());
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const params = useLocalSearchParams();
    const id: string = params.id as string;
    const courseName: string = params.courseName as string;

    const [questions, setQuestions] = useState<Question[]>([]); // Initialize with an empty array

    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);


    useEffect(() => {

        //when the component mounts, we need to find the question bank for the subject
        const fetchData = async () => {
            const questionBankData = questionDBData.find(item => item.courseID === id);
            if (questionBankData) {
                setQuestions(questionBankData.questions);
                setUserAnswers(new Array(questionBankData.questions.length).fill('')); // Initialize user answers
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
    }, [startTime]);

    //format the elapsed time to a readable format (hours:minutes:seconds)
    const formatElapsedTime = (time: number) => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function handleSelectedOption(option : string) {
        const newUserAnswers = [...userAnswers];
        newUserAnswers[currentQuestion] = option;
        setUserAnswers(newUserAnswers);
    }

    function goToPrev() {
        if (currentQuestion > 0)
            setCurrentQuestion(currentQuestion - 1);
    }

    function goToNext() {
        if (currentQuestion === questions.length - 1)
            setIsQuizFinished(true);
        else
            setCurrentQuestion(currentQuestion + 1);
    }

    function restartQuiz() {
        setUserAnswers(new Array(questions.length).fill('')); // Initialize user answers
        setCurrentQuestion(0);
        setIsQuizFinished(false);
    }

    /*if (isQuizFinished) {
        return <Results userAnswers={userAnswers} questionBank={questionBank} restartQuiz={restartQuiz}/>;
    }*/

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
                    {questions[currentQuestion].options.map((option, index) => (
                        <>
                            <Button
                                key={index}
                                title={String.fromCharCode(index + 65) + ": " + option}
                                onPress={() => handleSelectedOption(option)}
                            />
                        </>
                    ))}
                </View>
            )
        }

    }

    if (isQuizFinished) {
        return <Results userAnswers={userAnswers} questionBank={questions} restartQuiz={restartQuiz} startTime={startTime} />;
    }

    return (
        
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className="text-5xl text-white font-bold mt-5 mb-3">{courseName}</Text>
            <QuestionNav questions={questions} setQuestion={setCurrentQuestion}/>
            <Text className='text-white text-xl mb-5'>Question {currentQuestion + 1} of {questions.length}</Text>
            <Text className='text-white text-lg mb-5'>Time Elapsed: {formatElapsedTime(elapsedTime)} </Text>
            <ScrollView>
                {renderQuestionContent()}
            </ScrollView>
            <Button title='previous question ' onPress={goToPrev} disabled={currentQuestion === 0} />
            <Button title='save to 錯題簿' />
            <Button title={currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"} onPress={goToNext} />
        </View>
    )
}

export default DisplayQuestion;