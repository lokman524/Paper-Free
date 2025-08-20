import { View, Text, FlatList, TouchableOpacity, Button, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useSavedStore } from '@/store/saved.store';

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

  const createErrorBook = useSavedStore((state) => state.createErrorBook);

  const toggleAddNew = () => {
    setShowAddNew(!showAddNew);
    setAddNewInput(''); // Reset input when toggling
};

  const handleSelect = (item: DropdownItem) => {
    setSelectedValue(item);
  };

  return (
    <View className='flex-1 bg-gray-800 p-4'>
      <Text className='text-white mb-4'>Select an Error Book:</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Text className={selectedValue && item.label === selectedValue?.label ? "text-blue-400" : "text-white"}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title='add new' onPress={toggleAddNew}/>
      {showAddNew && (
        <>
          <Text className='text-white'>Enter name of error book: </Text>
          <TextInput
            className='bg-gray-700 text-white p-2 rounded'
            value={addNewInput}
            onChangeText={text => setAddNewInput(text)}
            placeholder='New Error Book Name'
            placeholderTextColor='gray'
          />
          <Button title='create' onPress={() => {createErrorBook(addNewInput); setShowAddNew(false);}}/>
          <Button title='cancel' onPress={toggleAddNew}/>
        </>
      )}
      <Button title='add' onPress={() => selectedValue && onSelect(selectedValue.value)} disabled={selectedValue===null}/>
    </View>
  );
};

export default ErrorBookSelect