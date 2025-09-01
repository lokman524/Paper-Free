import { View, Text, FlatList, Pressable, Button, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLearningRecordStore } from '@/store/learningRecord.store'
import { Stack, router } from 'expo-router'
import { useSavedStore } from '@/store/saved.store'
import uuid from 'react-native-uuid'
import CustomDropdown from '@/components/DropdownList'
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

  // Dashboard KPIs
  const totalRecords = allLearningRecords.length;
  const correctCount = allLearningRecords.filter((r: any) => r?.userAnswer === r?.answer).length;
  const correctPct = totalRecords > 0 ? Math.round((correctCount / totalRecords) * 100) : 0;
  const incorrectCount = Math.max(0, totalRecords - correctCount);

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
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

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

  return (
    <>
    
    <View className='flex-1 bg-white'>
      <View className='topbar'>
        <Text className="big-title">學習記錄</Text>
        {chooseMode && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
            <Button title="Add Selected" onPress={() => {
              handleAddSelected();
            }} />
            <Button title="Cancel" onPress={() => { setChooseMode(false); setSelectedQuestions([]); setRecordToAdd(null); setShowDropdown(false) }} />
          </View>
        )}
      </View>
      {/* Divider */}
      <View className="my-6 mx-6 border-b border-gray-200" />

      {/* KPI Cards */}
      <View className="px-5">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-xs">Total Records</Text>
            <Text className="text-gray-900 text-2xl font-bold mt-1">{totalRecords}</Text>
          </View>
          <View className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-xs">Correct</Text>
            <Text className="text-gray-900 text-2xl font-bold mt-1">{correctPct}%</Text>
          </View>
          <View className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-xs">Incorrect</Text>
            <Text className="text-gray-900 text-2xl font-bold mt-1">{incorrectCount}</Text>
          </View>
        </View>
      </View>
      
      {/* Spacer */}
      <View style={{ height: 12 }} />
      {allLearningRecords.length === 0 ? (
        <Text className="text-black text-xl text-center">No records found.</Text>
      ) : (
        <FlatList
          data={allLearningRecords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const isCorrect = item?.userAnswer === item?.answer;
            const selected = chooseMode && selectedQuestions.includes(index);
            const cardBg = selected ? 'bg-blue-50' : isCorrect ? 'bg-green-50' : 'bg-red-50';
            const borderCol = selected ? 'border-blue-400' : isCorrect ? 'border-green-300' : 'border-red-300';
            const badgeBg = isCorrect ? 'bg-green-100' : 'bg-red-100';
            const badgeText = isCorrect ? 'text-green-700' : 'text-red-700';
            const dotBg = isCorrect ? '#22c55e' : '#ef4444';
            return (
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
                className={`w-full rounded-xl shadow-sm p-4 mb-3 border ${cardBg} ${borderCol}`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className='text-gray-900 font-semibold'>{index + 1}. {item.title || 'Untitled'}</Text>
                      <View className={`px-2 py-0.5 rounded-full ${badgeBg}`}>
                        <Text className={`text-xxs ${badgeText}`}>{isCorrect ? 'Correct' : 'Wrong'}</Text>
                      </View>
                    </View>
                    <Text className='text-gray-700' numberOfLines={2}>{item.question}</Text>
                    <Text className='text-gray-400 text-xs mt-2'>Completed: {item.finishTime}</Text>
                  </View>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dotBg, marginTop: 6 }} />
                </View>
              </Pressable>
            )
          }}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
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
          backgroundColor: 'rgba(0,0,0,0.5)'
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
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View className="bg-white rounded-lg p-6 m-4 min-w-80 w-11/12">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Add to Error Book</Text>
            <Text className="text-gray-600 mb-4">Choose an error book to add these records:</Text>
            <CustomDropdown
              data={dropdownData}
              value={selectedCourseId}
              onSelect={(val: string) => setSelectedCourseId(val)}
              placeholder="Select error book"
              sheetTitle="Select Error Book"
            />
            <ErrorBookSelect 
              data={dropdownData} 
              onSelect={handleDropdownSelect} 
            />
            <View className="mt-6 space-y-3">
              <Button
                title="Add"
                onPress={() => selectedCourseId && handleDropdownSelect(selectedCourseId)}
                disabled={!selectedCourseId}
              />
              <Button title="Cancel" onPress={() => { setShowDropdown(false); setRecordToAdd(null); setSelectedCourseId(''); }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </>
  )
}

export default LearningRecord;