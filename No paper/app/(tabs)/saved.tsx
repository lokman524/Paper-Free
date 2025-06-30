import { View, Text, Image, ScrollView, Pressable} from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { Link } from 'expo-router';

export const savedQuestions = {
  "錯題簿 1": [
    {
      id: 1,
      subject: "Math",
      title: "Question 1",
      type: "MULTIPLE_CHOICE",
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      answer: "4"
    },
    {
      id: 2,
      subject: "Math", 
      title: "Question 2",
      type: "LONG_ANSWER",
      question: "Is π greater than 3?",
      answer: "Yes"
    },
    {
      id: 3,
      subject: "Math", 
      title: "Question 3",
      type: "LONG_ANSWER",
      question: "Is π greater than 3?",
      answer: "Yes"
    }
  ],
  "錯題簿 2": [
    {
      id: 1,
      subject: "Science",
      title: "Question 1",
      type: "LONG_ANSWER",
      question: "Explain photosynthesis",
      minWords: 50,
      modelAnswer: "Photosynthesis is..."
    }
  ]
};


const saved = () => {

  return (
    <View className='flex-1 bg-primary'>
          <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
          <Text className="text-5xl text-white font-bold mt-5 mb-3">錯題簿</Text>
          <ScrollView>
            <Text className="text-white" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, }}>Select a 錯題簿</Text>
            {Object.keys(savedQuestions).map((subject) => (
            <Link 
              key={subject}
              href={{
                pathname: "/quiz/[subject]",
                params: { 
                  subject: subject,
                  call: "saved"
                }
              }}
              asChild
            >
              <Pressable style={{ padding: 20, backgroundColor: '#eee', marginBottom: 10 }}>
                <Text>{subject} ({savedQuestions[subject as keyof typeof savedQuestions].length} questions)</Text>
              </Pressable>
            </Link>
          ))}
          </ScrollView>
        </View>
  )
}

export default saved