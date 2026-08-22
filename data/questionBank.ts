import type { Question } from "@/types";
import { imoQuestions } from "@/data/questions/imo";
import { nsoQuestions } from "@/data/questions/nso";
import { ieoQuestions } from "@/data/questions/ieo";
import { igkoQuestions } from "@/data/questions/igko";

export const questionBank: Question[] = [...imoQuestions, ...nsoQuestions, ...ieoQuestions, ...igkoQuestions];

export function getQuestionsByTopic(topicId: string): Question[] {
  return questionBank.filter((q) => q.topicId === topicId);
}

export function getQuestionsForGrade(examId: string, grade: number): Question[] {
  return questionBank.filter((q) => q.examId === examId && q.grade === grade);
}
