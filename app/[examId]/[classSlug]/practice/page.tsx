import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllExams, getExamById } from "@/data/exams";
import { getTopicsForGrade } from "@/data/topics";
import { parseClassSlug, toClassSlug } from "@/lib/classSlug";
import { PracticeClient } from "@/components/PracticeClient";

export function generateStaticParams() {
  return getAllExams().flatMap((exam) => exam.supportedGrades.map((grade) => ({ examId: exam.id, classSlug: toClassSlug(grade) })));
}

export async function generateMetadata(props: PageProps<"/[examId]/[classSlug]/practice">): Promise<Metadata> {
  const { examId, classSlug } = await props.params;
  const exam = getExamById(examId);
  const grade = parseClassSlug(classSlug);
  if (!exam || !grade) return {};
  return {
    title: `Free ${exam.shortName} Class ${grade} Practice Questions`,
    description: `Practice unlimited free ${exam.shortName} Class ${grade} questions with instant answers and explanations.`,
    alternates: { canonical: `/${exam.id}/${classSlug}/practice` },
  };
}

export default async function PracticePage(props: PageProps<"/[examId]/[classSlug]/practice">) {
  const { examId, classSlug } = await props.params;
  const exam = getExamById(examId);
  const grade = parseClassSlug(classSlug);
  if (!exam || !grade) notFound();

  const topics = getTopicsForGrade(examId, grade);

  return (
    <Suspense fallback={<p className="text-center text-slate-500">Loading practice…</p>}>
      <PracticeClient exam={exam} grade={grade} topics={topics} />
    </Suspense>
  );
}
