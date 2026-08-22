import type { GradeSyllabus } from "@/types";

// Syllabus content sourced from the official SOF syllabus pages
// (sofworld.org/{exam}/class-{n}/{exam}-syllabus/{exam}-syllabus-class-{n}),
// verified for Class 1 and Class 3. Class 2 is a reasonable interpolation
// between the two and is flagged `interpolated: true` — treat it as an
// approximation, not a verified official source.
export const gradeSyllabi: GradeSyllabus[] = [
  // ---------------------------------------------------------------- IMO
  {
    examId: "imo",
    grade: 1,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Logical Reasoning",
        topics: [
          "Patterns",
          "Odd One Out",
          "Measuring Units",
          "Geometrical Shapes",
          "Spatial Understanding",
          "Grouping of Figures",
          "Analogy",
          "Ranking Test",
        ],
      },
      {
        title: "Mathematical & Everyday Reasoning",
        topics: [
          "Numerals & Number Names",
          "Number Sense (2-digit numbers)",
          "Addition & Subtraction",
          "Lengths, Weights & Comparisons",
          "Time & Money",
          "Geometrical Shapes & Solids",
        ],
      },
    ],
  },
  {
    examId: "imo",
    grade: 2,
    interpolated: true,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Logical Reasoning",
        topics: [
          "Patterns",
          "Odd One Out",
          "Coding-Decoding",
          "Analogy",
          "Ranking Test",
          "Geometrical Shapes",
          "Embedded Figures",
        ],
      },
      {
        title: "Mathematical & Everyday Reasoning",
        topics: [
          "Number Sense (3-digit numbers)",
          "Addition & Subtraction",
          "Pictographs",
          "Temperature",
          "Lines & Shapes",
          "Time & Money",
        ],
      },
    ],
  },
  {
    examId: "imo",
    grade: 3,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Logical Reasoning",
        topics: [
          "Patterns",
          "Analogy & Classification",
          "Coding-Decoding",
          "Ranking Test",
          "Mirror Images",
          "Geometrical Shapes",
          "Clock & Calendar",
        ],
      },
      {
        title: "Mathematical & Everyday Reasoning",
        topics: [
          "Number Sense (4-digit numbers)",
          "Computation Operations",
          "Fractions",
          "Length, Weight, Capacity & Temperature",
          "Time & Money",
          "Geometry & Data Handling",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- NSO
  {
    examId: "nso",
    grade: 1,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Logical Reasoning",
        topics: ["Patterns", "Odd One Out", "Geometrical Shapes", "Spatial Understanding", "Analogy", "Ranking Test"],
      },
      {
        title: "Science",
        topics: [
          "Living & Non-Living Things",
          "Plants",
          "Animals",
          "Human Beings & Their Needs",
          "Good Habits & Safety Rules",
          "Air & Water",
          "Weather & The Sky",
        ],
      },
    ],
  },
  {
    examId: "nso",
    grade: 2,
    interpolated: true,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Logical Reasoning",
        topics: ["Patterns", "Coding-Decoding", "Analogy", "Ranking Test", "Embedded Figures"],
      },
      {
        title: "Science",
        topics: [
          "Living & Non-Living Things",
          "Plants & Animals",
          "Our Body & Food",
          "Good Habits & Safety Rules",
          "Air, Water & Weather",
          "Housing & Clothing",
        ],
      },
    ],
  },
  {
    examId: "nso",
    grade: 3,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Logical Reasoning",
        topics: ["Patterns", "Analogy & Classification", "Coding-Decoding", "Ranking Test", "Mirror Images"],
      },
      {
        title: "Science",
        topics: [
          "Plants & Animals",
          "Birds",
          "Food, Housing, Clothing & Occupation",
          "Transport, Communication & Safety",
          "Human Body",
          "Earth & Universe",
          "Matter & Materials",
          "Light, Sound & Force",
          "Our Environment",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- IEO
  {
    examId: "ieo",
    grade: 1,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Word & Structure Knowledge",
        topics: [
          "Jumbled Letters",
          "Word Meanings & Opposites",
          "Identify the Word from the Picture",
          "Making a Word",
          "Feminine & Masculine",
          "One and Many",
          "Odd One Out",
          "Animals: Their Babies, Sounds & Groups",
        ],
      },
      {
        title: "Grammar & Structure",
        topics: ["Nouns, Pronouns & Verbs", "Articles, Adverbs & Prepositions", "Adjectives", "Basic Tenses", "Punctuation"],
      },
      {
        title: "Reading & Expression",
        topics: ["Comprehension (Prose & Poetry)", "Picture Composition", "Spoken & Written Expression"],
      },
    ],
  },
  {
    examId: "ieo",
    grade: 2,
    interpolated: true,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Word & Structure Knowledge",
        topics: ["Homophones", "Synonyms & Antonyms", "Word Meanings", "Gender & Number", "One Word Substitution"],
      },
      {
        title: "Grammar & Structure",
        topics: ["Nouns, Pronouns & Verbs", "Adjectives & Adverbs", "Articles & Prepositions", "Simple Tenses", "Punctuation"],
      },
      {
        title: "Reading & Expression",
        topics: ["Comprehension (Prose & Poetry)", "Basic Questions & Answers"],
      },
    ],
  },
  {
    examId: "ieo",
    grade: 3,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "Word & Structure Knowledge",
        topics: ["Synonyms & Antonyms", "Homophones", "One Word Substitution", "Word Meanings & Usage"],
      },
      {
        title: "Grammar & Structure",
        topics: ["Parts of Speech", "Tenses", "Articles & Prepositions", "Punctuation", "Sentence Types"],
      },
      {
        title: "Reading & Expression",
        topics: ["Comprehension (Prose & Poetry)", "Picture Composition"],
      },
    ],
  },

  // ---------------------------------------------------------------- IGKO
  {
    examId: "igko",
    grade: 1,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "General Awareness",
        topics: ["Me & My Surroundings", "Plants & Animals", "India & The World", "Science & Technology", "Sports", "Maths Fun"],
      },
      {
        title: "Life Skills",
        topics: ["Kindness", "Soft Skills", "Social Skills", "Do's & Don'ts"],
      },
    ],
  },
  {
    examId: "igko",
    grade: 2,
    interpolated: true,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "General Awareness",
        topics: [
          "Me & My Surroundings",
          "Plants & Animals",
          "India & The World",
          "Science & Technology",
          "Transport & Communication",
          "Sports",
          "Maths Fun",
        ],
      },
      {
        title: "Life Skills",
        topics: ["Social Skills", "Moral Values", "Team Work", "Communication"],
      },
    ],
  },
  {
    examId: "igko",
    grade: 3,
    interpolated: true,
    totalQuestions: 35,
    totalMarks: 40,
    durationMinutes: 60,
    sections: [
      {
        title: "General Awareness",
        topics: [
          "Me & My Surroundings",
          "Plants & Animals",
          "India & The World",
          "Science & Technology",
          "Entertainment & Sports",
          "Maths Fun",
        ],
      },
      {
        title: "Life Skills",
        topics: ["Social Skills", "Moral Values", "Team Work", "Communication", "Do's & Don'ts"],
      },
    ],
  },
];

export function getSyllabus(examId: string, grade: number): GradeSyllabus | undefined {
  return gradeSyllabi.find((s) => s.examId === examId && s.grade === grade);
}

export function getSyllabiForExam(examId: string): GradeSyllabus[] {
  return gradeSyllabi.filter((s) => s.examId === examId).sort((a, b) => a.grade - b.grade);
}
