export type Difficulty = "easy" | "medium" | "hard";

export type Exam = {
  id: string;
  shortName: string;
  fullName: string;
  akaName?: string;
  subjectLabel: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  supportedGrades: number[];
};

export type SyllabusSection = {
  title: string;
  topics: string[];
};

export type GradeSyllabus = {
  examId: string;
  grade: number;
  sections: SyllabusSection[];
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  interpolated?: boolean;
};

export type Topic = {
  id: string;
  examId: string;
  grade: number;
  sectionTitle: string;
  name: string;
  description: string;
};

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  examId: string;
  grade: number;
  topicId: string;
  question: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
};

export type QuestionAttempt = {
  questionId: string;
  isCorrect: boolean;
  attemptedAt: string;
};

export type PracticeSession = {
  id: string;
  examId: string;
  grade: number;
  topicId?: string;
  questionIds: string[];
  correctAnswers?: number;
  totalQuestions: number;
  completedAt?: string;
};

export type DeviceProgress = {
  attempts: QuestionAttempt[];
  sessions: PracticeSession[];
};
