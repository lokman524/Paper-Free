import { Button, Text, View, TouchableOpacity } from "react-native";
import { Question } from "./[id]";

export default function QuestionNav({questions, setQuestion, setCurrentIndex, startQuestion, numberOfQuestions, currentIndex, userAnswers} : {questions: Question[], setQuestion: any, setCurrentIndex: any, startQuestion: number, numberOfQuestions: number, currentIndex: number, userAnswers: string[]}) {
    const questionList = questions.slice(startQuestion-1, numberOfQuestions+startQuestion-1);
    
    // Calculate progress
    const answeredQuestions = userAnswers.filter(answer => answer.trim() !== '').length;
    const progressPercentage = Math.round((answeredQuestions / numberOfQuestions) * 100);
    
    // Function to get question status color
    const getQuestionStatusColor = (index: number) => {
        const answerIndex = index;
        const hasAnswer = userAnswers[answerIndex] && userAnswers[answerIndex].trim() !== '';
        const isCurrent = currentIndex === index + 1;
        
        if (isCurrent) {
            return 'bg-blue-500'; // Current question
        } else if (hasAnswer) {
            return 'bg-green-500'; // Completed question
        } else {
            return 'bg-gray-400'; // Empty question
        }
    };

    return (
        <View className="w-[25%] h-full bg-gray-100 p-6 border-r border-gray-300">
            {/* Header */}
            <View className="mb-6 mt-5">
                <Text className="text-3xl font-bold text-gray-800 mb-2">Questions</Text>
                <Text className="text-sm text-gray-600">Total: {numberOfQuestions} questions</Text>
            </View>
            
            {/* Progress Section */}
            <View className="mb-6 p-3 bg-white rounded-lg shadow-sm">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Progress</Text>
                <View className="flex-row items-center mb-2">
                    <View className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <View 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{width: `${progressPercentage}%`}}
                        />
                    </View>
                    <Text className="text-xs text-gray-600">{progressPercentage}%</Text>
                </View>
                <Text className="text-xs text-gray-500">{answeredQuestions} of {numberOfQuestions} completed</Text>
            </View>
            
            {/* Question List */}
            <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-3">Questions</Text>
                {questionList.map((_question, index) => {
                    const isCurrentQuestion = currentIndex === index + 1;
                    const statusColor = getQuestionStatusColor(index);
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            className={`flex-row items-center p-3 mb-2 rounded-lg ${
                                isCurrentQuestion ? 'bg-blue-50 border border-blue-200' : 'bg-white'
                            }`}
                            onPress={() => {
                                setQuestion(index + startQuestion - 1)
                                setCurrentIndex(index + 1)
                            }}
                        >
                            {/* Status Indicator */}
                            <View className={`w-3 h-3 rounded-full mr-3 ${statusColor}`} />
                            
                            {/* Question Number */}
                            <Text className={`text-sm font-medium ${
                                isCurrentQuestion ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                                Question {index + 1}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            
            {/* Legend */}
            <View className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                <Text className="text-xs font-semibold text-gray-700 mb-2">Status Legend</Text>
                <View className="space-y-1">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                        <Text className="text-xs text-gray-600">Current</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        <Text className="text-xs text-gray-600">Completed</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                        <Text className="text-xs text-gray-600">Empty</Text>
                    </View>
                </View>
            </View>
        </View>
    )

}