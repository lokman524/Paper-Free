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
    <View className=' bg-white '>
      <View className='topbar'>
        <View>
          <Text className="big-title">題庫</Text>
          <Text className="small-title">Select a Subject</Text>
        </View>
      </View>
      {/* Divider */}
      <View className="my-6 mx-6 border-b border-gray-200" />
      <ScrollView>
        {questionBankAvailable.map((questionBank) => (
          <View key={questionBank.courseID} className='mx-5 my-1'>
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
              <Pressable className='card bg-blue-400'>
                <Text className='text-white text-lg font-bold mb-2'>{questionBank.courseName} ({questionBank.questionCount} questions)</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default subject_selection