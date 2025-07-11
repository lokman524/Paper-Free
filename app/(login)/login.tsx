import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, ScrollView, Alert} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { signIn } from '@/services/appwrite';
import useAuthStore from '@/store/auth.store';

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        try {
            await signIn({email, password});
            await useAuthStore.getState().fetchAuthenticatedUser();
            router.replace('/');
        } catch (error: any) {
            if (
                error.message?.toLowerCase().includes("invalid credentials") ||
                error.code === 401
            ) {
                Alert.alert("Login Failed", "Wrong user name or password.");
            } else {
                Alert.alert("Error", error.message || "Login error");
            }
        }
    };

    const handleSignup = () => {
        // Handle signup navigation here
        router.replace("/(login)/sign-up")
    };

    const handleForgotPassword = () => {
        // Handle forgot password navigation here
    };

    const toggleRememberMe = () => setRememberMe(previousState => !previousState);

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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Remember me</Text>
                </View>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={rememberMe ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleRememberMe}
                    value={rememberMe}
                />
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text>Forgot Password?</Text>
                </TouchableOpacity>
                <Button title="Login" onPress={handleLogin} />
                <Button title="Sign Up" onPress={handleSignup} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;