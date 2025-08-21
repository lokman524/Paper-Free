import { View, Text, ScrollView, Button, Alert, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import uuid from 'react-native-uuid';
import { useSavedStore } from '@/store/saved.store';
import ErrorBookSelect from '@/components/ErrorBookSelect';

//This is a page showing question from learning record specifically
//Normally i should reuse the question component but i fucked up the code there so i'll just make a new one
const LearningRecordQuestion = () => {
    const params = useLocalSearchParams();
    const title = params.title as string;
    const question = params.question as string;
    const type = params.type as string;
    const options = (params.options as string[])? params.options.split(',').map((option: string) => option.trim()) : undefined; // Convert options to an array if it exists
    const answer = params.answer as string;
    const userAnswer = params.userAnswer as string;

    const [showUserAnswer, setShowUserAnswer] = useState<boolean>(false);
    const toggleShowUserAnswer = () => {
        setShowUserAnswer(!showUserAnswer);
    }

    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const toggleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    }

    const errorBooks = useSavedStore(state => state.savedQuestions);
    const addSavedQuestion = useSavedStore(state => state.addSavedQuestion);

    //data to pass to DropdownList component
    const dropdownData = errorBooks.map(book => ({
        label: book.courseName,
        value: book.courseID,
    }));

    //To control the dropdown for adding to error book
    const [showDropdown, setShowDropdown] = useState(false);
    const [recordToAdd, setRecordToAdd] = useState<any | null>(null);

    //Function to sanitize the question object before adding to saved questions
    //This ensures that the question object matches the expected structure in saved.store.ts
    const sanitizeQuestion = (q: any) => ({
        id: uuid.v4(),
        title: q.title,
        type: q.type,
        question: q.question,
        options: q.options ? q.options : [],
        answer: q.answer,
    });

    const handleAddSingle = () => {
        setShowDropdown(true);
        setRecordToAdd(sanitizeQuestion(params));
    }

    const handleDropdownSelect = (courseID: any) => {
        let recordsToAdd = [recordToAdd];
        //Supposed add to backend, but for now i will add to savedQuestionStore locally
        addSavedQuestion(recordsToAdd, courseID);
        Alert.alert("Record(s) added");
        setShowDropdown(false);
        setRecordToAdd(null);
    }

  // Render helpers aligned with [id].tsx styling
  function renderQuestionContent() {
    return (
      <>
        {question ? (
          <Text className="text-2xl text-gray-800 leading-8 mb-6">{question}</Text>
        ) : null}
        {type === 'MULTIPLE_CHOICE' && options ? (
          <View className="mt-4">
            {options.map((option: string, index: number) => {
              const isSelected = userAnswer === option;
              return (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center p-3 mb-2 border border-gray-200 rounded-lg"
                  activeOpacity={0.8}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3 items-center justify-center">
                    {isSelected && <View className="w-3 h-3 rounded-full bg-blue-500" />}
                  </View>
                  <Text className={`text-xl flex-1 ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                    {String.fromCharCode(index + 65)}. {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
        {type === 'LONG_ANSWER' && (
          <View className="mt-4">
            <Text className="text-lg text-gray-700">This is a long answer question.</Text>
          </View>
        )}
      </>
    );
  }

  return (
    <View className="flex-1 flex-row">
      {/* Main Content Area */}
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="mb-4 mt-5">
          <Text className="text-4xl font-bold text-gray-800 mb-2">{title}</Text>
          <Text className="text-2xl text-gray-600">Learning Record</Text>
        </View>

        {/* Question Content */}
        <ScrollView className="flex-1 mb-6">
          <View className="bg-white p-6 rounded-lg shadow-sm">
            {renderQuestionContent()}
            {/* Answers toggles */}
            <View className="mt-6">
              <Button title={showUserAnswer ? 'Hide Your Answer' : 'Show Your Answer'} onPress={toggleShowUserAnswer} />
              {showUserAnswer && (
                <Text className="text-gray-700 text-lg mt-2">Your Answer: {userAnswer || '-'}</Text>
              )}
            </View>
            <View className="mt-4">
              <Button title={showAnswer ? 'Hide Model Answer' : 'Show Model Answer'} onPress={toggleShowAnswer} />
              {showAnswer && (
                <Text className="text-gray-700 text-lg mt-2">Model Answer: {answer || '-'}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row justify-end items-center">
          <Button title='Save to 錯題簿' onPress={() => handleAddSingle()} />
          <View style={{ width: 12 }} />
          <Button title='Back' onPress={() => router.back()} />
        </View>
      </View>

      {/* Dropdown for selecting error book */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, minWidth: 200, alignItems: 'center' }}>
            <Text className='text-black mb-2'>Select an error book to add record(s):</Text>
            <ErrorBookSelect data={dropdownData} onSelect={handleDropdownSelect} />
            <Button title="Cancel" onPress={() => { setShowDropdown(false); setRecordToAdd(null); }} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default LearningRecordQuestion
