import { View, Text, Image, ScrollView, Pressable} from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { Link } from 'expo-router';

export const savedQuestionsAvailable: {courseName : string, courseID : string, questionCount : number} [] = [
  { courseName: 'Math', courseID : "1", questionCount: 2 },
  { courseName: 'Science', courseID: "2" ,  questionCount: 1 },
];


const saved = () => {

  return (
    <View className='flex-1 bg-primary'>
          <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
          <Text className="text-5xl text-white font-bold mt-5 mb-3">錯題簿</Text>
          <ScrollView>
            <Text className="text-white" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, }}>Select a 錯題簿</Text>
            {savedQuestionsAvailable.map((savedQuestions) => (
            <Link 
              key={savedQuestions.courseName}
              href={{
                pathname: "/quiz/[subject]",
                params: { 
                  subject: savedQuestions.courseName,
                  id: savedQuestions.courseID,
                  questionCount: savedQuestions.questionCount,
                  call: 'saved'
                }
              }}
              asChild
            >
              <Pressable style={{ padding: 20, backgroundColor: '#eee', marginBottom: 10 }}>
                <Text>{savedQuestions.courseName} ({savedQuestions.questionCount} questions)</Text>
              </Pressable>
            </Link>
          ))}
          </ScrollView>
        </View>
  )
}

export default saved
