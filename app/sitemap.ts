import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllExams } from "@/data/exams";
import { toClassSlug } from "@/lib/classSlug";

export default function sitemap(): MetadataRoute.Sitemap {
  const exams = getAllExams();
  const now = new Date();

  const examPages: MetadataRoute.Sitemap = exams.map((exam) => ({
    url: `${siteConfig.url}/${exam.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const classPages: MetadataRoute.Sitemap = exams.flatMap((exam) =>
    exam.supportedGrades.flatMap((grade) => {
      const base = `${siteConfig.url}/${exam.id}/${toClassSlug(grade)}`;
      return [
        { url: base, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
        { url: `${base}/practice`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
      ];
    })
  );

  return [{ url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 }, ...examPages, ...classPages];
}
