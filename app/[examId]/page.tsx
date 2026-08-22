import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllExams, getExamById } from "@/data/exams";
import { getSyllabiForExam } from "@/data/syllabus";

export function generateStaticParams() {
  return getAllExams().map((exam) => ({ examId: exam.id }));
}

export async function generateMetadata(props: PageProps<"/[examId]">): Promise<Metadata> {
  const { examId } = await props.params;
  const exam = getExamById(examId);
  if (!exam) return {};
  return {
    title: `${exam.fullName} (${exam.shortName}) — Free Syllabus & Practice`,
    description: `${exam.description} Free class-wise syllabus and practice questions for ${exam.shortName}.`,
    alternates: { canonical: `/${exam.id}` },
  };
}

export default async function ExamPage(props: PageProps<"/[examId]">) {
  const { examId } = await props.params;
  const exam = getExamById(examId);
  if (!exam) notFound();

  const syllabi = getSyllabiForExam(examId);

  return (
    <div className="flex flex-col gap-10">
      <section className={`rounded-2xl bg-gradient-to-br ${exam.gradientFrom} ${exam.gradientTo} p-8 text-white shadow-lg`}>
        <span className="text-5xl">{exam.icon}</span>
        <h1 className="mt-3 text-3xl font-extrabold">{exam.fullName}</h1>
        <p className="mt-1 text-lg opacity-90">
          {exam.shortName}
          {exam.akaName ? ` (${exam.akaName})` : ""}
        </p>
        <p className="mt-3 max-w-2xl opacity-90">{exam.description}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Choose your class</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {exam.supportedGrades.map((grade) => (
            <Link
              key={grade}
              href={`/${exam.id}/class-${grade}`}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800"
            >
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Class {grade}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Syllabus, sample questions &amp; free practice
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">About {exam.shortName}</h2>
        <p className="text-slate-600 dark:text-slate-300">
          The {exam.fullName} is conducted by the Science Olympiad Foundation (SOF) and tests {exam.subjectLabel.toLowerCase()}{" "}
          concepts alongside logical reasoning appropriate to each class level. Each exam has {syllabi[0]?.totalQuestions ?? 35}{" "}
          multiple-choice questions to be completed in {syllabi[0]?.durationMinutes ?? 60} minutes, with no negative marking.
        </p>
      </section>
    </div>
  );
}
