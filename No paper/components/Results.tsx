import { View, Text, Button, Image} from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { images } from '@/constants/images';

const Results = ({userAnswers, questionBank, restartQuiz}) => {


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
        router.push("/subject_selection");
    }

    const score = getScore();

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className='text-white mt-10'>Quiz completed!</Text>
            <Text className='text-white'>Your Score: {score}/{questionBank.length}</Text>
            <Button title='go back' onPress={handleGoBack}/>
        </View>
    )
}

export default Results