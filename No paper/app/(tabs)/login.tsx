import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        // Handle login logic here
    };

    const handleSignup = () => {
        // Handle signup navigation here
    };

    const handleForgotPassword = () => {
        // Handle forgot password navigation here
    };

    return (
        <View>
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
                <CheckBox
                    value={rememberMe}
                    onValueChange={setRememberMe}
                />
                <Text>Remember me</Text>
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
                <Text>Forgot Password?</Text>
            </TouchableOpacity>
            <Button title="Login" onPress={handleLogin} />
            <Button title="Sign Up" onPress={handleSignup} />
        </View>
    );
};

export default login;