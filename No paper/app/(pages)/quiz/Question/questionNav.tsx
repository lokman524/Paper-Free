import { Button, Text, View } from "react-native";
import { Question } from "./[id]";

export default function QuestionNav({questions, setQuestion, setCurrentIndex, startQuestion, numberOfQuestions} : {questions: Question[], setQuestion: any, setCurrentIndex: any, startQuestion: number, numberOfQuestions: number}) {
    const questionList = questions.slice(startQuestion-1, numberOfQuestions+startQuestion-1);

    return (
    
        <View>
            <View className="flex-row justify-between items-center p-4 bg-secondary">
                <Text className="text-white text-lg font-bold">Question Navigation</Text>
                <Text className="text-white text-lg font-bold">Total Questions: {numberOfQuestions}</Text>
                {questionList.map((_question, index) => (
                    <Button
                        key={index}
                        title={`Q${index + 1}`}
                        onPress={() => {
                            setQuestion(index + startQuestion - 1)
                            setCurrentIndex(index+1)
                        }}
                    />
                ))}
            </View>
        </View>
    
    )

}
