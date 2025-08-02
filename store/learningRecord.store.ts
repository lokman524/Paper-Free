import { create } from "zustand";

type LearningRecordState = {
    allLearningRecords: any[];
    addLearningRecord: (record: any) => void;
};

export const useLearningRecordStore = create <LearningRecordState>((set) => ({
  allLearningRecords: [{
    id: "1",
    title: "Sample Record",
    type: "MULTIPLE_CHOICE",
    question: "What is 2+2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
    userAnswer: "4",
    finishTime: "12312321",
  }],
  addLearningRecord: (record) =>
    set((state) => ({ allLearningRecords: [...state.allLearningRecords, ...record] })),
}));