import { View, Text, Image, Button, FlatList, Pressable, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import { useSavedStore } from '@/store/saved.store';
import { Link, useLocalSearchParams } from 'expo-router';
import { images } from '@/constants/images';
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
        <SafeAreaView className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className="text-5xl text-white font-bold mt-5 mb-3">{courseName}</Text>
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
                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                    <Button title="Delete Selected" onPress={() => {
                        handleDeleteSelected();
                    }} />
                    <Button title="Cancel" onPress={() => { setChooseMode(false); setSelectedQuestions([]);}} />
                </View>
            )}
            <FlatList 
                data={allSavedQuestions.find(item => item.courseID === id)?.questions || []}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item, index }) => (
                    <>
                        <Pressable 
                          onLongPress={() => handleLongPress(index)}
                          onPress={() => chooseMode ? toggleSelectQuestion(index) : toggleShowQuestion(index)} 
                          style={{ 
                            padding: 20, 
                            backgroundColor: chooseMode && selectedQuestions.includes(index) ? '#79BAEC' : '#eee', 
                            marginBottom: 10 
                          }}
                        >
                            <Text className='text-black mb-2'>{index + 1}. {item.title}</Text>
                        </Pressable>
                        {toggleQuestions[index] && ( // Check the specific toggle state for this question
                            <>
                              <Text className='text-white'>{item.question}</Text>
                              {item.options && item.options.map((option: string, index: number) => (
                                  <Text key={index} className='text-white mb-2'>
                                      {String.fromCharCode(index + 65)}. {option}
                                  </Text>
                              ))}
                              <Button title='show answer' onPress={() => toggleShowAnswer(index)}/>
                              {toggleAnswers[index] && (
                                <Text className='text-white mt-2'>Answer: {item.answer}</Text>
                              )}
                            </>
                        )}
                    </>
                )}
                ListEmptyComponent={() => (
                    <Text className='text-white text-center'>No questions here</Text>
                )}
            />
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
                        borderRadius: 10,
                        padding: 20,
                        minWidth: 200,
                        alignItems: 'center'
                    }}>
                        <Button title="Delete this record" onPress={handleDeleteSingle} />
                        <Button title="Enter choose mode" onPress={handleEnterChooseMode} />
                        <Button title="Cancel" onPress={() => {setActionSheetVisible(false); setLongPressedIndex(null)}} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default SavedQuestionListDisplay;