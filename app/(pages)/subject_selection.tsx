import { images } from '@/constants/images'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native'


export const questionBankAvailable: { courseName: string, courseID: string, questionCount: number }[] = [
  { courseName: 'Math', courseID: "1204889572890471", questionCount: 3 },
  { courseName: 'Science', courseID: "5987259123456789", questionCount: 2 },
];

const subject_selection = () => {
  const { width } = useWindowDimensions();
  const isPhone = width < 768;
  return (
    <View className=' bg-white  h-screen'>
      <View className='topbar'>
        <View>
          <Text className="big-title">題庫</Text>
          <Text className="small-title">Select a Subject</Text>
        </View>
      </View>
      {/* Divider */}
      <View className="my-6 mx-6 border-b border-gray-200" />

        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: isPhone ? 'center' : 'flex-start',
          }}
          className='mx-10'
        >
          {questionBankAvailable.map((questionBank) => (
            <View
              key={questionBank.courseID}
              className='my-1'
              style={{ width: isPhone ? '50%' : undefined, paddingHorizontal: isPhone ? 8 : 20 }}
            >
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
                  <Text className='text-white text-lg font-bold'>{questionBank.courseName}
                  </Text>
                  <Text className='text-white text-lg font-light'>
                      ({questionBank.questionCount} questions)
                    </Text>               
                </Pressable>
              </Link>
            </View>
          ))}
        </ScrollView>
    </View>
  )
}

export default subject_selection