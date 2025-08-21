import { View, Text, Button, FlatList, Pressable, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import { useSavedStore } from '@/store/saved.store';
import { Link, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const SavedQuestionListDisplay = () => {
    const allSavedQuestions = useSavedStore(state => state.savedQuestions);
    const removeSavedQuestion = useSavedStore(state => state.removeSavedQuestion);

    const params = useLocalSearchParams();
    const id: string = params.id as string; // course ID
    const courseName: string = params.subject as string;
    const questionCount: number = Number(params.questionCount);

    // Control the visibility of questions and answers
    // Create an array to track the toggle state for each question
    const [toggleQuestions, setToggleQuestions] = useState<boolean[]>([]);
    const toggleShowQuestion = (index: number) => {
        // Create a copy of the current toggle states
        const newToggleStates = [...toggleQuestions];
        // Toggle the state for the specific question
        newToggleStates[index] = !newToggleStates[index];
        setToggleQuestions(newToggleStates);
    };
    const [toggleAnswers, setToggleAnswers] = useState<boolean[]>([]);
    const toggleShowAnswer = (index: number) => {
        // Create a copy of the current toggle states
        const newToggleStates = [...toggleAnswers];
        // Toggle the state for the specific question
        newToggleStates[index] = !newToggleStates[index];
        setToggleAnswers(newToggleStates);
    };

    //Choose mode is where user can select multiple questions to delete
    const [chooseMode, setChooseMode] = useState<boolean>(false);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

    const handleEnterChooseMode = () => {
      setChooseMode(true);
      setSelectedQuestions([longPressedIndex!]); 
      setActionSheetVisible(false);
      setLongPressedIndex(null);
    }

    const toggleSelectQuestion = (index: number) => {
        //If selectedQuestions includes the index, remove it, otherwise add it
        setSelectedQuestions(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    //Delete selected questions
    function handleDeleteSelected() {
      const errorBook = allSavedQuestions.find(item => item.courseID === id);
      if (!errorBook) return;
      const questionsToRemove = selectedQuestions.map(idx => errorBook.questions[idx]);
      Alert.alert(
        "Delete Records",
        "Are you sure you want to delete these records?", 
        [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => {
                removeSavedQuestion(questionsToRemove, id);
                setChooseMode(false);
                setSelectedQuestions([]);
            }}
        ]);
    }

    //State to manage action sheet visibility and store which question was long pressed
    const [actionSheetVisible, setActionSheetVisible] = useState<boolean>(false);
    const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
    
    const handleLongPress = (index: number) => {
        setLongPressedIndex(index);
        setActionSheetVisible(true);
    };

    const handleDeleteSingle = () => {
      const errorBook = allSavedQuestions.find(item => item.courseID === id);
      if (!errorBook) return;
      const questionToRemove = [errorBook.questions[longPressedIndex!]];
      Alert.alert(
        "Delete Record",
        "Are you sure you want to delete this record?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => {
              removeSavedQuestion(questionToRemove, id);
              setActionSheetVisible(false);
              setLongPressedIndex(null);
            }
          }
        ]
      );
    }


    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: '',
                    headerBackTitle: 'Saved',
                    headerStyle: {
                        backgroundColor: '#f9fafb', // bg-gray-50
                    },
                    headerTintColor: '#6b7280', // text-gray-500
                }}
            />
            
            {/* Main Content Area */}
            <View className="flex-1 p-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Saved Questions</Text>
                    <Text className="text-lg text-gray-600">Review your saved questions and start practicing.</Text>
                </View>
                
                {/* Course Info Card */}
                <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">{courseName}</Text>
                    <Text className="text-sm text-gray-500">Total Questions: {questionCount}</Text>
                </View>
                {/* Action Buttons Card */}
                <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <Link
                        href={chooseMode 
                                ? {
                                    pathname: "/quiz/Question/[id]",
                                    params: {
                                        id: id,
                                        courseName: courseName,
                                        isTimerEnabled: "true",
                                        call: "saved",
                                        startQuestion: "1",
                                        numberOfQuestions: `${selectedQuestions.length}`,
                                        questionList: JSON.stringify(selectedQuestions.map(idx => allSavedQuestions.find(item => item.courseID === id).questions[idx])),
                                    }
                                } 
                                : {
                                    pathname: "/quiz/[subject]",
                                    params: { 
                                        subject: courseName,
                                        id: id,
                                        questionCount: questionCount,
                                        call: "saved",
                                    }
                                }} 
                        asChild
                        disabled={questionCount === 0}  // Disable link if no questions
                    >
                        <Button title={chooseMode ? "Start quiz with selected questions" : "Start Quiz"} />
                    </Link>
                    { chooseMode && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                            <Button title="Delete Selected" onPress={() => {
                                handleDeleteSelected();
                            }} />
                            <Button title="Cancel" onPress={() => { setChooseMode(false); setSelectedQuestions([]);}} />
                        </View>
                    )}
                </View>
                
                {/* Questions List Card */}
                <View className="bg-white rounded-lg shadow-sm flex-1">
                    <FlatList 
                        data={allSavedQuestions.find(item => item.courseID === id)?.questions || []}
                        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                        contentContainerStyle={{ padding: 16 }}
                        renderItem={({ item, index }) => (
                            <View className="mb-4">
                                <Pressable 
                                  onLongPress={() => handleLongPress(index)}
                                  onPress={() => chooseMode ? toggleSelectQuestion(index) : toggleShowQuestion(index)} 
                                  className={`p-4 rounded-lg border ${
                                    chooseMode && selectedQuestions.includes(index) 
                                      ? 'bg-blue-100 border-blue-300' 
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                    <Text className='text-gray-800 font-semibold text-base'>{index + 1}. {item.title}</Text>
                                </Pressable>
                                {toggleQuestions[index] && (
                                    <View className="mt-3 p-4 bg-gray-100 rounded-lg">
                                      <Text className='text-gray-800 mb-3 font-medium'>{item.question}</Text>
                                      {item.options && item.options.map((option: string, optionIndex: number) => (
                                          <Text key={optionIndex} className='text-gray-700 mb-2 ml-2'>
                                              {String.fromCharCode(optionIndex + 65)}. {option}
                                          </Text>
                                      ))}
                                      <View className="mt-3">
                                        <Button title='Show Answer' onPress={() => toggleShowAnswer(index)}/>
                                      </View>
                                      {toggleAnswers[index] && (
                                        <View className="mt-3 p-3 bg-green-100 rounded-lg">
                                          <Text className='text-green-800 font-semibold'>Answer: {item.answer}</Text>
                                        </View>
                                      )}
                                    </View>
                                )}
                            </View>
                        )}
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center py-12">
                                <Text className='text-gray-500 text-center text-lg'>No questions saved yet</Text>
                                <Text className='text-gray-400 text-center mt-2'>Questions you save will appear here</Text>
                            </View>
                        )}
                    />
                </View>
                
                {/* Action sheet that shows when user long press a record */}
                <Modal
                    visible={actionSheetVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setActionSheetVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 24,
                            minWidth: 280,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}>
                            <View style={{ width: '100%', marginBottom: 12 }}>
                                <Button title="Delete this record" onPress={handleDeleteSingle} />
                            </View>
                            <View style={{ width: '100%', marginBottom: 12 }}>
                                <Button title="Enter choose mode" onPress={handleEnterChooseMode} />
                            </View>
                            <View style={{ width: '100%' }}>
                                <Button title="Cancel" onPress={() => {setActionSheetVisible(false); setLongPressedIndex(null)}} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

export default SavedQuestionListDisplay;