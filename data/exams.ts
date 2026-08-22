import type { Exam } from "@/types";

// Exam list and descriptions for the Science Olympiad Foundation (SOF) exams.
// Structure grounded in the official syllabus published at sofworld.org.
export const exams: Exam[] = [
  {
    id: "imo",
    shortName: "IMO",
    fullName: "International Mathematics Olympiad",
    subjectLabel: "Mathematics",
    icon: "🔢",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-blue-600",
    description:
      "SOF's flagship maths olympiad, testing number sense, arithmetic and logical/mathematical reasoning.",
    supportedGrades: [1, 2, 3],
  },
  {
    id: "nso",
    shortName: "NSO",
    fullName: "National Science Olympiad",
    akaName: "also known as the International Science Olympiad (ISO)",
    subjectLabel: "Science",
    icon: "🔬",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600",
    description:
      "Tests science concepts from the current and previous class syllabus, plus logical reasoning.",
    supportedGrades: [1, 2, 3],
  },
  {
    id: "ieo",
    shortName: "IEO",
    fullName: "International English Olympiad",
    subjectLabel: "English",
    icon: "📖",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-600",
    description:
      "Covers vocabulary, grammar, word structure and reading comprehension aligned with NCERT/CBSE English.",
    supportedGrades: [1, 2, 3],
  },
  {
    id: "igko",
    shortName: "IGKO",
    fullName: "International General Knowledge Olympiad",
    subjectLabel: "General Knowledge",
    icon: "🌍",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-600",
    description:
      "General awareness, science & technology, sports, entertainment and everyday life skills.",
    supportedGrades: [1, 2, 3],
  },
];

export function getAllExams(): Exam[] {
  return exams;
}

export function getExamById(examId: string): Exam | undefined {
  return exams.find((e) => e.id === examId);
}
