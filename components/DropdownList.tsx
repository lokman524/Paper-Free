  import React, { useState } from 'react';
  import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

  const CustomDropdown = ({ data, onSelect }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const toggleModal = () => setModalVisible(!isModalVisible);

    const handleSelect = (item) => {
      setSelectedValue(item);
      onSelect(item.value);
      toggleModal();
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleModal}>
          <Text className='text-white'>{selectedValue ? selectedValue.label : "Select an option"}</Text>
        </TouchableOpacity>
        <Modal visible={isModalVisible} transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <FlatList
                data={data}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelect(item)}>
                    <Text style={styles.option}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      margin: 20,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
    },
    option: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#e74c3c',
      borderRadius: 5,
      textAlign: 'center',
      color: 'white',
    },
  });

  export default CustomDropdown;
