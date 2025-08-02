import { create } from "zustand";
import uuid from 'react-native-uuid';

type SavedState = {
    savedQuestions: any[];
    createErrorBook: (courseName: string) => void;
    removeErrorBooks: (courseIDs: string[]) => void;
    addSavedQuestion: (questions: any[], courseID: string) => void;
    removeSavedQuestion: (questions: any[], courseID: string) => void;
}

//Questions should be an array of question objects
export const useSavedStore = create<SavedState>((set) => ({
    //Fetch here and save in store so it can be used in all pages
    //For now i just hardcode some questions
    savedQuestions: [
        {
            courseName: "錯題簿 1",
            courseID: "1",
            questions: [
                {
                    id: uuid.v4(),
                    title: "Question 1",
                    type: "MULTIPLE_CHOICE",
                    question: "What is 3+2?",
                    options: ["3", "4", "5", "6"],
                    answer: "5"
                },
                {
                    id: uuid.v4(),
                    title: "Question 2",
                    type: "LONG_ANSWER",
                    question: "Is π greater than 3?",
                    answer: "Yes"
                }
            ],
        },
        {
            courseName: "錯題簿 2",
            courseID: "2",
            questions: [
                {
                    id: uuid.v4(),
                    title: "Question 1",
                    type: "MULTIPLE_CHOICE",
                    question: "What is the chemical symbol for water?",
                    options: ["H2O", "CO2", "O2", "NaCl"],
                    answer: "H2O"
                },
            ],
        }
    ]
,
    createErrorBook: (courseName) => {
        let id = Math.random().toString(36).substring(2, 15); // Generate a random ID
        while (useSavedStore.getState().savedQuestions.some(book => book.courseID === id)) {
            id = Math.random().toString(36).substring(2, 15); // Ensure unique ID
        }

        set((state) => ({savedQuestions: [...state.savedQuestions, {
            courseName: courseName,
            courseID: id,
            questions: []
        }]}))
    },

    removeErrorBooks: (courseIDs) => {
        set((state) => ({
            savedQuestions: state.savedQuestions.filter(book => !courseIDs.includes(book.courseID))
        }))
    },
    
    addSavedQuestion: (questions, courseID) => {
        set((state) => ({
            savedQuestions: state.savedQuestions.map(book => {
                if (book.courseID !== courseID) return book;
                const existingIds = new Set(book.questions.map((q: any) => q.id));
                const newQuestions = questions.filter(q => q && !existingIds.has(q.id));
                return {
                    ...book,
                    questions: [...book.questions, ...newQuestions]
                };
            })
        }))
    },

    removeSavedQuestion: (questionsToRemove, courseID) => {
        set((state) => ({
            savedQuestions: state.savedQuestions.map(book => {
                if (book.courseID !== courseID) return book;
                return {
                    ...book,
                    questions: book.questions.filter(
                        (q: any) => !questionsToRemove.some(r => r.id === q.id)
                    )
                };
            })
        }));
    },

    
}))