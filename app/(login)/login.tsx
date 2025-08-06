import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable, Modal} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router, useLocalSearchParams } from 'expo-router';
import { signIn } from '@/services/appwrite';
import useAuthStore from '@/store/auth.store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants/images';
import { Image } from 'react-native';

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    //state to control the visibility of login modal
    const [showLogin, setShowLogin] = useState(false);
    //if user comes from sign-up page, show the login modal
    const params = useLocalSearchParams();
    useEffect(() => {
        if(params.showLogin === "true")
        setShowLogin(true);
    },[])

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
        console.log("handle forget password")
        // Handle forgot password navigation here
    };

    const toggleRememberMe = () => setRememberMe(previousState => !previousState);

    return (
        <SafeAreaView className='flex-1 bg-green-300 relative'>
            <Text className='text-black text-5xl font-bold mx-6'>The Most Trusted</Text>
            <Text className='text-black text-5xl font-bold mx-6'>Platform for</Text>
            <Text className='text-black text-5xl font-bold mx-6'>Exam Prep</Text>
            <Text className='text-gray-500 mt-6 mx-6'>{`Hong Kong's first smart mistake-tracking system,`}</Text>
            <Text className='text-gray-500 mx-6'>{`designed to help students effortlessly log errors and`}</Text>
            <Text className='text-gray-500 mx-6'>{`build customized study materials based on their`}</Text>
            <Text className='text-gray-500 mx-6'>{`unique needs- making review quicker, easier, and`}</Text>
            <Text className='text-gray-500 mx-6'>{`more effective.`}</Text>

            {/* Idk how to deal with the image it will block the words, will come back after i can center a div better */}
            {/* <Image source={images.test} className='flex-1 w-full z-0' resizeMode='cover' /> */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='relative flex-1 items-center'>
                <Pressable onPress={() => setShowLogin(true)} className="absolute bottom-1 h-12 mx-6 p-2 bg-blue-400 rounded-lg flex-row justify-center">
                    <Text className="text-white text-xl justify-center">                       Get Started!                       </Text>
                </Pressable>
                <Modal 
                    visible={showLogin}
                    transparent
                    animationType={"slide"}
                    onRequestClose={() => setShowLogin(false)}
                >
                    
                    <ScrollView className='bg-white mt-40 h-full rounded-3xl' keyboardShouldPersistTaps="handled" scrollEnabled={false} >
                        <Text className='text-4xl flex-col mt-10 mx-6 font-bold'>Login</Text>
                        <Text className='mt-1 mx-6 text-gray-400'>Enter your email and password to log in</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className=' h-12 mt-10 mx-6 p-3  border border-gray-400 rounded-lg'
                        />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry
                            className=' h-12 mt-7 mx-6 p-3  border border-gray-400 rounded-lg'
                        />
                        <View className='flex-row justify-between'>
                            <Pressable onPress={toggleRememberMe} style={{ flexDirection: 'row', alignItems: 'center' }} className='mt-4 mx-6'>
                                <View style={{
                                    height: 24, width: 24, marginRight: 8,
                                    backgroundColor: rememberMe ? '#2196F3' : '#9ca3af'
                                }} className='rounded-lg'/>
                                <Text>Remember Me?</Text>
                            </Pressable>
                            <Pressable onPress={handleForgotPassword} className='mt-5 mx-9'>
                                <Text className="text-blue-500 ">Forget Password</Text>
                            </Pressable> 
                        </View>
                        
                        <Pressable onPress={handleLogin} className="h-12 mt-10 mx-6 p-2 bg-blue-400 rounded-lg flex-row justify-center ">
                            <Text className="text-white text-xl justify-center">Log in</Text>
                        </Pressable>  
                        <View className='flex-row justify-center'>
                            <Text className='mt-3'>{`Don't have an account?`}</Text>
                            <Pressable onPress={handleSignup} className="mt-3 ml-3" >
                                <Text className="text-blue-500 ">Sign Up</Text>
                            </Pressable> 
                        </View>
                    </ScrollView>
                </Modal>
                
            </KeyboardAvoidingView>
        </SafeAreaView>

    );
};

export default Login;