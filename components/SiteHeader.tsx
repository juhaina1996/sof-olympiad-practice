import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllExams } from "@/data/exams";

export function SiteHeader() {
  const exams = getAllExams();
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-indigo-700 dark:text-indigo-400">
          <span className="text-2xl">🏆</span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              href={`/${exam.id}`}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {exam.shortName}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
