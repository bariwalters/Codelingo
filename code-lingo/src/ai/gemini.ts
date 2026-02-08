import { GoogleGenAI } from "@google/genai";
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

  // ✅ New SDK + force v1 (stable)
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { apiVersion: "v1" },
  });

  // ✅ Use a currently supported model id
  // Good “safe default” is gemini-2.0-flash
  const model = "gemini-2.5-flash";

  const prompt = `
Return STRICT JSON ONLY. No markdown. No extra text.

You are generating technical interview-style questions for a Duolingo-like coding app.

language: ${language}
lessonIndex: ${lessonIndex}
difficulty: ${difficulty} (1 easy - 10 hard)
questionType: ${questionType}

Rules:
- Output ONLY the JSON object.
- DO NOT use markdown code blocks or backticks.
- Start your response with '{' and end with '}'.
- Must match the requested questionType exactly.
- Keep it solvable on mobile.
- Include promptText always.
- If questionType="fill_blank": include codeSnippet and blanks[{token,choices,answer}]
- If questionType="arrange": include blocks[] and correctOrder[]
- Include a short explanation.
`;


  // ✅ Change "config" to "generationConfig" OR use the flatter structure
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: prompt,
    // Some versions of the 2026 SDK expect 'generationConfig' instead of 'config'
    // and 'response_mime_type' (snake_case) for the raw API wire
    config: {
      // @ts-ignore - Ignore the red squiggly if TS complains; the API needs snake_case
      response_mime_type: "application/json", 
    }
  });

  // const text = (res.text ?? "").trim();

  // let obj: any;
  // try {
  //   obj = JSON.parse(text);
  // } catch {
  //   throw new Error("Gemini did not return valid JSON. Got:\n" + text);
  // }

  // if (obj.questionType !== "fill_blank" && obj.questionType !== "arrange") {
  //   throw new Error("Invalid questionType returned by Gemini");
  // }
  // if (typeof obj.promptText !== "string") {
  //   throw new Error("Missing promptText returned by Gemini");
  // }

  // 1. Get the raw response
  const rawText = res.text ?? "";

  // 2. Use Regex to strip markdown backticks (e.g., ```json ... ```)
  // This regex finds content between ```json and ``` or just ``` and ```
  const cleanedText = rawText.replace(/```json|```/g, "").trim();

  let obj: any;
  try {
    obj = JSON.parse(cleanedText);
  } catch (e) {
    // If parsing still fails, log the cleaned text to see what happened
    console.error("Failed to parse JSON. Cleaned text was:", cleanedText);
    throw new Error("Gemini did not return valid JSON.");
  }

  return {
    ...obj,
    language,
    lessonIndex,
    difficulty,
  };
}



// import { GoogleGenerativeAI } from "@google/generative-ai";
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

//   const genAI = new GoogleGenerativeAI(apiKey);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });  
//   const prompt = `
// Return STRICT JSON ONLY. No markdown. No extra text.

// You are generating technical interview-style questions for a Duolingo-like coding app.

// language: ${language}
// lessonIndex: ${lessonIndex}
// difficulty: ${difficulty} (1 easy - 10 hard)
// questionType: ${questionType}

// Rules:
// - Must match the requested questionType exactly.
// - Keep it solvable on mobile.
// - Include promptText always.
// - If questionType="fill_blank": include codeSnippet and blanks[{token,choices,answer}]
// - If questionType="arrange": include blocks[] and correctOrder[]
// - Include a short explanation.

// Output schema example:
// {
//  "questionType": "fill_blank",
//  "promptText": "...",
//  "codeSnippet": "...",
//  "blanks": [{"token":"___","choices":["a","b"],"answer":"a"}],
//  "explanation": "..."
// }
// `;

//   const result = await model.generateContent(prompt);
//   const text = result.response.text().trim();

//   let obj: any;
//   try {
//     obj = JSON.parse(text);
//   } catch {
//     throw new Error("Gemini did not return valid JSON. Got:\n" + text);
//   }

//   // minimal validation for frontend switching
//   if (obj.questionType !== "fill_blank" && obj.questionType !== "arrange") {
//     throw new Error("Invalid questionType returned by Gemini");
//   }
//   if (typeof obj.promptText !== "string") {
//     throw new Error("Missing promptText returned by Gemini");
//   }

//   return {
//     ...obj,
//     language,
//     lessonIndex,
//     difficulty,
//   };
// }
