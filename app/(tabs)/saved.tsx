import { View, Text, Image, ScrollView, Pressable, Button, TextInput, Modal} from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants/images'
import { Link, router } from 'expo-router';
import { useSavedStore } from '@/store/saved.store';

const Saved = () => {
  const [addNewInput, setAddNewInput] = useState("");
  const [showAddNewActionSheet, setShowAddNewActionSheet] = useState<boolean>(false);
  
  const savedQuestionsAvailable = useSavedStore(state => state.savedQuestions);
  const addErrorBook = useSavedStore(state => state.createErrorBook);
  const removeErrorBooks = useSavedStore(state => state.removeErrorBooks);

//Choose mode is where user can select multiple questions to delete
  const [chooseMode, setChooseMode] = useState<boolean>(false);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);

  const handleEnterChooseMode = () => {
    setChooseMode(true);
    setSelectedBooks([longPressedIndex!]); 
    setLongPressActionSheetVisible(false);
    setLongPressedIndex(null);
  }

  const toggleSelectBook = (index: number) => {
    //If selectedQuestions includes the index, remove it, otherwise add it
    setSelectedBooks(prev =>
      prev.includes(index)
      ? prev.filter(i => i !== index)
      : [...prev, index]
    );       
  }

  //Delete selected questions
  function handleDeleteSelected() {
    const courseIDsToDelete = selectedBooks.map(idx => savedQuestionsAvailable[idx].courseID);
    removeErrorBooks(courseIDsToDelete);
    setChooseMode(false);
    setSelectedBooks([]);
  }
  
  //State to manage action sheet visibility and store which question was long pressed
  const [longPressActionSheetVisible, setLongPressActionSheetVisible] = useState<boolean>(false);
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
      
  const handleLongPress = (index: number) => {
    setLongPressedIndex(index);
    setLongPressActionSheetVisible(true);
  };
  
  const handleDeleteSingle = () => {
    const courseID = savedQuestionsAvailable[longPressedIndex!].courseID;
    removeErrorBooks(courseID);
    setLongPressActionSheetVisible(false);
    setLongPressedIndex(null);
  }

  return (
    <View className='flex-1 bg-primary'>
          <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
          <Text className="text-5xl text-white font-bold mt-5 mb-3">錯題簿</Text>
          { chooseMode && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
              <Button title="Delete Selected" onPress={() => {
                handleDeleteSelected();
                setChooseMode(false);
                setSelectedBooks([]);
              }} />
              <Button title="Cancel" onPress={() => { setChooseMode(false); setSelectedBooks([]);}} />
            </View>
          )}
          <ScrollView>
            <Text className="text-white" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, }}>Select a 錯題簿</Text>
            {savedQuestionsAvailable.length === 0 ? (
              <Text className="text-white">No saved questions available.</Text>
            ) : null}
            {savedQuestionsAvailable.map((savedQuestions, index) => (
              <Pressable 
                key={savedQuestions.courseName}
                onLongPress={() => handleLongPress(index)}
                onPress={() => {
                  if (chooseMode) {
                    toggleSelectBook(index);
                  } else {
                    router.push({
                      pathname: "/savedQuestionListDisplay",
                      params: { 
                        subject: savedQuestions.courseName,
                        id: savedQuestions.courseID,
                        questionCount: savedQuestions.questions.length,
                      }
                    });
                  }
                }}
                style={{ 
                  padding: 20, 
                  backgroundColor: chooseMode && selectedBooks.includes(index) ? '#ffcccc' : '#eee',
                  marginBottom: 10 
                }}
              >
                <Text>{savedQuestions.courseName} ({savedQuestions.questions.length} questions)</Text>
              </Pressable>
            ))}
            <Button title='add new' onPress={() => setShowAddNewActionSheet(true)} disabled={chooseMode}/>
            {/* Action sheet that shows when user press the add new error book button */}
            <Modal
                visible={showAddNewActionSheet}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAddNewActionSheet(false)}
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
                      <Text className='text-black'>Name of new error book: </Text>
                      <TextInput
                        className='h-10 border border-white rounded p-2 text-black'
                        placeholder="Enter name"
                        placeholderTextColor="lightgray"
                        onChangeText={text => setAddNewInput(text)}
                      />
                      <Button title="submit" onPress={() => {
                        addErrorBook(addNewInput)
                        setShowAddNewActionSheet(false);
                        setAddNewInput("");
                      }}/>
                      <Button title="Cancel" onPress={() => {
                        setShowAddNewActionSheet(false);
                        setAddNewInput("");
                      }}/>
                    </View>
                </View>
            </Modal>
            {/* Action sheet that shows when user long press a record */}
            <Modal
              visible={longPressActionSheetVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setLongPressActionSheetVisible(false)}
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
                   <Button title="Cancel" onPress={() => {setLongPressActionSheetVisible(false); setLongPressedIndex(null)}} />
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
  )
}

export default Saved