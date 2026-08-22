import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllExams } from "@/data/exams";

export function SiteFooter() {
  const exams = getAllExams();
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-4">
          {exams.map((exam) => (
            <div key={exam.id}>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{exam.shortName}</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {exam.supportedGrades.map((grade) => (
                  <li key={grade}>
                    <Link href={`/${exam.id}/class-${grade}`} className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">
                      Class {grade} Syllabus
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            {siteConfig.name} is an independent practice resource and is not affiliated with or endorsed by the
            Science Olympiad Foundation (SOF). All exam names are the property of their respective owners.
          </p>
          <Link href="/privacy" className="shrink-0 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
