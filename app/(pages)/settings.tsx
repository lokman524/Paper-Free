import { View, Text, ScrollView, Button, Switch, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants/images'
import { Image } from 'react-native'
import { account, appwriteConfig, databases } from '@/services/appwrite'
import authStore from '@/store/auth.store'
import { router } from 'expo-router'
import CustomDropdown from '@/components/DropdownList'
import * as ImagePicker from 'expo-image-picker';

const Settings = () => {
  const [showChangeNameInput, setShowChangeNameInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [showChangePasswordInput, setShowChangePasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(authStore.getState().user?.avatarUrl || "");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFontSizeDropDown, setShowFontSizeDropdown] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [showReportProblemInput, setShowReportProblemInput] = useState(false);
  const [reportProblem, setReportProblem] = useState("");

  const toggleShowChangeNameInput = () => {
    setShowChangeNameInput(previousState => !previousState);
  };
  
  const handleChangeName = async () => {
    const { user } = authStore.getState();
    if (!user) return;
    try{
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,
        { name: newName }
      );
      authStore.getState().setUser({...user, name: newName });
    }
    catch (error) {
      console.error("Error changing name:", error);
    }
  }

  const toggleShowChangePasswordInput = () => {
    setShowChangePasswordInput(previousState => !previousState);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    else {
      try {
        await account.updatePassword(newPassword);
        console.log("Password changed successfully");
      } catch (error) {
        console.error("Error changing password:", error);
      }
    }
  };

  const handleChangeIcon = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const { user } = authStore.getState();
      if (!user) return;
      try{
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.$id,
          {avatar: uri}
        );
        authStore.getState().setUser({...user, avatar: uri});
        Alert.alert("Icon updated successfully")
      }
      catch (e) {
        Alert.alert("Error changing icon: " + e);
      }
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
    // Change the app theme here
  };

  const toggleShowFontSizeDropdown = () => {
    setShowFontSizeDropdown(previousState => !previousState);
  };

  const handleFontSizeSelect = (value: string) => {
    setFontSize(value);
    console.log("Selected Font Size: ", value);
    // Change font size here
  };

  const toggleShowReportProblemInput = () => {
    setShowReportProblemInput(previousState => !previousState);
  };

  const handleLogout = async () => {
    await account.deleteSession('current');
    authStore.getState().setIsAuthenticated(false);
    authStore.getState().setUser(null);
    router.replace('/(login)/login');
  }



  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
      <Text className="text-5xl text-white font-bold mt-5 mb-3">設定</Text>
      <ScrollView className='flex-1 px-5 pt-10'>
        <Button title="change name" onPress={() => toggleShowChangeNameInput()} />
        {showChangeNameInput && (
          <>
            <Text className='text-white'>New Name:</Text>
            <TextInput
              className='h-10 border border-white rounded p-2 text-white'
              placeholder="Enter new name"
              placeholderTextColor="lightgray"
              onChangeText={text => setNewName(text)}
            />
            <Button title="Submit" onPress={() => {
              handleChangeName();
              setNewName(""); // Clear input after submission
              console.log("New Name:", newName);
              setShowChangeNameInput(false);
            }} />
          </>
        )}
        {/* this feature does not work in Expo Go */}
        <Button title='change password' onPress={() => toggleShowChangePasswordInput()}/>
        {showChangePasswordInput && (
          <>
            <Text className='text-white'>New Password: </Text>
            <TextInput 
              className='h-10 border border-white rounded p-2 text-white'
              placeholder="Enter new password"
              placeholderTextColor="lightgray"
              secureTextEntry={true}
              onChangeText={text => setNewPassword(text)} />
            <Text className='text-white'>Confirm New Password: </Text>
            <TextInput
              className='h-10 border border-white rounded p-2 text-white'
              placeholder="Confirm new password"
              placeholderTextColor="lightgray"
              secureTextEntry={true}
              onChangeText={text => setConfirmPassword(text)} />
            <Button title="Submit" onPress={() => {
              handleChangePassword();
              setNewPassword(""); 
              setConfirmPassword(""); 
              setShowChangePasswordInput(false);
            }} />
          </>
        )}
        <Button title='change icon' onPress={() => handleChangeIcon()} />
        <Text className='text-white text-center'>dark mode</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        <Button title="Font Size" onPress={() => toggleShowFontSizeDropdown()} />
        {showFontSizeDropDown && (
          <CustomDropdown
                    data={[
                        { label: 'small', value: 'small' },
                        { label: 'medium', value: 'medium' },
                        { label: 'large', value: 'large' },
                    ]}
                    onSelect={handleFontSizeSelect}
                />
        )}
        <Button title="report problem" onPress={() => toggleShowReportProblemInput()} />
        {showReportProblemInput && (
          <>
            <Text className='text-white'>Report Problem:</Text>
            <TextInput
              className='h-10 border border-white rounded p-2 text-white'
              placeholder="Describe your problem"
              placeholderTextColor="lightgray"
              onChangeText={text => setReportProblem(text)}
            />
            <Button title="Submit" onPress={() => {
              console.log("Reported Problem:", reportProblem);
              setReportProblem("");
              setShowReportProblemInput(false);
            }} />
          </>
        )}
        <Button title="登出" onPress={() => handleLogout()} />
        <Button title="回到首頁" onPress={() => router.back()} />
      </ScrollView>
    </View>
  )
}

export default Settings;