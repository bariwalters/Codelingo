import type { GeneratedQuestion, LanguageId, QuestionType } from "../firebase/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function generateQuestionLocal(params: {
  language: LanguageId;
  lessonIndex: number;
  questionType: QuestionType;
}): Omit<GeneratedQuestion, "id" | "createdAt"> {
  const { language, lessonIndex, questionType } = params;

  const difficulty = clamp(1 + Math.floor(lessonIndex / 2), 1, 10);

  // Simple demo content (replace with Gemini later)
  if (questionType === "arrange") {
    return {
      language,
      lessonIndex,
      difficulty,
      questionType, // ✅ key

      promptText: `Arrange the blocks to print Hello World in ${language}.`,
      blocks: ["print", "(", '"Hello World"', ")"],
      correctOrder: ["print", "(", '"Hello World"', ")"],
      explanation: "In Python, print(...) prints output.",
    };
  }

  // fill_blank
  return {
    language,
    lessonIndex,
    difficulty,
    questionType, // ✅ key

    promptText: `Fill in the blank to print Hello World in ${language}.`,
    codeSnippet: "print(___)",
    blanks: [
      {
        token: "___",
        choices: ['"Hello World"', '"Hello"', '"World"'],
        answer: '"Hello World"',
      },
    ],
    explanation: "The correct string must match exactly.",
  };
}
