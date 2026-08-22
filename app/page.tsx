import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllExams } from "@/data/exams";

export default function HomePage() {
  const exams = getAllExams();

  const faqs = [
    {
      q: "What is SOF and what exams does it run?",
      a: "The Science Olympiad Foundation (SOF) is one of India's largest school-level Olympiad exam organisers, running the International Mathematics Olympiad (IMO), National Science Olympiad (NSO), International English Olympiad (IEO) and International General Knowledge Olympiad (IGKO) for students from Class 1 to 12.",
    },
    {
      q: "Is this site affiliated with SOF?",
      a: "No. This is an independent practice resource built to help students prepare with free sample questions and syllabus guides. It is not affiliated with or endorsed by the Science Olympiad Foundation.",
    },
    {
      q: "Is the practice free?",
      a: "Yes, every practice question and syllabus guide on this site is free to use.",
    },
  ];

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col items-center gap-4 py-8 text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Free SOF Olympiad Practice for Classes 1–3</h1>
        <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Free syllabus guides and unlimited practice questions for the {exams.map((e) => e.shortName).join(", ")}{" "}
          Olympiad exams, built to match the official Science Olympiad Foundation syllabus.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/${exam.id}`}
            className={`flex flex-col gap-3 rounded-2xl bg-gradient-to-br ${exam.gradientFrom} ${exam.gradientTo} p-6 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{exam.icon}</span>
              <div>
                <h2 className="text-xl font-extrabold">{exam.shortName}</h2>
                <p className="text-sm opacity-90">{exam.fullName}</p>
              </div>
            </div>
            <p className="text-sm opacity-90">{exam.description}</p>
            <span className="mt-1 text-sm font-semibold underline underline-offset-4">
              View syllabus &amp; practice →
            </span>
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Why practice here?</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          <li className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <p className="font-semibold">Syllabus-matched</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Every topic is mapped to the official SOF syllabus for each class.
            </p>
          </li>
          <li className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <p className="font-semibold">Instant feedback</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              See the correct answer and explanation right after each question.
            </p>
          </li>
          <li className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <p className="font-semibold">No sign-up needed</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Jump straight into practice — nothing to install or register for.
            </p>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <summary className="cursor-pointer font-semibold">{faq.q}</summary>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
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

export const metadata = {
  title: `${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};
