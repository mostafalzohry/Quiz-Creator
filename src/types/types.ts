export interface Answer {
  id: number;
  text: string;
  is_true: boolean;
}

export interface Question {
  id: number;
  text: string;
  feedback_true: string;
  feedback_false: string;
  answers: Answer[];
  answer_id?: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  url: string;
  questions_answers: Question[];
  created: string;
  modified: string;
}
