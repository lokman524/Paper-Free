import { View, Text, Image, ScrollView, TextInput, Button} from 'react-native'
import { images } from '@/constants/images'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { questionBank } from '../../subject_selection'
import Results from '@/components/Results'

const DisplayQuestion = () => {

    const {id , subject} = useLocalSearchParams();
    const questions = questionBank[subject as keyof typeof questionBank];

    const initialAnswers = questions.map(() => null);

    const [userAnswers, setUserAnswers] = useState(initialAnswers);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const selectedAnswer = userAnswers[currentQuestion];

    function getIndexById (id, subject) {
        const numberId = Number(id)
        return questionBank[subject as keyof typeof questionBank].findIndex(item => item.id === numberId);
    }

    useEffect(() => {
        const index = getIndexById(id, subject);
        //console.log("index:" + index + " id: " + id + " typeof id" + typeof id + " subject: " + subject);
        setCurrentQuestion(index);
    }, [id, subject])

    useEffect(() => {
        console.log(userAnswers);
    }, [userAnswers])

    function handleSelectedOption(option){
        const newUserAnswers = [...userAnswers];  
        newUserAnswers[currentQuestion] = option;
        setUserAnswers(newUserAnswers);
    }

    function goToPrev (){
        if (currentQuestion > 0)
            setCurrentQuestion(currentQuestion - 1);
    }

    function goToNext (){
        if (currentQuestion === questions.length - 1)
            setIsQuizFinished(true);
        else 
            setCurrentQuestion(currentQuestion + 1);
    }

    function restartQuiz (){
        setUserAnswers(initialAnswers);
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
        if ('options' in questions[currentQuestion]) {
            return (
                <View className='mt-5'>
                    {questions[currentQuestion].options.map((option, index) => (
                        <>
                            <Button 
                                title={String.fromCharCode(index+65) + ": " + option} 
                                onPress={() => handleSelectedOption(option)}
                            />
                        </>
                    ))}
                </View>
            );
        } else {
            return (
                <TextInput 
                    className='h-10 border border-white rounded p-2 mt-5 text-white'
                    placeholder="Type your answer here"
                    placeholderTextColor="lightgray"
                    onChangeText={text => handleSelectedOption(text)}
                />
            );
        }
    }

    if (isQuizFinished) {
        return <Results userAnswers={userAnswers} questionBank={questions} restartQuiz={restartQuiz}/>;
    }
    
    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className="text-5xl text-white font-bold mt-5 mb-3">{id}</Text>
            <ScrollView>
                {renderQuestionContent()}
            </ScrollView>
            <Button title='previous question ' onPress={goToPrev} disabled={currentQuestion === 0}/>
            <Button title='save to 錯題簿'/>
            <Button title={currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"} onPress={goToNext}/>
        </View>
    )
}

export default DisplayQuestion;