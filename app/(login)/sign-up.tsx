import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { createUser } from '@/services/appwrite';

const Sign_up = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleSignUp = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        if (!(password === confirmPassword)){
            alert('Password is different from confirm password');
            return;
        }
        //handle signin function
        try {
            await createUser({
                email: email,
                password: password,
            })
            Alert.alert("User sign up successfully")
            router.replace("/");
        }
        catch (error: any){
            Alert.alert('Error', error.message)
        }
        //router.push("/(login)/login");
    };


  return (
     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className='bg-white mt-40 h-full rounded-3xl' keyboardShouldPersistTaps="handled">
            <Text className='text-4xl flex-col mt-10 ml-6 font-bold'>Sign Up</Text>
            <Text className='mt-1 ml-6 text-gray-400'>Enter your email and password to create an account</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                className=' h-12 mt-10 ml-6 mr-10 p-3  border border-gray-400 rounded-lg'
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                className=' h-12 mt-7 ml-6 mr-10 p-3  border border-gray-400 rounded-lg'
            />
            {password && <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry
                className=' h-12 mt-7 ml-6 mr-10 p-3  border border-gray-400 rounded-lg'
            />}
            <Pressable onPress={handleSignUp} className="h-12 mt-10 ml-6 mr-10 p-2 bg-blue-400 rounded-lg flex-row justify-center ">
                <Text className="text-white text-xl justify-center">Sign Up</Text>
            </Pressable>  
            <View className='flex-row justify-center'>
                <Text className='mt-3'>{`Already have an account?`}</Text>
                <Pressable onPress={() => router.replace({pathname: "/(login)/login", params: {showLogin: "true"}})} className="mt-3 ml-3" >
                    <Text className="text-blue-500 ">Log In</Text>
                </Pressable> 
            </View> 
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Sign_up