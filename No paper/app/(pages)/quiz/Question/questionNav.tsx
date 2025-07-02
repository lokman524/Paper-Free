import { Button, Text, View } from "react-native";
import { Question } from "./[id]";

export default function QuestionNav({questions, setQuestion} : {questions: Question[], setQuestion: any}) {

    return (
    
        <View>
            <View className="flex-row justify-between items-center p-4 bg-secondary">
                <Text className="text-white text-lg font-bold">Question Navigation</Text>
                <Text className="text-white text-lg font-bold">Total Questions: {questions.length}</Text>
                {questions.map((_question, index) => (
                    <Button
                        key={index}
                        title={`Q${index + 1}`}
                        onPress={() => setQuestion(index)}
                    />
                ))}
            </View>
        </View>
    
    )

}