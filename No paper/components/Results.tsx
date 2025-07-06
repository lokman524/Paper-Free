import { View, Text, Button, Image} from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { images } from '@/constants/images';
import { Question } from '@/app/(pages)/quiz/Question/[id]';

const Results = ({userAnswers, questionBank, restartQuiz, startTime, finishTime, call, isTimerEnabled, numberOfQuestions} : {userAnswers : string[], questionBank : Question[], restartQuiz: any, startTime: number, finishTime: number, call: string, isTimerEnabled: string, numberOfQuestions: number}) => {

    function getScore(){
        let finalScore = 0;
        userAnswers.forEach((answer,index) => {
            if(answer === questionBank[index].answer){
                finalScore++;
            }
        })
        return finalScore;
    }

    function handleGoBack (){
        restartQuiz();
        if (call === "subject_selection")
            router.replace("/subject_selection");
        else if (call === "saved")
            router.dismissTo("/(tabs)/saved")
    }

    const score = getScore();

    //console.log(finishTime + "-" + startTime);

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className='text-white mt-10'>Quiz completed!</Text>
            <Text className='text-white'>Your Score: {score/numberOfQuestions * 100}% ({score}/{numberOfQuestions})</Text>
            {isTimerEnabled === "true" && <Text className='text-white mt-5'>Time Used: {(finishTime - startTime) / 1000} seconds</Text>}
            <Button title='go back' onPress={handleGoBack}/>
        </View>
    )
}

export default Results
