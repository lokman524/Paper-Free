import { View, Text, Image, ScrollView, Button, BackHandler, Alert, Modal} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams, useNavigation} from 'expo-router'
import { images } from '@/constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useSavedStore } from '@/store/saved.store';
import ErrorBookSelect from '@/components/ErrorBookSelect';

//This does not fucking work too and i don't know why
export const unstable_settings = {
  gestureEnabled: false // Disables swipe back
};

//This is a page showing question from learning record specifically
//Normally i should reuse the question component but i fucked up the code there so i'll just make a new one
const LearningRecordQuestion = () => {
    const params = useLocalSearchParams();
    const title = params.title as string;
    const question = params.question as string;
    const type = params.type as string;
    const options = (params.options as string[])? params.options.split(',').map((option: string) => option.trim()) : undefined; // Convert options to an array if it exists
    const answer = params.answer as string;
    const userAnswer = params.userAnswer as string;

    const [showUserAnswer, setShowUserAnswer] = useState<boolean>(false);
    const toggleShowUserAnswer = () => {
        setShowUserAnswer(!showUserAnswer);
    }

    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const toggleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    }

    const errorBooks = useSavedStore(state => state.savedQuestions);
    const addSavedQuestion = useSavedStore(state => state.addSavedQuestion);

    //data to pass to DropdownList component
    const dropdownData = errorBooks.map(book => ({
        label: book.courseName,
        value: book.courseID,
    }));

    //To control the dropdown for adding to error book
    const [showDropdown, setShowDropdown] = useState(false);
    const [recordToAdd, setRecordToAdd] = useState<any | null>(null);

    //Function to sanitize the question object before adding to saved questions
    //This ensures that the question object matches the expected structure in saved.store.ts
    const sanitizeQuestion = (q: any) => ({
        id: uuid.v4(),
        title: q.title,
        type: q.type,
        question: q.question,
        options: q.options ? q.options : [],
        answer: q.answer,
    });

    const handleAddSingle = () => {
        setShowDropdown(true);
        setRecordToAdd(sanitizeQuestion(params));
    }

    const handleDropdownSelect = (courseID: any) => {
        let recordsToAdd = [recordToAdd];
        //Supposed add to backend, but for now i will add to savedQuestionStore locally
        addSavedQuestion(recordsToAdd, courseID);
        Alert.alert("Record(s) added");
        setShowDropdown(false);
        setRecordToAdd(null);
    }

    //Custom back handler (for android)
    //I think this will work but i haven't tested it yet
    useEffect(() => {
        const backAction = () => {
            router.back;
            console.log("Back button pressed");
            return true; // Prevent default back action
        } 
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove(); 
    },[])

    //Custom back handler (for iOS)
    //Update: It does not fucking work and i don't know why
    //Update: Again expo go does not support this 
    //FUCK EXPO GO
    const navigation = useNavigation();
    useEffect(() => {
        const gestureEndListener = () => {
            console.log('iOS back gesture ended');
        };

        const unsubscribe = navigation.addListener("gestureEnd", gestureEndListener);
        return unsubscribe;
    }, [navigation]);

  return (
    <View className='flex-1 bg-primary'>
        <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
        <SafeAreaView>
            <ScrollView>
                <Text className="text-xl text-white font-bold mt-5 mb-3">{title}</Text>
                <Text className="text-xl text-white font-bold mt-5 mb-3">Question: {question}</Text>
                {options ? 
                    (   
                        <View className='flex-1'>
                            {options.map((option: string, index: number) => (   
                                <Text key={index} className='text-white mb-2'>
                                    {String.fromCharCode(index + 65)}. {option}
                                </Text>
                            ))}
                            <Button title='show your answer' onPress={toggleShowUserAnswer}/>
                            {showUserAnswer && (
                                <Text className='text-white mt-2'>Your Answer: {userAnswer}</Text>
                            )}
                            <Button title='show model answer' onPress={toggleShowAnswer}/>
                            {showAnswer && (
                                    <Text className='text-white mt-2'>Model Answer: {answer}</Text>
                            )}
                        </View>
                    )
                    : 
                    (
                        <View className='flex-1'>
                            <Button title='show your answer' onPress={toggleShowUserAnswer}/>
                            {showUserAnswer && (
                                <Text className='text-white mt-2'>Your Answer: {userAnswer}</Text>
                            )}
                            <Button title='show model answer' onPress={toggleShowAnswer}/>
                            {showAnswer && (
                                    <Text className='text-white mt-2'>Model Answer: {answer}</Text>
                            )}
                        </View>
                    )
                }
                <Button title='add to error book' onPress={() => handleAddSingle()}/>
                <Button title='go back' onPress={() => {router.back()}}/>
            </ScrollView>
        </SafeAreaView>
        {/* Dropdown for selecting error book */}
        <Modal
                        visible={showDropdown}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShowDropdown(false)}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.3)'
                        }}>
                            <View style={{
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                padding: 20,
                                minWidth: 200,
                                alignItems: 'center'
                            }}>
                                <Text className='text-black mb-2'>Select an error book to add record(s):</Text>
                                <ErrorBookSelect 
                                    data={dropdownData} 
                                    onSelect={handleDropdownSelect} 
                                />
                                <Button title="Cancel" onPress={() => {
                                    setShowDropdown(false);
                                    setRecordToAdd(null);
                                }}/>
                            </View>
                        </View>
        </Modal>
    </View>
  )
}

export default LearningRecordQuestion
