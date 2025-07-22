import { User } from './user.model';

export interface Question {
  id: number;
  questionText: string;
  answerText?: string;
  isAnswered: boolean;
  user: User;
  createdAt: string;
  answeredAt?: string;
}