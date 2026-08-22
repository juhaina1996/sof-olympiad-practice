import type { Topic } from "@/types";
import { gradeSyllabi } from "@/data/syllabus";

const SECTION_SLUGS: Record<string, string> = {
  "Logical Reasoning": "reasoning",
  "Mathematical & Everyday Reasoning": "maths",
  Science: "science",
  "Word & Structure Knowledge": "word-structure",
  "Grammar & Structure": "grammar",
  "Reading & Expression": "reading",
  "General Awareness": "awareness",
  "Life Skills": "life-skills",
};

function slugForSection(title: string): string {
  return SECTION_SLUGS[title] ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// One practice topic (question pool) per syllabus section, derived directly
// from the syllabus data so the two never drift out of sync.
export const topics: Topic[] = gradeSyllabi.flatMap((syllabus) =>
  syllabus.sections.map((section) => ({
    id: `${syllabus.examId}-g${syllabus.grade}-${slugForSection(section.title)}`,
    examId: syllabus.examId,
    grade: syllabus.grade,
    sectionTitle: section.title,
    name: section.title,
    description: section.topics.slice(0, 4).join(", ") + (section.topics.length > 4 ? ", …" : ""),
  }))
);

export function getTopicsForGrade(examId: string, grade: number): Topic[] {
  return topics.filter((t) => t.examId === examId && t.grade === grade);
}

export function getTopicById(topicId: string): Topic | undefined {
  return topics.find((t) => t.id === topicId);
}
