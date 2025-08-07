import { View, Text, FlatList, Image, Pressable, Button, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import { useLearningRecordStore } from '@/store/learningRecord.store'
import { Link, router } from 'expo-router'
import { useSavedStore } from '@/store/saved.store'
import uuid from 'react-native-uuid'
import ErrorBookSelect from '@/components/ErrorBookSelect'

//TODO: format date to a more readable format
const LearningRecord = () => {
  const allLearningRecords = useLearningRecordStore(state => state.allLearningRecords)

  const [chooseMode, setChooseMode] = useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [actionSheetVisible, setActionSheetVisible] = useState<boolean>(false);
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);

  const handleLongPress = (index: number) => {
    setLongPressedIndex(index);
    setActionSheetVisible(true);
  }
  
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

  const errorBooks = useSavedStore(state => state.savedQuestions);
  const addSavedQuestion = useSavedStore(state => state.addSavedQuestion);

  //data to pass to DropdownList component
  const dropdownData = errorBooks.map(book => ({
    label: book.courseName,
    value: book.courseID,
  }));

  const [showDropdown, setShowDropdown] = useState(false);
  const [recordToAdd, setRecordToAdd] = useState<any | null>(null); // single or array

  //Handle adding single learning record to saved
  const handleAddSingle = () => {
    setActionSheetVisible(false);
    setShowDropdown(true);
    setRecordToAdd(allLearningRecords[longPressedIndex!]);
    setLongPressedIndex(null);
  }

  //Handle adding selected learning records to saved
  const handleAddSelected = () => {
    setActionSheetVisible(false);
    setShowDropdown(true);
    setRecordToAdd(selectedQuestions.map(idx => allLearningRecords[idx]));
  }

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

  //Function passed to DropdownList component as onSelect() prop
  //courseID will be dropdownData.value
  const handleDropdownSelect = (courseID: any) => {
    let recordsToAdd = Array.isArray(recordToAdd) ? recordToAdd : [recordToAdd];
    recordsToAdd = recordsToAdd.map(sanitizeQuestion);
    //Supposed add to backend, but for now i will add to savedQuestionStore locally
    addSavedQuestion(recordsToAdd, courseID);
    Alert.alert("Record(s) added");
    setActionSheetVisible(false);
    setShowDropdown(false);
    setRecordToAdd(null);
    setChooseMode(false);
    setSelectedQuestions([]);
  }

  if (allLearningRecords.length === 0) {
    return (
      <View className='flex-1 bg-white'>
        <View className='topbar'>
          <Text className="big-title">學習記錄</Text>
        </View>
        {/* Divider */}
        <View className="my-6 mx-6 border-b border-gray-200" />
        <Text className="text-black text-xl text-center">No records found.</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-white'>
      <View className='topbar'>
        <Text className="big-title">學習記錄</Text>
        {chooseMode && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
            <Button title="Add Selected" onPress={() => {
              handleAddSelected();
            }} />
            <Button title="Cancel" onPress={() => { setChooseMode(false); setSelectedQuestions([]); setRecordToAdd(null); setShowDropdown(false)}} />
          </View>
        )}
      </View>
      {/* Divider */}
      <View className="my-6 mx-6 border-b border-gray-200" />
      
      <FlatList
        data={allLearningRecords}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item, index }) => (
            <Pressable 
              onLongPress={() => handleLongPress(index)}
              onPress={() => {
                if (chooseMode) {
                  toggleSelectQuestion(index);
                } else {
                  router.push({
                    pathname: "/[learning_record_question]",
                    params: { 
                      title: item.title,
                      question: item.question, 
                      type: item.type, 
                      options: item?.options, 
                      answer: item.answer, 
                      userAnswer: item.userAnswer 
                    }
                  })
                }
              }}
              style={{ 
                backgroundColor: chooseMode && selectedQuestions.includes(index) ? '#79BAEC' : '#60a5fa',
              }}
              className='w-full md:w-36 h-16 rounded-2xl shadow-lg items-start justify-start p-3'
            >
              <Text>Date: {(item.finishTime)}</Text>
              <Text>{index + 1}. {item.question}</Text>
            </Pressable>
        )}
        contentContainerStyle={{ padding: 20 }}
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
                              <Button title="Add this record" onPress={handleAddSingle} />
                              <Button title="Enter choose mode" onPress={handleEnterChooseMode} />
                              <Button title="Cancel" onPress={() => {
                                setActionSheetVisible(false); 
                                setLongPressedIndex(null);
                                setShowDropdown(false);
                                setRecordToAdd(null);
                              }} />
                          </View>
                      </View>
      </Modal>
      {/* Dropdown for selecting error book */}
      <Modal
                      visible={showDropdown}
                      transparent
                      animationType="fade"
                      onRequestClose={() => setShowDropdown(false)}
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
                              <Text className='text-black mb-2'>Select an error book to add record(s):</Text>
                              <ErrorBookSelect 
                                  data={dropdownData} 
                                  onSelect={handleDropdownSelect} 
                              />
                              <Button title="Cancel" onPress={() => {
                                setActionSheetVisible(false);
                                setShowDropdown(false);
                                setRecordToAdd(null);
                              }}/>
                          </View>
                      </View>
      </Modal>
    </View>
  )
}

export default LearningRecord;