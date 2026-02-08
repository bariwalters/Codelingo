import { GoogleGenAI } from "@google/genai";
import type { LanguageId } from "../firebase/types";

export type QuestionType = "fill_blank" | "arrange";

export async function generateQuestionGemini(params: {
  language: LanguageId;
  lessonIndex: number;
  questionType: QuestionType;
}) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");

  // ✅ Step 1: Initialize with the New SDK pattern
  const ai = new GoogleGenAI({
    apiKey,
    // 💡 DO NOT add apiVersion: "v1beta" here; let the SDK handle it!
  });

  // @ts-ignore
  ai._clientOptions = { ...ai._clientOptions, allowBrowser: true };

  // ✅ Step 2: Use a supported 2026 model ID
  const modelName = "gemini-2.5-flash"; 

  const prompt = `
    You generate ONE beginner-friendly coding question.

    Return STRICT JSON ONLY (no markdown, no extra text).
    The output MUST match the requested questionType exactly.

    language: ${params.language}
    lessonIndex: ${params.lessonIndex}
    questionType: ${params.questionType}

    Difficulty rules:
    - Treat lessonIndex 0-2 as VERY EASY, 3-6 as EASY, 7+ as medium.
    - No recursion, no sorting, no nested loops deeper than 1, no tricky edge cases.

    COMMON (always include):
    - questionType: "fill_blank" or "arrange"
    - promptText: 1 short sentence
    - explanation: 1 short sentence

    If questionType = "fill_blank":
    - codeSnippet: 5–10 lines max
    - EXACTLY ONE blank token "__" appears exactly once in codeSnippet
    - blanks: array of exactly 1 object:
      {
        "token": "__",
        "choices": [3 choices max],
        "answer": "..."
      }
    - Choose from fundamentals: variables, if/else, simple loops, function call, print.

    If questionType = "arrange":
    - MUST be 3 to 6 blocks total.
    - Blocks must be simple and form a tiny program or function.
    - IMPORTANT: Every block string must be UNIQUE. Do NOT use duplicate blocks like "}" or "{" twice.
      If you need braces, combine them into the line they belong to, e.g. "class X {" or "}" only once.
    - blocks: string[]
    - correctOrder: string[] containing the same strings as blocks in correct order

    Return JSON with only fields needed for that questionType.
    `;




  // ✅ Step 3: Call using the new ai.models syntax
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      // @ts-ignore - Keeps TS happy while satisfying the API requirements
      response_mime_type: "application/json",
    },
  });

  const rawText = response.text || "";
  const cleanedText = rawText.replace(/```json|```/g, "").trim();

  try {
    const obj = JSON.parse(cleanedText);
    return { ...obj, language: params.language, lessonIndex: params.lessonIndex };
  } catch (e) {
    console.error("Cleaned text was:", cleanedText);
    throw new Error("Invalid JSON from Gemini");
  }
}


// import { GoogleGenAI } from "@google/genai";
// import type { LanguageId } from "../firebase/types";

// export type QuestionType = "fill_blank" | "arrange";

// function clamp(n: number, min: number, max: number) {
//   return Math.max(min, Math.min(max, n));
// }

// export async function generateQuestionGemini(params: {
//   language: LanguageId;
//   lessonIndex: number;
//   questionType: QuestionType;
// }) {
//   const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
//   if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");

//   const { language, lessonIndex, questionType } = params;
//   const difficulty = clamp(1 + Math.floor(lessonIndex / 2), 1, 10);

//   // ✅ New SDK + force v1 (stable)
//   const ai = new GoogleGenAI({
//     apiKey,
//     httpOptions: { apiVersion: "v1" },
//   });
//   const model = "gemini-1.5-flash";

//   const prompt = `
// Return STRICT JSON ONLY. No markdown. No extra text.

// You are generating technical interview-style questions for a Duolingo-like coding app.

// language: ${language}
// lessonIndex: ${lessonIndex}
// difficulty: ${difficulty} (1 easy - 10 hard)
// questionType: ${questionType}

// Rules:
// - Output ONLY the JSON object.
// - DO NOT use markdown code blocks or backticks.
// - Start your response with '{' and end with '}'.
// - Must match the requested questionType exactly.
// - Keep it solvable on mobile.
// - Include promptText always.
// - If questionType="fill_blank": include codeSnippet and blanks[{token,choices,answer}]
// - If questionType="arrange": include blocks[] and correctOrder[]
// - Include a short explanation.
// `;


//   // ✅ Change "config" to "generationConfig" OR use the flatter structure
//   const res = await ai.models.generateContent({
//     model: "gemini-1.5-flash", 
//     contents: prompt,
//     // Some versions of the 2026 SDK expect 'generationConfig' instead of 'config'
//     // and 'response_mime_type' (snake_case) for the raw API wire
//     config: {
//       // @ts-ignore - Ignore the red squiggly if TS complains; the API needs snake_case
//       response_mime_type: "application/json", 
//     }
//   });

//   // 1. Get the raw response
//   const rawText = res.text ?? "";

//   // 2. Use Regex to strip markdown backticks (e.g., ```json ... ```)
//   // This regex finds content between ```json and ``` or just ``` and ```
//   const cleanedText = rawText.replace(/```json|```/g, "").trim();

//   let obj: any;
//   try {
//     obj = JSON.parse(cleanedText);
//   } catch (e) {
//     // If parsing still fails, log the cleaned text to see what happened
//     console.error("Failed to parse JSON. Cleaned text was:", cleanedText);
//     throw new Error("Gemini did not return valid JSON.");
//   }

//   return {
//     ...obj,
//     language,
//     lessonIndex,
//     difficulty,
//   };
// }
