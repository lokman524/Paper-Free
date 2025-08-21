import { View, Text, Image, ScrollView, Pressable, Button, TextInput, Modal, useWindowDimensions} from 'react-native'
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

  const { width } = useWindowDimensions();
  const isPhone = width < 768;

  return (
    <View className='flex-1 bg-white'>
      <View className='topbar'>
          <Text className="big-title">錯題簿</Text>
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
      </View>

      {/* Divider */}
      <View className="my-6 mx-6 border-b border-gray-200" />
          
          <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: isPhone ? 'center' : 'flex-start',
          }}
          className='mx-10'>
          
            {savedQuestionsAvailable.length === 0 ? (
              <Text className="text-white">No saved questions available.</Text>
            ) : null}
            {savedQuestionsAvailable.map((savedQuestions, index) => (
              <View key={savedQuestions.courseID} className='mx-5 my-1'>
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
                    backgroundColor: chooseMode && selectedBooks.includes(index) ? '#ffcccc' : '#60a5fa',
                  }}
                  className='card'
                >
                  <Text className='text-white text-lg font-bold mb-2'>{savedQuestions.courseName}</Text>
                  <Text className='text-white'>{savedQuestions.questions.length} questions</Text>
                </Pressable>
              </View>
              
            ))}
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
          
          {/* Fixed Add New Button */}
          <Pressable
            onPress={() => setShowAddNewActionSheet(true)}
            disabled={chooseMode}
            style={{
              position: 'absolute',
              bottom: 30,
              right: 20,
              backgroundColor: chooseMode ? '#cccccc' : '#60a5fa',
              borderRadius: 25,
              paddingHorizontal: 20,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ color: 'white', fontSize: 20, marginRight: 8 }}>+</Text>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Add New</Text>
          </Pressable>
        </View>
  )
}

export default Saved