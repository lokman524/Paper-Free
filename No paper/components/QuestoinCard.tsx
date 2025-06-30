import { View, Text } from 'react-native'
import React from 'react'

interface QuestionCardProps {
  id: number,
  isMcQuestion: boolean,
  title: string | undefined,
  question: string | undefined,
  index: number,
}

const QuestionCard = ({id, isMcQuestion, title, question, index}: QuestionCardProps) => {
  return (
    <View>
      <Text className="text-5xl text-white font-bold mt-5 mb-3">{id} {title}</Text>
    </View>
  )
}

export default QuestionCard;