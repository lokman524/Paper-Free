import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable, Modal, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { router, useLocalSearchParams } from 'expo-router';
import { signIn, createUser } from '@/services/appwrite';
import useAuthStore from '@/store/auth.store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants/images';

// async function save(key: string, value: string) {
//   await SecureStore.setItemAsync(key, value);
// }

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [confirmPassword, setConfirmPassword] = useState('');

    //state to control the visibility of login modal
    const [showLogin, setShowLogin] = useState(false);

    // Get screen dimensions and determine if it's a tablet
    const { width } = Dimensions.get('window');
    const isTablet = width >= 768; // iPad typically starts at 768px width
    //if user comes from sign-up page, show the login modal
    const params = useLocalSearchParams();
    useEffect(() => {
        if (params.showLogin === "true")
            setShowLogin(true);
    }, [])

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        try {
            await signIn({ email, password });
            await useAuthStore.getState().fetchAuthenticatedUser();
            router.replace('/');
        } catch (error: any) {
            if (
                error.message?.toLowerCase()?.includes("invalid credentials") ||
                error.code === 401
            ) {
                Alert.alert("Login Failed", "Wrong user name or password.");
            } else {
                Alert.alert("Error", error.message || "Login error");
            }
        }
    };

    const handleSignup = () => {
        // switch to embedded sign-up form
        setMode('signup');
    };

    const handleSignUpSubmit = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        if (password !== confirmPassword) {
            alert('Password is different from confirm password');
            return;
        }
        try {
            await createUser({ email, password });
            Alert.alert('Success', 'User sign up successfully');
            await useAuthStore.getState().fetchAuthenticatedUser();
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Sign up error');
        }
    };

    const handleForgotPassword = () => {
        console.log("handle forget password")
        // Handle forgot password navigation here
    };

    const toggleRememberMe = () => setRememberMe(previousState => !previousState);

    return (
        <SafeAreaView className='flex-1' edges={['top']}>
            <View className='flex-1 flex-row'>
            {/* Left side: Words and cool description and image */}
            <LinearGradient
                colors={['#99FCFF', '#8CFF99']}
                style={{ flex: 2 }}
                className='relative overflow-hidden'
            >
                <View className='ml-7 z-10'>
                    <Text className='text-7xl mt-10 font-bold'>The Most Trusted Platform for Exam Prep</Text>
                    <Text className='text-lg mt-10 font-light text-gray-500 w-5/6'>
                        Hong Kong's first smart mistake-tracking system, designed to help students effortlessly log errors and build customized study materials based on their unique needs- making review quicker, easier, and more effective.
                    </Text>
                </View>
                
                <Image
                    source={images.loginImage}
                    resizeMode='contain'
                    className='w-full'
                    style={{ position: 'absolute', bottom: 0, right: 0}}
                />
                
                {!isTablet && (
                <Pressable onPress={() => setShowLogin(true)}>
                    <Text>Get Started!</Text>
                </Pressable>
                )}
            </LinearGradient>

            <View className="bg-white" style={{ flex: 1 }}>
                {/* Auth form column with mode switch */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0} className="flex-1">
                <ScrollView keyboardShouldPersistTaps="handled" className="flex-1">
                    {mode === 'login' ? (
                        <>
                            <Text className='text-4xl flex-col mt-10 mx-6 font-bold'>Login</Text>
                            <Text className='mt-1 mx-6 text-gray-400'>Enter your email and password to login</Text>
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
                                    }} className='rounded-lg' />
                                    <Text>Remember Me?</Text>
                                </Pressable>
                                <Pressable onPress={handleForgotPassword} className='mt-5 mx-9'>
                                    <Text className="text-blue-500 ">Forget Password</Text>
                                </Pressable>
                            </View>

                            <Pressable onPress={handleLogin} className="h-12 mt-10 mx-6 p-2 bg-blue-400 rounded-lg flex-row justify-center ">
                                <Text className="text-white text-xl justify-center">Log in</Text>
                            </Pressable>
                            <View className='w-full items-center mb-10'>
                                <Text className='mt-3'>Don't have an account?</Text>
                                <Pressable onPress={() => setMode('signup')} className="mt-3 ml-3" >
                                    <Text className="text-blue-500 ">Sign Up</Text>
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text className='text-4xl flex-col mt-10 mx-6 font-bold'>Sign Up</Text>
                            <Text className='mt-1 mx-6 text-gray-400'>Enter your email and password to create an account</Text>
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
                            {password ? (
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirm password"
                                    secureTextEntry
                                    className=' h-12 mt-7 mx-6 p-3  border border-gray-400 rounded-lg'
                                />
                            ) : null}

                            <Pressable onPress={handleSignUpSubmit} className="h-12 mt-10 mx-6 p-2 bg-blue-400 rounded-lg flex-row justify-center ">
                                <Text className="text-white text-xl justify-center">Sign Up</Text>
                            </Pressable>
                            <View className='w-full items-center'>
                                <View className='w-full items-center'>
                                    <Text className='mt-3'>Already have an account?</Text>
                                    <Pressable onPress={() => setMode('login')} className="mt-3 ml-3" >
                                        <Text className="text-blue-500 ">Log In</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    )}
                </ScrollView>
                </KeyboardAvoidingView>
            </View>
            </View>
        </SafeAreaView>

    );
};

export default Login;