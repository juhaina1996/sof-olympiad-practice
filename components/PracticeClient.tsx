"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Exam, DeviceProgress, Question, QuestionAttempt, Topic } from "@/types";
import { loadProgress, saveProgress } from "@/lib/storage";
import { getPracticeQuestions } from "@/lib/questionSelector";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";

const QUESTIONS_PER_SESSION = 10;

export function PracticeClient({ exam, grade, topics }: { exam: Exam; grade: number; topics: Topic[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return <TopicPicker exam={exam} grade={grade} topics={topics} />;
  }

  return <Quiz exam={exam} grade={grade} topic={topic} onExit={() => router.push(`/${exam.id}/class-${grade}/practice`)} />;
}

function TopicPicker({ exam, grade, topics }: { exam: Exam; grade: number; topics: Topic[] }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">
          {exam.shortName} Class {grade} Practice
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Pick a topic to start practicing — it&apos;s free and unlimited.</p>
      </div>
      <div className="flex flex-col gap-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`?topic=${topic.id}`}
            className="flex min-h-[4rem] items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold shadow-sm transition active:bg-indigo-50 sm:hover:border-indigo-400 sm:hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900"
          >
            <span>{topic.name}</span>
            <span className="text-indigo-600 dark:text-indigo-400">Practice →</span>
          </Link>
        ))}
      </div>
      <Link href={`/${exam.id}/class-${grade}`} className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400">
        ← Back to syllabus
      </Link>
    </div>
  );
}

function Quiz({ exam, grade, topic, onExit }: { exam: Exam; grade: number; topic: Topic; onExit: () => void }) {
  const [progress, setProgress] = useState<DeviceProgress | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    const selected = getPracticeQuestions(topic.id, QUESTIONS_PER_SESSION, loaded, Date.now());
    // One-time hydration-safe setup once localStorage progress has loaded.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loaded);
    setQuestions(selected);
     
  }, [topic.id]);

  if (!progress) {
    return <p className="text-center text-slate-500">Loading questions…</p>;
  }

  if (questions.length === 0) {
    return <p className="text-center text-slate-500">No questions available for this topic yet.</p>;
  }

  const currentQuestion = questions[index];
  const isLast = index === questions.length - 1;

  function handleSelect(optionId: string) {
    if (revealed || !progress) return;
    const isCorrect = optionId === currentQuestion.correctOptionId;
    setSelectedOptionId(optionId);
    setRevealed(true);
    if (isCorrect) setCorrectCount((c) => c + 1);

    const attempt: QuestionAttempt = { questionId: currentQuestion.id, isCorrect, attemptedAt: new Date().toISOString() };
    const next: DeviceProgress = { ...progress, attempts: [...progress.attempts, attempt] };
    setProgress(next);
    saveProgress(next);
  }

  function handleNext() {
    if (!isLast) {
      setIndex((i) => i + 1);
      setSelectedOptionId(undefined);
      setRevealed(false);
      return;
    }
    if (progress) {
      const session = {
        id: `session-${topic.id}-${Date.now()}`,
        examId: exam.id,
        grade,
        topicId: topic.id,
        questionIds: questions.map((q) => q.id),
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
      };
      const next: DeviceProgress = { ...progress, sessions: [...progress.sessions, session] };
      saveProgress(next);
    }
    setFinished(true);
  }

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400">{percentage}%</span>
        <p className="text-lg font-semibold">
          {correctCount} out of {questions.length} correct on {topic.name}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFinished(false);
              setIndex(0);
              setSelectedOptionId(undefined);
              setRevealed(false);
              setCorrectCount(0);
              const fresh = loadProgress();
              setProgress(fresh);
              setQuestions(getPracticeQuestions(topic.id, QUESTIONS_PER_SESSION, fresh, Date.now()));
            }}
            className="min-h-[3rem] rounded-xl bg-indigo-600 px-6 font-bold text-white transition active:bg-indigo-800 sm:hover:bg-indigo-700"
          >
            Practice Again
          </button>
          <button
            type="button"
            onClick={onExit}
            className="min-h-[3rem] rounded-xl border-2 border-indigo-200 px-6 font-bold text-indigo-700 transition active:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300"
          >
            Choose Another Topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between text-base font-semibold text-slate-500 dark:text-slate-400">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>{topic.name}</span>
      </div>
      <ProgressBar percentage={((index + (revealed ? 1 : 0)) / questions.length) * 100} />

      <QuestionCard question={currentQuestion} selectedOptionId={selectedOptionId} revealed={revealed} onSelect={handleSelect} />

      {revealed && (
        <button
          type="button"
          onClick={handleNext}
          className="min-h-[4rem] w-full rounded-2xl bg-indigo-600 px-6 py-4 text-xl font-bold text-white transition active:bg-indigo-800 sm:hover:bg-indigo-700"
        >
          {isLast ? "Finish" : "Next Question"}
        </button>
      )}
    </div>
  );
}
