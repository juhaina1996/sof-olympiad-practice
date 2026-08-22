import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllExams, getExamById } from "@/data/exams";
import { getSyllabus } from "@/data/syllabus";
import { getTopicsForGrade } from "@/data/topics";
import { getQuestionsByTopic } from "@/data/questionBank";
import { toClassSlug, parseClassSlug } from "@/lib/classSlug";

export function generateStaticParams() {
  return getAllExams().flatMap((exam) => exam.supportedGrades.map((grade) => ({ examId: exam.id, classSlug: toClassSlug(grade) })));
}

export async function generateMetadata(props: PageProps<"/[examId]/[classSlug]">): Promise<Metadata> {
  const { examId, classSlug } = await props.params;
  const exam = getExamById(examId);
  const grade = parseClassSlug(classSlug);
  if (!exam || !grade) return {};
  return {
    title: `${exam.shortName} Class ${grade} Syllabus & Free Practice Questions`,
    description: `Complete ${exam.shortName} (${exam.fullName}) Class ${grade} syllabus with sample questions and free unlimited practice.`,
    alternates: { canonical: `/${exam.id}/${classSlug}` },
  };
}

export default async function ClassSyllabusPage(props: PageProps<"/[examId]/[classSlug]">) {
  const { examId, classSlug } = await props.params;
  const exam = getExamById(examId);
  const grade = parseClassSlug(classSlug);
  if (!exam || !grade) notFound();

  const syllabus = getSyllabus(examId, grade);
  if (!syllabus) notFound();

  const topics = getTopicsForGrade(examId, grade);
  const sampleQuestions = topics.flatMap((topic) => getQuestionsByTopic(topic.id).slice(0, 2)).slice(0, 6);

  const faqs = [
    {
      q: `How many questions are in the ${exam.shortName} Class ${grade} exam?`,
      a: `The ${exam.shortName} Class ${grade} paper has ${syllabus.totalQuestions} multiple-choice questions worth ${syllabus.totalMarks} marks, to be completed in ${syllabus.durationMinutes} minutes.`,
    },
    {
      q: "Is there negative marking?",
      a: "No, SOF Olympiad exams do not have negative marking, so it's always worth attempting every question.",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <nav className="text-sm text-slate-500 dark:text-slate-400">
        <Link href={`/${exam.id}`} className="hover:text-indigo-600">
          {exam.shortName}
        </Link>{" "}
        / Class {grade}
      </nav>

      <section className={`rounded-2xl bg-gradient-to-br ${exam.gradientFrom} ${exam.gradientTo} p-8 text-white shadow-lg`}>
        <h1 className="text-3xl font-extrabold">
          {exam.shortName} Class {grade} Syllabus
        </h1>
        <p className="mt-2 max-w-2xl opacity-90">
          {exam.fullName} for Class {grade}: {syllabus.totalQuestions} questions, {syllabus.totalMarks} marks,{" "}
          {syllabus.durationMinutes} minutes, no negative marking.
        </p>
        <Link
          href={`/${exam.id}/${classSlug}/practice`}
          className="mt-5 inline-flex min-h-[3.5rem] items-center justify-center rounded-xl bg-white px-6 text-lg font-bold text-indigo-700 transition hover:bg-indigo-50"
        >
          Start Free Practice →
        </Link>
      </section>

      {syllabus.interpolated && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Note: the Class {grade} syllabus below is estimated from the official Class {grade - 1} and Class{" "}
          {grade + 1} syllabi published by SOF, since a separate Class {grade} document wasn&apos;t directly available at
          time of writing.
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Syllabus breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {syllabus.sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{section.title}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {section.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {sampleQuestions.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Sample Questions</h2>
          <div className="flex flex-col gap-4">
            {sampleQuestions.map((q, i) => (
              <div key={q.id} className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                <p className="font-semibold">
                  {i + 1}. {q.question}
                </p>
                <ul className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">
                  {q.options.map((opt) => (
                    <li key={opt.id} className={opt.id === q.correctOptionId ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}>
                      {opt.text}
                      {opt.id === q.correctOptionId ? " ✓" : ""}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Explanation: </span>
                  {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        {faqs.map((faq) => (
          <details key={faq.q} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <summary className="cursor-pointer font-semibold">{faq.q}</summary>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
          </details>
        ))}
      </section>

      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
    </div>
  );
}
