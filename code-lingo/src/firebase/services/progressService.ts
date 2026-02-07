// import type { LanguageId } from "../types";
// import { applyLessonCompletion, getOrCreateProgress } from "../db";

// export const progressService = {
//   getOrCreateProgress,

//   async completeLesson(params: {
//     uid: string;
//     language: LanguageId;
//     lessonId: string;
//     nextLessonIndex: number;
//     score: number; // 0-5
//     xpGained?: number; // default 5
//   }) {
//     return applyLessonCompletion({
//       uid: params.uid,
//       language: params.language,
//       lessonId: params.lessonId,
//       nextLessonIndex: params.nextLessonIndex,
//       xpGained: params.xpGained ?? 5,
//       score: params.score,
//     });
//   },
// };
