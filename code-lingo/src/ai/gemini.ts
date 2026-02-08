import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LanguageId } from "../firebase/types";

export type QuestionType = "fill_blank" | "arrange";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function generateQuestionGemini(params: {
  language: LanguageId;
  lessonIndex: number;
  questionType: QuestionType;
}) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");

  const { language, lessonIndex, questionType } = params;
  const difficulty = clamp(1 + Math.floor(lessonIndex / 2), 1, 10);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

  const prompt = `
Return STRICT JSON ONLY. No markdown. No extra text.

You are generating technical interview-style questions for a Duolingo-like coding app.

language: ${language}
lessonIndex: ${lessonIndex}
difficulty: ${difficulty} (1 easy - 10 hard)
questionType: ${questionType}

Rules:
- Must match the requested questionType exactly.
- Keep it solvable on mobile.
- Include promptText always.
- If questionType="fill_blank": include codeSnippet and blanks[{token,choices,answer}]
- If questionType="arrange": include blocks[] and correctOrder[]
- Include a short explanation.

Output schema example:
{
 "questionType": "fill_blank",
 "promptText": "...",
 "codeSnippet": "...",
 "blanks": [{"token":"___","choices":["a","b"],"answer":"a"}],
 "explanation": "..."
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let obj: any;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new Error("Gemini did not return valid JSON. Got:\n" + text);
  }

  // minimal validation for frontend switching
  if (obj.questionType !== "fill_blank" && obj.questionType !== "arrange") {
    throw new Error("Invalid questionType returned by Gemini");
  }
  if (typeof obj.promptText !== "string") {
    throw new Error("Missing promptText returned by Gemini");
  }

  return {
    ...obj,
    language,
    lessonIndex,
    difficulty,
  };
}
