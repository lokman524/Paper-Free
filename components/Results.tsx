import { View, Text, Button, Image, Alert, Modal} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { images } from '@/constants/images';
import { Question } from '@/app/(pages)/quiz/Question/[id]';
import { useLearningRecordStore } from '@/store/learningRecord.store';
import uuid from 'react-native-uuid';
import { useSavedStore } from '@/store/saved.store';
import CustomDropdown from '@/components/DropdownList';

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

    // Format elapsed time (ms) to hh:mm:ss
    function formatElapsedTime(ms: number) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');

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
        <View className="flex-1 bg-gray-50">
            {/* Main Content Area */}
            <View className="flex-1 p-6">
                {/* Header */}
                <View className="mb-6 mt-5">
                    <Text className="text-4xl font-bold text-gray-800 mb-2">Quiz Completed! ⭐</Text>
                    <Text className="text-lg text-gray-600">Great job on finishing the quiz</Text>
                </View>
                
                {/* Results Card */}
                <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">Your Results</Text>
                    <Text className="text-xl text-gray-700 mb-2">Score: {Math.round(score/numberOfQuestions * 100)}% ({score}/{numberOfQuestions})</Text>
                    <Text className="text-lg text-gray-600 mb-2">Completed: {new Date(finishTime).toLocaleString()}</Text>
                    <Text className="text-lg text-gray-600 mb-2">Elapsed Time: {formatElapsedTime(finishTime - startTime)}</Text>
                    {isTimerEnabled === "true" && (
                        <Text className="text-lg text-gray-600">Time Used: {Math.round((finishTime - startTime) / 1000)} seconds</Text>
                    )}
                </View>
                
                {/* Actions Card */}
                <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <Text className="text-lg font-semibold text-gray-700 mb-4">Actions</Text>
                    <View className="space-y-3">
                        <Button 
                            title='Add Whole Quiz to Error Book' 
                            onPress={() => handleAddSelected()} 
                            disabled={call === "saved"} 
                        />
                        <Button title='Go Back' onPress={handleGoBack}/>
                    </View>
                </View>
            </View>
            
            {/* Modal */}
            <Modal
                visible={showDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
            >
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View className="bg-white rounded-lg p-6 m-4 min-w-80 w-11/12">
                        <Text className="text-lg font-semibold text-gray-800 mb-2">Add to Error Book</Text>
                        <Text className="text-gray-600 mb-4">Choose an error book to add these questions:</Text>

                        <CustomDropdown
                            data={dropdownData}
                            value={selectedCourseId}
                            onSelect={(val: string) => setSelectedCourseId(val)}
                            placeholder="Select error book"
                            sheetTitle="Select Error Book"
                        />

                        <View className="mt-6 space-y-3">
                            <Button
                                title="Add"
                                onPress={() => selectedCourseId && handleDropdownSelect(selectedCourseId)}
                                disabled={!selectedCourseId}
                            />
                            <Button title="Cancel" onPress={() => { setShowDropdown(false); setRecordToAdd(null); setSelectedCourseId(''); }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Results