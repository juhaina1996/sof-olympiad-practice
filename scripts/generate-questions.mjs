// Dev-time content generator. Produces data/questions/<exam>.ts files.
// Run with: node scripts/generate-questions.mjs

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data", "questions");

function pad(n) {
  return String(n).padStart(3, "0");
}

function shuffleDeterministic(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMcq({ id, examId, grade, topicId, question, correctText, distractors, explanation, difficulty, tags, seed = 1 }) {
  const seen = new Set();
  const deduped = [correctText, ...distractors].map(String).filter((text) => {
    if (seen.has(text)) return false;
    seen.add(text);
    return true;
  });
  if (deduped.length < 2) {
    throw new Error(`${id}: fewer than 2 unique options after de-duplication (${deduped.join(", ")})`);
  }
  const optionTexts = shuffleDeterministic(deduped, seed);
  const letters = ["a", "b", "c", "d", "e"];
  const options = optionTexts.map((text, i) => ({ id: letters[i], text }));
  const correctOptionId = options.find((o) => o.text === String(correctText)).id;
  return { id, examId, grade, topicId, question, options, correctOptionId, explanation, difficulty, tags };
}

function tier(index, total) {
  if (index < total / 3) return "easy";
  if (index < (2 * total) / 3) return "medium";
  return "hard";
}

function fromFacts({ idPrefix, examId, grade, topicId, tag, facts }) {
  let n = 1;
  return facts.map(([question, correct, distractors], i) =>
    makeMcq({
      id: `${idPrefix}-${pad(n++)}`,
      examId,
      grade,
      topicId,
      question,
      correctText: correct,
      distractors,
      explanation: `${correct} is correct.`,
      difficulty: tier(i, facts.length),
      tags: [tag],
      seed: i + 1,
    })
  );
}

// ---------------------------------------------------------------------------
// SHARED: Logical Reasoning pool (IMO + NSO share this section per grade)
// ---------------------------------------------------------------------------

function generateReasoningPool(examId, grade, idPrefix) {
  const topicId = `${examId}-g${grade}-reasoning`;
  let n = 1;
  const qs = [];

  // Patterns (number sequences, scaled by grade)
  const maxN = grade === 1 ? 20 : grade === 2 ? 50 : 100;
  const steps = grade === 1 ? [1, 2] : grade === 2 ? [1, 2, 5] : [2, 3, 5, 10];
  for (let i = 1; i <= 4; i++) {
    const step = steps[i % steps.length];
    const start = ((i * 3) % Math.max(1, maxN - step * 4)) + 1;
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    const answer = start + 4 * step;
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId,
        grade,
        topicId,
        question: `What comes next? ${seq.join(", ")}, ?`,
        correctText: answer,
        distractors: [answer + 1, answer - 1, answer + step],
        explanation: `The pattern increases by ${step} each time, so the next number is ${answer}.`,
        difficulty: tier(i - 1, 4),
        tags: ["patterns"],
        seed: i,
      })
    );
  }

  // Odd one out
  const oddGroups = [
    [["Apple", "Mango", "Banana", "Chair"], "Chair"],
    [["Dog", "Cat", "Cow", "Table"], "Table"],
    [["Circle", "Square", "Triangle", "Happy"], "Happy"],
    [["2", "4", "6", "7"], "7"],
    [["Red", "Blue", "Green", "Seven"], "Seven"],
  ];
  oddGroups.forEach(([items, odd], i) => {
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId,
        grade,
        topicId,
        question: `Which one does not belong? ${items.join(", ")}`,
        correctText: odd,
        distractors: items.filter((x) => x !== odd),
        explanation: `'${odd}' is different from the rest.`,
        difficulty: tier(i, oddGroups.length),
        tags: ["odd-one-out"],
        seed: i + 10,
      })
    );
  });

  // Analogy
  const analogies = [
    ["Dog", "Puppy", "Cat", "Kitten"],
    ["Bird", "Fly", "Fish", "Swim"],
    ["Hand", "Glove", "Foot", "Shoe"],
    ["Sun", "Day", "Moon", "Night"],
  ];
  analogies.forEach(([a, b, c, d], i) => {
    const pool = analogies.flatMap((x) => [x[1], x[3]]).filter((w) => w !== d);
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId,
        grade,
        topicId,
        question: `${a} is to ${b} as ${c} is to ?`,
        correctText: d,
        distractors: [pool[i % pool.length], pool[(i + 2) % pool.length], pool[(i + 4) % pool.length]],
        explanation: `Just as ${a} relates to ${b}, ${c} relates to ${d}.`,
        difficulty: tier(i, analogies.length),
        tags: ["analogy"],
        seed: i + 20,
      })
    );
  });

  // Ranking
  const rankSets = [
    ["Ravi", 120, "Sam", 100, "Tia", 140],
    ["Ann", 90, "Ben", 130, "Cid", 110],
  ];
  rankSets.forEach(([n1, h1, n2, h2, n3, h3], i) => {
    const people = [[n1, h1], [n2, h2], [n3, h3]];
    const tallest = people.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId,
        grade,
        topicId,
        question: `${n1} is ${h1}cm, ${n2} is ${h2}cm, ${n3} is ${h3}cm. Who is the tallest?`,
        correctText: tallest,
        distractors: people.map((p) => p[0]).filter((x) => x !== tallest),
        explanation: `${tallest} has the greatest height.`,
        difficulty: tier(i, rankSets.length),
        tags: ["ranking"],
        seed: i + 30,
      })
    );
  });

  // Geometrical shapes (sides)
  const shapes = [["circle", 0], ["triangle", 3], ["square", 4], ["rectangle", 4], ["pentagon", 5], ["hexagon", 6]];
  shapes.forEach(([name, sides], i) => {
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId,
        grade,
        topicId,
        question: `How many sides does a ${name} have?`,
        correctText: sides,
        distractors: [...new Set(shapes.map((s) => s[1]))].filter((x) => x !== sides).slice(0, 3),
        explanation: `A ${name} has ${sides} sides.`,
        difficulty: tier(i, shapes.length),
        tags: ["shapes"],
        seed: i + 40,
      })
    );
  });

  if (grade >= 2) {
    // Coding-decoding: simple letter-shift cipher
    const words = ["CAT", "DOG", "SUN", "BAT", "CUP"];
    words.forEach((word, i) => {
      const shift = 1;
      const coded = word
        .split("")
        .map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65))
        .join("");
      qs.push(
        makeMcq({
          id: `${idPrefix}-${pad(n++)}`,
          examId,
          grade,
          topicId,
          question: `If each letter is shifted forward by 1 (A→B, B→C, ...), how is '${word}' coded?`,
          correctText: coded,
          distractors: [word, word.split("").reverse().join(""), coded.split("").reverse().join("")],
          explanation: `Shifting every letter of '${word}' forward by 1 gives '${coded}'.`,
          difficulty: "medium",
          tags: ["coding-decoding"],
          seed: i + 50,
        })
      );
    });
  }

  if (grade >= 3) {
    // Mirror images (letters with vertical symmetry look the same)
    const letters = ["A", "B", "H", "F", "M", "N"];
    letters.forEach((letter, i) => {
      const looksSame = ["A", "H", "M"].includes(letter);
      qs.push(
        makeMcq({
          id: `${idPrefix}-${pad(n++)}`,
          examId,
          grade,
          topicId,
          question: `Does the letter '${letter}' look the same in a mirror?`,
          correctText: looksSame ? "Yes" : "No",
          distractors: [looksSame ? "No" : "Yes"],
          explanation: looksSame ? `'${letter}' has a vertical line of symmetry.` : `'${letter}' looks different (flipped) in a mirror.`,
          difficulty: "medium",
          tags: ["mirror-images"],
          seed: i + 60,
        })
      );
    });

    // Clock & calendar
    const clockFacts = [
      ["How many hours are there in one day?", "24", ["12", "60", "7"]],
      ["How many days are there in one week?", "7", ["30", "12", "24"]],
      ["How many months are there in one year?", "12", ["7", "24", "52"]],
      ["How many minutes are there in one hour?", "60", ["24", "12", "100"]],
    ];
    clockFacts.forEach(([q, correct, distractors], i) => {
      qs.push(
        makeMcq({
          id: `${idPrefix}-${pad(n++)}`,
          examId,
          grade,
          topicId,
          question: q,
          correctText: correct,
          distractors,
          explanation: `${correct} is correct.`,
          difficulty: "easy",
          tags: ["clock-calendar"],
          seed: i + 70,
        })
      );
    });
  }

  return qs;
}

// ---------------------------------------------------------------------------
// IMO: Mathematical & Everyday Reasoning
// ---------------------------------------------------------------------------

function generateImoMaths(grade) {
  const topicId = `imo-g${grade}-maths`;
  let n = 1;
  const qs = [];
  const idPrefix = `imo-g${grade}-math`;
  const maxOperand = grade === 1 ? 10 : grade === 2 ? 50 : 200;

  for (let i = 1; i <= 6; i++) {
    const x = i * (grade === 1 ? 1 : grade === 2 ? 4 : 15);
    const y = ((i * 3) % 8) + 1 + (grade - 1) * 5;
    const sum = x + y;
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId: "imo",
        grade,
        topicId,
        question: `What is ${x} + ${y}?`,
        correctText: sum,
        distractors: [sum + 1, sum - 1, sum + 10],
        explanation: `${x} + ${y} = ${sum}.`,
        difficulty: tier(i - 1, 6),
        tags: ["addition"],
        seed: i,
      })
    );
  }

  for (let i = 1; i <= 6; i++) {
    const b = i * (grade === 1 ? 1 : grade === 2 ? 3 : 10);
    const a = b + ((i * 2) % maxOperand) + 2;
    const diff = a - b;
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId: "imo",
        grade,
        topicId,
        question: `What is ${a} - ${b}?`,
        correctText: diff,
        distractors: [diff + 1, diff - 1 >= 0 ? diff - 1 : diff + 2, diff + 10],
        explanation: `${a} - ${b} = ${diff}.`,
        difficulty: tier(i - 1, 6),
        tags: ["subtraction"],
        seed: i + 10,
      })
    );
  }

  // Number sense: greater/smaller
  for (let i = 1; i <= 3; i++) {
    const scale = grade === 1 ? 10 : grade === 2 ? 100 : 1000;
    const a = i * scale + 4;
    const b = i * scale + 9;
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId: "imo",
        grade,
        topicId,
        question: `Which number is greater: ${a} or ${b}?`,
        correctText: Math.max(a, b),
        distractors: [Math.min(a, b)],
        explanation: `${Math.max(a, b)} is greater than ${Math.min(a, b)}.`,
        difficulty: "easy",
        tags: ["number-sense"],
        seed: i + 20,
      })
    );
  }

  // Time & Money
  const coinValues = [1, 2, 5, 10, 20];
  for (let i = 0; i < 3; i++) {
    const c1 = coinValues[i];
    const c2 = coinValues[i + 1];
    const total = c1 + c2;
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId: "imo",
        grade,
        topicId,
        question: `You have a ₹${c1} coin and a ₹${c2} coin. How much money do you have in total?`,
        correctText: `₹${total}`,
        distractors: [`₹${total + 1}`, `₹${total - 1}`, `₹${Math.abs(c1 - c2)}`],
        explanation: `₹${c1} + ₹${c2} = ₹${total}.`,
        difficulty: "medium",
        tags: ["money"],
        seed: i + 30,
      })
    );
  }
  for (let i = 1; i <= 3; i++) {
    qs.push(
      makeMcq({
        id: `${idPrefix}-${pad(n++)}`,
        examId: "imo",
        grade,
        topicId,
        question: `A clock's hour hand points to ${i} and minute hand to 12. What time is it?`,
        correctText: `${i} o'clock`,
        distractors: [`${i + 1} o'clock`, `${i}:30`],
        explanation: `When the minute hand is at 12, the clock shows ${i} o'clock.`,
        difficulty: "easy",
        tags: ["time"],
        seed: i + 40,
      })
    );
  }

  if (grade >= 3) {
    // Fractions
    const fractions = [
      ["What fraction of a pizza is 1 slice out of 4 equal slices?", "1/4", ["1/2", "1/3", "4/1"]],
      ["What fraction is shaded if 2 out of 4 equal parts are shaded?", "2/4 (or 1/2)", ["1/4", "3/4", "4/2"]],
      ["Which fraction is bigger: 1/2 or 1/4?", "1/2", ["1/4"]],
    ];
    fractions.forEach(([q, correct, distractors], i) => {
      qs.push(
        makeMcq({
          id: `${idPrefix}-${pad(n++)}`,
          examId: "imo",
          grade,
          topicId,
          question: q,
          correctText: correct,
          distractors,
          explanation: `${correct} is correct.`,
          difficulty: tier(i, fractions.length),
          tags: ["fractions"],
          seed: i + 50,
        })
      );
    });

    // Data handling
    for (let i = 1; i <= 2; i++) {
      const count = 4 + i;
      qs.push(
        makeMcq({
          id: `${idPrefix}-${pad(n++)}`,
          examId: "imo",
          grade,
          topicId,
          question: `A picture graph shows ${count} apples using ${count} tally marks: ${"|".repeat(count)}. How many apples are shown?`,
          correctText: count,
          distractors: [count - 1, count + 1],
          explanation: `Counting the marks gives ${count}.`,
          difficulty: "medium",
          tags: ["data-handling"],
          seed: i + 60,
        })
      );
    }
  }

  return qs;
}

// ---------------------------------------------------------------------------
// NSO: Science
// ---------------------------------------------------------------------------

function generateNsoScience(grade) {
  const topicId = `nso-g${grade}-science`;
  const idPrefix = `nso-g${grade}-sci`;

  const base = [
    ["Is a dog living or non-living?", "Living", ["Non-living"]],
    ["Is a stone living or non-living?", "Non-living", ["Living"]],
    ["What do plants need to grow?", "Sunlight, water and air", ["Only darkness", "Only sand"]],
    ["What do we call baby dogs?", "Puppies", ["Kittens", "Calves"]],
    ["What sound does a cow make?", "Moo", ["Woof", "Meow"]],
    ["Which body part do we use to see?", "Eyes", ["Ears", "Nose"]],
    ["Which body part do we use to hear?", "Ears", ["Eyes", "Nose"]],
    ["What should you do before eating food?", "Wash your hands", ["Play outside", "Watch TV"]],
    ["Which of these do we drink to stay healthy?", "Water", ["Oil", "Sand"]],
    ["What do we breathe to stay alive?", "Air", ["Water", "Sand"]],
    ["What falls from clouds when it rains?", "Water (rain)", ["Sand", "Fire"]],
    ["What do we see in the sky during the day?", "The sun", ["The moon", "Stars"]],
    ["What do we see in the sky at night?", "The moon and stars", ["The sun"]],
    ["Which season is very hot?", "Summer", ["Winter"]],
    ["Which season has a lot of rain?", "Monsoon", ["Summer"]],
  ];

  const g3extra = [
    ["Which of these is a solid?", "A stone", ["Water", "Air"]],
    ["Which of these is a liquid?", "Water", ["A stone", "Air"]],
    ["Which of these is a gas?", "Air", ["A stone", "Water"]],
    ["What do we use to see things clearly in the dark?", "A light/torch", ["A mirror only", "A blanket"]],
    ["What travels through the air and lets us hear things?", "Sound", ["Light only", "Smell"]],
    ["What do we call a push or a pull on an object?", "Force", ["Sound", "Light"]],
    ["Which mode of transport travels on water?", "Boat", ["Car", "Aeroplane"]],
    ["Which mode of transport travels in the air?", "Aeroplane", ["Car", "Boat"]],
    ["What do we call the place where we live?", "Home/House", ["School", "Market"]],
    ["What job does a farmer do?", "Grows crops and food", ["Teaches students", "Delivers letters"]],
    ["What is the name of the planet we live on?", "Earth", ["The Moon", "The Sun"]],
    ["What do we call the star at the centre of our solar system?", "The Sun", ["The Moon", "Earth"]],
  ];

  const facts = grade >= 3 ? [...base, ...g3extra] : base;
  return fromFacts({ idPrefix, examId: "nso", grade, topicId, tag: "science", facts });
}

// ---------------------------------------------------------------------------
// IEO: English
// ---------------------------------------------------------------------------

function generateIeoWordStructure(grade) {
  const topicId = `ieo-g${grade}-word-structure`;
  const idPrefix = `ieo-g${grade}-word`;

  const opposites = [
    ["hot", "cold"], ["big", "small"], ["fast", "slow"], ["happy", "sad"], ["day", "night"],
    ["open", "closed"], ["clean", "dirty"], ["up", "down"], ["long", "short"], ["wet", "dry"],
  ];
  const oppQs = opposites.map(([w, o], i) =>
    makeMcq({
      id: `${idPrefix}-${pad(i + 1)}`,
      examId: "ieo",
      grade,
      topicId,
      question: `What is the opposite of '${w}'?`,
      correctText: o,
      distractors: opposites.filter((p) => p[0] !== w).map((p) => p[1]).slice(0, 3),
      explanation: `'${o}' is the opposite of '${w}'.`,
      difficulty: tier(i, opposites.length),
      tags: ["opposites"],
      seed: i + 1,
    })
  );

  const animalSounds = [
    ["dog", "puppy", "bark"], ["cat", "kitten", "meow"], ["cow", "calf", "moo"], ["duck", "duckling", "quack"], ["lion", "cub", "roar"],
  ];
  const animalQs = animalSounds.map(([animal, baby], i) =>
    makeMcq({
      id: `${idPrefix}-${pad(i + 20)}`,
      examId: "ieo",
      grade,
      topicId,
      question: `What is a baby ${animal} called?`,
      correctText: baby,
      distractors: animalSounds.filter((a) => a[1] !== baby).map((a) => a[1]).slice(0, 3),
      explanation: `A baby ${animal} is called a ${baby}.`,
      difficulty: tier(i, animalSounds.length),
      tags: ["animal-babies"],
      seed: i + 20,
    })
  );

  const genderPairs = [["boy", "girl"], ["king", "queen"], ["man", "woman"], ["brother", "sister"], ["actor", "actress"]];
  const genderQs = genderPairs.map(([m, f], i) =>
    makeMcq({
      id: `${idPrefix}-${pad(i + 30)}`,
      examId: "ieo",
      grade,
      topicId,
      question: `What is the feminine form of '${m}'?`,
      correctText: f,
      distractors: genderPairs.filter((p) => p[1] !== f).map((p) => p[1]).slice(0, 3),
      explanation: `The feminine form of '${m}' is '${f}'.`,
      difficulty: tier(i, genderPairs.length),
      tags: ["gender"],
      seed: i + 30,
    })
  );

  const plurals = [["cat", "cats"], ["box", "boxes"], ["child", "children"], ["mouse", "mice"], ["book", "books"]];
  const pluralQs = plurals.map(([s, p], i) =>
    makeMcq({
      id: `${idPrefix}-${pad(i + 40)}`,
      examId: "ieo",
      grade,
      topicId,
      question: `What is the plural of '${s}'?`,
      correctText: p,
      distractors: [s + "s", s + "es", plurals[(i + 1) % plurals.length][1]].filter((d) => d !== p).slice(0, 3),
      explanation: `The plural of '${s}' is '${p}'.`,
      difficulty: tier(i, plurals.length),
      tags: ["one-and-many"],
      seed: i + 40,
    })
  );

  const wordsToUnscramble = ["CAT", "DOG", "SUN", "BOOK", "STAR"];
  const jumbleQs = wordsToUnscramble.map((word, i) => {
    const jumbled = word.split("").reverse().join("");
    return makeMcq({
      id: `${idPrefix}-${pad(i + 50)}`,
      examId: "ieo",
      grade,
      topicId,
      question: `Unscramble the letters to make a word: '${jumbled}'`,
      correctText: word,
      distractors: [jumbled, word.slice(1) + word[0], word[0] + word.slice(0, -1)],
      explanation: `The correct word is '${word}'.`,
      difficulty: tier(i, wordsToUnscramble.length),
      tags: ["jumbled-letters"],
      seed: i + 50,
    });
  });

  const extra = grade >= 2
    ? [
        ["What is a word that means the same as 'happy'?", "Glad", ["Sad", "Angry", "Tired"]],
        ["What is a word that means the same as 'big'?", "Huge", ["Tiny", "Small", "Little"]],
        ["Which word sounds the same as 'sun' but is spelled differently?", "Son", ["Sea", "See", "Sew"]],
        ["Which word sounds the same as 'eye' but is spelled differently?", "I", ["Ear", "Egg", "Air"]],
      ]
    : [];
  const extraQs = fromFacts({ idPrefix: `${idPrefix}-x`, examId: "ieo", grade, topicId, tag: "word-power", facts: extra });

  return [...oppQs, ...animalQs, ...genderQs, ...pluralQs, ...jumbleQs, ...extraQs];
}

function generateIeoGrammar(grade) {
  const topicId = `ieo-g${grade}-grammar`;
  const idPrefix = `ieo-g${grade}-gram`;

  const nouns = ["dog", "school", "apple", "river"];
  const verbs = ["run", "jump", "eat", "sing"];
  const nounQs = nouns.map((n, i) =>
    makeMcq({
      id: `${idPrefix}-${pad(i + 1)}`,
      examId: "ieo",
      grade,
      topicId,
      question: "Which of these is a naming word (noun)?",
      correctText: n,
      distractors: [verbs[i], verbs[(i + 1) % verbs.length], verbs[(i + 2) % verbs.length]],
      explanation: `'${n}' names a person, place or thing.`,
      difficulty: tier(i, nouns.length),
      tags: ["nouns"],
      seed: i + 1,
    })
  );
  const verbQs = verbs.map((v, i) =>
    makeMcq({
      id: `${idPrefix}-${pad(i + 10)}`,
      examId: "ieo",
      grade,
      topicId,
      question: "Which of these is an action word (verb)?",
      correctText: v,
      distractors: [nouns[i], nouns[(i + 1) % nouns.length], nouns[(i + 2) % nouns.length]],
      explanation: `'${v}' tells us what someone is doing.`,
      difficulty: tier(i, verbs.length),
      tags: ["verbs"],
      seed: i + 10,
    })
  );

  const articleA = ["dog", "cat", "ball", "table"];
  const articleAn = ["apple", "elephant", "umbrella", "orange"];
  const articleQs = [
    ...articleA.map((w, i) =>
      makeMcq({
        id: `${idPrefix}-${pad(i + 20)}`,
        examId: "ieo",
        grade,
        topicId,
        question: `Which article goes before '${w}': 'a' or 'an'?`,
        correctText: "a",
        distractors: ["an"],
        explanation: `We use 'a' before a consonant sound, like '${w}'.`,
        difficulty: "easy",
        tags: ["articles"],
        seed: i + 20,
      })
    ),
    ...articleAn.map((w, i) =>
      makeMcq({
        id: `${idPrefix}-${pad(i + 25)}`,
        examId: "ieo",
        grade,
        topicId,
        question: `Which article goes before '${w}': 'a' or 'an'?`,
        correctText: "an",
        distractors: ["a"],
        explanation: `We use 'an' before a vowel sound, like '${w}'.`,
        difficulty: "easy",
        tags: ["articles"],
        seed: i + 25,
      })
    ),
  ];

  const prepositions = [
    ["The cat is ___ the box.", "in", ["on", "under"]],
    ["The book is ___ the table.", "on", ["in", "under"]],
    ["The ball rolled ___ the bed.", "under", ["on", "in"]],
  ];
  const prepQs = fromFacts({ idPrefix: `${idPrefix}-p`, examId: "ieo", grade, topicId, tag: "prepositions", facts: prepositions });

  const tenseFacts = [
    ["Yesterday I ___ to the park. (go)", "went", ["go", "going"]],
    ["She ___ a book right now. (read)", "is reading", ["read", "reads"]],
    ["Tomorrow we ___ to the zoo. (go)", "will go", ["went", "going"]],
  ];
  const tenseQs = fromFacts({ idPrefix: `${idPrefix}-t`, examId: "ieo", grade, topicId, tag: "tenses", facts: tenseFacts });

  const punctuationFacts = [
    ["Which punctuation mark ends a question?", "Question mark (?)", ["Full stop (.)", "Comma (,)"]],
    ["Which punctuation mark ends a normal sentence?", "Full stop (.)", ["Question mark (?)", "Exclamation mark (!)"]],
    ["Which punctuation mark shows strong feeling?", "Exclamation mark (!)", ["Comma (,)", "Full stop (.)"]],
  ];
  const punctQs = fromFacts({ idPrefix: `${idPrefix}-u`, examId: "ieo", grade, topicId, tag: "punctuation", facts: punctuationFacts });

  return [...nounQs, ...verbQs, ...articleQs, ...prepQs, ...tenseQs, ...punctQs];
}

function generateIeoReading(grade) {
  const topicId = `ieo-g${grade}-reading`;
  const idPrefix = `ieo-g${grade}-read`;

  const passages = [
    { text: "Riya has a small dog named Tom. Tom is white and loves to play with a ball.", q: "What is the name of Riya's dog?", correct: "Tom", distractors: ["Riya", "Ball"] },
    { text: "Riya has a small dog named Tom. Tom is white and loves to play with a ball.", q: "What colour is Tom?", correct: "White", distractors: ["Black", "Brown"] },
    { text: "Aarav went to the park with his mother and ate an ice cream.", q: "Who did Aarav go with?", correct: "His mother", distractors: ["His father", "His friend"] },
    { text: "The little bird built a nest in the tall tree and laid three eggs.", q: "How many eggs did the bird lay?", correct: "Three", distractors: ["Two", "Four"] },
    { text: "Meera waters the red roses in her garden every morning.", q: "What colour are Meera's roses?", correct: "Red", distractors: ["Yellow", "Blue"] },
  ];
  const passageQs = passages.map((p, i) =>
    makeMcq({
      id: `${idPrefix}-${pad(i + 1)}`,
      examId: "ieo",
      grade,
      topicId,
      question: `Read: "${p.text}" — ${p.q}`,
      correctText: p.correct,
      distractors: p.distractors,
      explanation: `The passage says: "${p.text}"`,
      difficulty: tier(i, passages.length),
      tags: ["comprehension"],
      seed: i + 1,
    })
  );

  const expressionFacts = [
    ["What do you say when someone helps you?", "Thank you", ["Go away", "Nothing"]],
    ["What do you say when you meet someone in the morning?", "Good morning", ["Good night", "Goodbye"]],
    ["What do you say when you make a mistake?", "I am sorry", ["It's fine", "Nothing"]],
    ["What do you say when you want to enter someone's room?", "May I come in?", ["Move aside", "I'm coming"]],
  ];
  const expressionQs = fromFacts({ idPrefix: `${idPrefix}-e`, examId: "ieo", grade, topicId, tag: "spoken-expression", facts: expressionFacts });

  return [...passageQs, ...expressionQs];
}

// ---------------------------------------------------------------------------
// IGKO: General Awareness + Life Skills
// ---------------------------------------------------------------------------

function generateIgkoAwareness(grade) {
  const topicId = `igko-g${grade}-awareness`;
  const idPrefix = `igko-g${grade}-aware`;

  const facts = [
    ["What is the name of our country?", "India", ["China", "Japan"]],
    ["What are the colours of the Indian flag?", "Saffron, white and green", ["Red, white and blue", "Black and white"]],
    ["What is the capital city of India?", "New Delhi", ["Mumbai", "Chennai"]],
    ["Which animal is the national animal of India?", "Tiger", ["Lion", "Elephant"]],
    ["Which flower is the national flower of India?", "Lotus", ["Rose", "Sunflower"]],
    ["Which fruit is called the king of fruits in India?", "Mango", ["Apple", "Banana"]],
    ["Which festival is known as the festival of lights?", "Diwali", ["Holi", "Eid"]],
    ["Which equipment do you use to play cricket?", "Bat and ball", ["Racket", "Net"]],
    ["Which equipment do you use to play badminton?", "Racket and shuttlecock", ["Bat and ball", "Goal post"]],
    ["What do we call a place where wild animals are kept for people to see?", "Zoo", ["School", "Bank"]],
    ["What device do we use to make phone calls?", "A telephone/mobile phone", ["A television", "A fan"]],
    ["What do we use to see far-away objects in the sky?", "A telescope", ["A microscope", "A mirror"]],
    ["What do bees make that we eat?", "Honey", ["Milk", "Butter"]],
    ["Which animal gives us milk?", "Cow", ["Cat", "Dog"]],
    ["Which of these is a fruit?", "Mango", ["Carrot", "Potato"]],
    ["Which of these is a vegetable?", "Carrot", ["Mango", "Banana"]],
    ["What comes after the number 9?", "10", ["8", "11"]],
    ["How many days are in a week?", "7", ["5", "10"]],
    ["Which planet do we live on?", "Earth", ["Mars", "The Moon"]],
    ["Which is the closest star to Earth?", "The Sun", ["The Moon", "A comet"]],
  ];
  return fromFacts({ idPrefix, examId: "igko", grade, topicId, tag: "general-awareness", facts });
}

function generateIgkoLifeSkills(grade) {
  const topicId = `igko-g${grade}-life-skills`;
  const idPrefix = `igko-g${grade}-life`;

  const facts = [
    ["What should you do if your friend falls down?", "Help them up and check if they're okay", ["Laugh at them", "Walk away"]],
    ["What should you do when you disagree with a friend?", "Talk calmly and listen to them", ["Shout at them", "Stop being friends"]],
    ["Why is it important to share your toys?", "It shows kindness and helps everyone have fun", ["It is not important", "Because you must"]],
    ["What should you do if you see someone being bullied?", "Tell a trusted adult", ["Join in", "Ignore it"]],
    ["What is teamwork?", "Working together to reach a common goal", ["Working alone always", "Competing against friends"]],
    ["How should you speak to elders?", "Politely and with respect", ["Rudely", "By ignoring them"]],
    ["What should you do before taking someone else's belongings?", "Ask for permission", ["Just take it", "Hide it"]],
    ["What is a good way to handle anger?", "Take a deep breath and calm down", ["Shout and throw things", "Hit someone"]],
    ["Why should you keep promises?", "It builds trust with others", ["It doesn't matter", "Only sometimes"]],
    ["What should you do if you make a mistake?", "Admit it and try to fix it", ["Blame someone else", "Hide it"]],
    ["What does 'honesty' mean?", "Always telling the truth", ["Telling lies sometimes", "Keeping secrets always"]],
    ["Why is listening carefully important in a team?", "It helps everyone understand and work well together", ["It wastes time", "It is not needed"]],
  ];
  return fromFacts({ idPrefix, examId: "igko", grade, topicId, tag: "life-skills", facts });
}

// ---------------------------------------------------------------------------
// ASSEMBLE
// ---------------------------------------------------------------------------

function assertValid(questions) {
  const ids = new Set();
  for (const q of questions) {
    if (ids.has(q.id)) throw new Error(`Duplicate id ${q.id}`);
    ids.add(q.id);
    if (q.options.length < 2) throw new Error(`Too few options in ${q.id}`);
    if (!q.options.find((o) => o.id === q.correctOptionId)) throw new Error(`Missing correct option in ${q.id}`);
    if (!q.explanation) throw new Error(`Missing explanation in ${q.id}`);
  }
}

function toFileContent(varName, questions) {
  return `import type { Question } from "@/types";\n\nexport const ${varName}: Question[] = ${JSON.stringify(questions, null, 2)};\n`;
}

const GRADES = [1, 2, 3];

const imoQuestions = GRADES.flatMap((g) => [
  ...generateReasoningPool("imo", g, `imo-g${g}-reason`),
  ...generateImoMaths(g),
]);
const nsoQuestions = GRADES.flatMap((g) => [
  ...generateReasoningPool("nso", g, `nso-g${g}-reason`),
  ...generateNsoScience(g),
]);
const ieoQuestions = GRADES.flatMap((g) => [
  ...generateIeoWordStructure(g),
  ...generateIeoGrammar(g),
  ...generateIeoReading(g),
]);
const igkoQuestions = GRADES.flatMap((g) => [...generateIgkoAwareness(g), ...generateIgkoLifeSkills(g)]);

const all = [...imoQuestions, ...nsoQuestions, ...ieoQuestions, ...igkoQuestions];
assertValid(all);

writeFileSync(join(OUT_DIR, "imo.ts"), toFileContent("imoQuestions", imoQuestions));
writeFileSync(join(OUT_DIR, "nso.ts"), toFileContent("nsoQuestions", nsoQuestions));
writeFileSync(join(OUT_DIR, "ieo.ts"), toFileContent("ieoQuestions", ieoQuestions));
writeFileSync(join(OUT_DIR, "igko.ts"), toFileContent("igkoQuestions", igkoQuestions));

console.log("Generated question banks:");
console.log("  imo:", imoQuestions.length);
console.log("  nso:", nsoQuestions.length);
console.log("  ieo:", ieoQuestions.length);
console.log("  igko:", igkoQuestions.length);
console.log("  total:", all.length);
