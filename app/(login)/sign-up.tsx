import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, ScrollView, Alert} from 'react-native';
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
                <ScrollView className='bg-white h-full' keyboardShouldPersistTaps="handled">
                    <Text>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <Text>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                    />
                    <Text>Confirm Password</Text>
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm password"
                        secureTextEntry
                    />
                    <Button title="Sign Up" onPress={handleSignUp} />
                    <Button title="Login" onPress={() => router.replace("/(login)/login")} />
                </ScrollView>
            </KeyboardAvoidingView>
  )
}

export default Sign_up