import { View, Text, FlatList, TouchableOpacity, Button, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { useSavedStore } from '@/store/saved.store';
import CustomDropdown from './DropdownList';

//This component is now just a button to create new error books

//If you need to implement an "add to error book" function, here is a sample code:
/*
  <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <View className="bg-white rounded-lg p-6 m-4 ">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Add to Error Book</Text>
      <Text className="text-gray-600 mb-4">Choose an error book to add these questions:</Text>
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
*/

interface DropdownItem {
  label: string;
  value: string;
}

interface ErrorBookSelectProps {
  data: DropdownItem[];
  onSelect: (value: string) => void;
}

const ErrorBookSelect = ({ data, onSelect }: ErrorBookSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItem | null>(null);
  const [showAddNew, setShowAddNew] = useState<boolean>(false);
  const [addNewInput, setAddNewInput] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const createErrorBook = useSavedStore((state) => state.createErrorBook);

  const toggleAddNew = () => {
    setShowAddNew(!showAddNew);
    setAddNewInput(''); // Reset input when toggling
  };

  const handleSelect = (item: DropdownItem) => {
    setSelectedValue(item);
  };
  
  return (
    <View className=''>
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity className={"w-full rounded-xl shadow-sm p-4 mb-3"} style={{ backgroundColor: selectedValue && item.label === selectedValue?.label ? '#023e8a' : '#60a5fa' }} onPress={() => handleSelect(item)}>
            <Text className={"text-black"}>{item.label}</Text>
          </TouchableOpacity>
        )}
      /> */}
      <Button title='create new error book' onPress={toggleAddNew}/>
      {showAddNew && (
        <View className='border-gray-400 rounded-lg p-4 mt-4 bg-gray-200 space-y-2'>
          <Text className='text-black'>Enter name of the new error book: </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
            value={addNewInput}
            onChangeText={text => setAddNewInput(text)}
            placeholder='New Error Book Name'
            placeholderTextColor='gray'
          />
          <Button title='create' onPress={() => {createErrorBook(addNewInput); setShowAddNew(false); Alert.alert("Error Book Created")}}/>
          <Button title='cancel' onPress={toggleAddNew}/>
        </View>
      )}
    </View>
  );
};

export default ErrorBookSelect