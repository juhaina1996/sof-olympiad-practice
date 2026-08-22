import type { DeviceProgress, Question } from "@/types";
import { getQuestionsByTopic } from "@/data/questionBank";

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Picks practice questions for a topic, preferring ones the visitor hasn't
 * seen before (based on their local attempt history), falling back to the
 * full pool once it's exhausted.
 */
export function getPracticeQuestions(topicId: string, count: number, progress: DeviceProgress, seed: number): Question[] {
  const pool = getQuestionsByTopic(topicId);
  const attemptedIds = new Set(progress.attempts.map((a) => a.questionId));
  const unattempted = pool.filter((q) => !attemptedIds.has(q.id));
  const ordered = unattempted.length >= count ? unattempted : [...unattempted, ...pool.filter((q) => attemptedIds.has(q.id))];
  return shuffle(ordered, seed).slice(0, count);
}
