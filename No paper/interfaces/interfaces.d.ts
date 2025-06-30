//Not using any of these rn becoz i hate typescript

enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  LONG_ANSWER = "LONG_ANSWER"
}

interface BaseQuestion {
  id: number;
  title: string,
  subject: string;
  type: QuestionType;
  question?: string,
  question_photo_url?: string,
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  options?: string[];
  answer?: string;
  answer_photo_url?: string,
  marking_scheme?: string,
  marking_scheme_photo_url?: string,
}

interface LongAnswerQuestion extends BaseQuestion {
  type: QuestionType.LONG_ANSWER;
  answer?: string;
  answer_photo_url?: string,
  marking_scheme?: string,
  marking_scheme_url?: string,
}

type Question = MultipleChoiceQuestion | LongAnswerQuestion;

export const questionBank: Record<string, Question[]> = {
  "Math": [
    {
      id: 1,
      subject: "Math",
      type: QuestionType.MULTIPLE_CHOICE,
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      answer: "4"
    },
    {
      id: 2,
      subject: "Math", 
      type: QuestionType.TRUE_FALSE,
      question: "Is π greater than 3?",
      answer: "true"
    }
  ],
  "Science": [
    {
      id: 3,
      subject: "Science",
      type: QuestionType.LONG_ANSWER,
      question: "Explain photosynthesis",
      minWords: 50,
      modelAnswer: "Photosynthesis is..."
    }
  ]
};