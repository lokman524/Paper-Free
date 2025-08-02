import { View, Text, Button, Image, Alert, Modal} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { images } from '@/constants/images';
import { Question } from '@/app/(pages)/quiz/Question/[id]';
import { useLearningRecordStore } from '@/store/learningRecord.store';
import uuid from 'react-native-uuid';
import { useSavedStore } from '@/store/saved.store';
import ErrorBookSelect from './ErrorBookSelect';

export const unstable_settings = {
  gestureEnabled: false // Disables swipe back
};

const Results = ({userAnswers, questionBank, restartQuiz, startTime, finishTime, call, isTimerEnabled, startQuestion, numberOfQuestions} : {userAnswers : string[], questionBank : Question[], restartQuiz: any, startTime: number, finishTime: number, call: string, isTimerEnabled: string, startQuestion: number, numberOfQuestions: number}) => {

    // Function to calculate the score based on user answers and question bank
    function getScore(){
        let finalScore = 0;
        userAnswers.forEach((answer,index) => {
            if(answer === questionBank[index].answer){
                finalScore++;
            }
        })
        return finalScore;
    }

    // Format finished time to a readable format
    function formatDate(timestamp: number) {
        if (isNaN(timestamp)) {
            throw new Error("Invalid timestamp");
        }
        const date = new Date(timestamp); // Create a Date object from the timestamp
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }
        const year = date.getFullYear(); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0'); 
        return `${year}-${month}-${day}`; // YYYY-MM-DD
    }

    // Function to generate learning record, which includes the user's answers
    function getLearningRecord(){
        const learningRecord = questionBank.slice(startQuestion - 1, startQuestion + numberOfQuestions - 1)
            //Add the corresponding user answer to each question in learning record
            .map((question, index) => (
                {
                    ...question,
                    userAnswer: userAnswers[index],
                    finishTime: formatDate(finishTime),
                }
            ));
        return learningRecord;
    }

    function handleGoBack (){
        restartQuiz();
        //addLearningRecord(learningRecord);
        if (call === "subject_selection")
            router.replace("/subject_selection");
        else if (call === "saved")
            router.dismissTo("/(tabs)/saved")
    }

    const score = getScore();

    const learningRecord = getLearningRecord();
    //Supposed to pass the record to backend and fetch the data in learning_record page
    // But for now ill store it in a zustand store (learningRecord.store.ts)
    // so learning_record can get it
    const addLearningRecord = useLearningRecordStore(state => state.addLearningRecord);

    useEffect(() => {
        addLearningRecord(learningRecord);
    }, [])

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

    //Handle adding multiple learning records to saved
    const handleAddSelected = () => {
        setShowDropdown(true);
        setRecordToAdd(questionBank.slice(startQuestion - 1, startQuestion + numberOfQuestions - 1).map(q => sanitizeQuestion(q)));
    }

    const handleDropdownSelect = (courseID: any) => {
        let recordsToAdd = Array.isArray(recordToAdd) ? recordToAdd : [recordToAdd];
        //Supposed add to backend, but for now i will add to savedQuestionStore locally
        addSavedQuestion(recordsToAdd, courseID);
        Alert.alert("Record(s) added");
        setShowDropdown(false);
        setRecordToAdd(null);
    }

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
            <Text className='text-white mt-10'>Quiz completed!</Text>
            <Text className='text-white'>Your Score: {score/numberOfQuestions * 100}% ({score}/{numberOfQuestions})</Text>
            {isTimerEnabled === "true" && <Text className='text-white mt-5'>Time Used: {(finishTime - startTime) / 1000} seconds</Text>}
            <Button title='add whole quiz to error book' onPress={() => handleAddSelected()} disabled={call === "saved"} />
            <Button title='go back' onPress={handleGoBack}/>
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

export default Results