export interface QuestionList {
    response_code: number;
    results: Array<Question>;
}

export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
}