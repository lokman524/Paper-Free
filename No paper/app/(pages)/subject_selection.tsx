import { images } from '@/constants/images'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'


export const questionBankAvailable: {courseName : string, courseID : string, questionCount : number} [] = [
  { courseName: 'Math', courseID : "1204889572890471", questionCount: 3 },
  { courseName: 'Science', courseID: "5987259123456789" ,  questionCount: 2 },
];

const subject_selection = () => {
  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
      <Text className="text-5xl text-white font-bold mt-5 mb-3">題庫</Text>
      <ScrollView>
        <Text className="text-white" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, }}>Select a Subject</Text>
        {questionBankAvailable.map((questionBank) => (
          <Link
            key={questionBank.courseID}
            href={{
              pathname: "/quiz/[subject]",
              params: {
                subject: questionBank.courseName,
                id: questionBank.courseID,
                questionCount: questionBank.questionCount,
                call: 'subject_selection'
              }
            }}
            asChild
          >
            <Pressable style={{ padding: 20, backgroundColor: '#eee', marginBottom: 10 }}>
              <Text>{questionBank.courseName} ({questionBank.questionCount} questions)</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  )
}

export default subject_selection
