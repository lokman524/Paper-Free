  import React, { useState } from 'react';
  import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
  import { Picker } from '@react-native-picker/picker';

  type Option = { label: string; value: string };
  
  type Props = {
    data: Option[];
    onSelect: (value: string) => void;
    value?: string;
    placeholder?: string;
    sheetTitle?: string;
  };

  const CustomDropdown = ({ data, onSelect, value, placeholder = 'Select an option', sheetTitle = 'Select' }: Props) => {
    const [internalValue, setInternalValue] = useState<string>(value ?? '');
    const [isVisible, setIsVisible] = useState(false);
    const current = value ?? internalValue;
    const [tempValue, setTempValue] = useState<string>(current);

    const open = () => {
      setTempValue(current);
      setIsVisible(true);
    };
    const close = () => setIsVisible(false);
    const confirm = () => {
      // commit tempValue
      setInternalValue(tempValue);
      if (tempValue !== '') onSelect(tempValue);
      setIsVisible(false);
    };

    // Label to show on the field
    const selectedLabel =
      (data.find((d) => d.value === current)?.label) || placeholder;

    return (
      <>
        <TouchableOpacity onPress={open} className='border border-gray-300 rounded-2xl p-3'>
          <Text>{selectedLabel}</Text>
        </TouchableOpacity>

        <Modal visible={isVisible} transparent animationType="slide" onRequestClose={close}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '55%', paddingBottom: 8 }}>
              {/* Toolbar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 }}>
                <TouchableOpacity onPress={close}>
                  <Text style={{ color: '#3b82f6', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{sheetTitle}</Text>
                </View>
                <TouchableOpacity onPress={confirm}>
                  <Text style={{ color: '#3b82f6', fontSize: 16, fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
              </View>

              <Picker
                selectedValue={tempValue}
                onValueChange={(val: string) => setTempValue(val)}
                {...(Platform.OS === 'android' ? { mode: 'dialog' as const } : {})}
                style={{ backgroundColor: 'white', ...(Platform.OS === 'ios' ? { height: 216 } : null) }}
                itemStyle={Platform.OS === 'ios' ? { fontSize: 18, color: '#111827' } : undefined}
                {...(Platform.OS === 'android' ? { dropdownIconColor: '#111827' } : {})}
              >
                <Picker.Item label={placeholder} value="" color="#9CA3AF" />
                {(data && data.length > 0 ? data : []).map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} color="#111827" />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  export default CustomDropdown;
