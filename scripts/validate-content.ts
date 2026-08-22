import { validateQuestionBank } from "../lib/validation";
import { questionBank } from "../data/questionBank";
import { exams } from "../data/exams";
import { topics } from "../data/topics";

const errors = validateQuestionBank(questionBank, exams, topics);

if (errors.length > 0) {
  console.error(`Found ${errors.length} content validation error(s):\n`);
  for (const error of errors) console.error(" -", error);
  process.exit(1);
}

console.log(`Content OK: ${questionBank.length} questions across ${topics.length} topics validated.`);
