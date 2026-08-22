import { z } from "zod";
import type { Exam, Question, Topic } from "@/types";

export const questionSchema = z.object({
  id: z.string().min(1),
  examId: z.string().min(1),
  grade: z.number().int().min(1),
  topicId: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.object({ id: z.string().min(1), text: z.string().min(1) })).min(2),
  correctOptionId: z.string().min(1),
  explanation: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()),
});

export function validateQuestionBank(questions: Question[], exams: Exam[], topics: Topic[]): string[] {
  const errors: string[] = [];
  const examIds = new Set(exams.map((e) => e.id));
  const topicIds = new Set(topics.map((t) => t.id));
  const seenIds = new Set<string>();

  for (const question of questions) {
    const parsed = questionSchema.safeParse(question);
    if (!parsed.success) {
      errors.push(`${question.id ?? "<no id>"}: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      continue;
    }
    if (seenIds.has(question.id)) errors.push(`${question.id}: duplicate question id`);
    seenIds.add(question.id);
    if (!examIds.has(question.examId)) errors.push(`${question.id}: unknown examId "${question.examId}"`);
    if (!topicIds.has(question.topicId)) errors.push(`${question.id}: unknown topicId "${question.topicId}"`);
    if (!question.options.some((o) => o.id === question.correctOptionId)) {
      errors.push(`${question.id}: correctOptionId not found in options`);
    }
  }
  return errors;
}
