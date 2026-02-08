import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { GeneratedQuestion, QuestionType, LanguageId } from "../src/firebase/types";
import { generateQuestionGemini } from "../src/ai/gemini";
import { generateSpeech } from "../src/services/voiceServices";
import { Audio } from 'expo-av';

const norm = (s: string) => s.replace(/\s+/g, "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();

export default function LessonScreen({
  lessonIndex,
  language,
  onExit,
}: {
  lessonIndex: number;
  language: LanguageId; // ✅ use proper type
  onExit: () => void;
}) {
  // ✅ lessonIndex is already a number passed from MainShell
  const parsedLessonIndex = Number(lessonIndex);

  // ✅ DO NOT redeclare language with useState
  const currentLanguage = language;

  const [question, setQuestion] = useState<
    Omit<GeneratedQuestion, "id" | "createdAt"> | null
  >(null);

  const [arrangedIdxs, setArrangedIdxs] = useState<number[]>([]);
  const [arrangeResult, setArrangeResult] = useState<"correct" | "incorrect" | null>(null);

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  async function nextQuestion(forcedType?: QuestionType) {
    const type: QuestionType =
      forcedType ?? (Math.random() < 0.5 ? "fill_blank" : "arrange");

    try {
      setError(null);
      setLoadingQuestion(true);

      const q = await generateQuestionGemini({
        language: currentLanguage,
        lessonIndex: parsedLessonIndex,
        questionType: type,
      });

      // ✅ Validate required fields; if missing, throw so we regenerate
      if (q.questionType === "fill_blank") {
        if (!q.codeSnippet || !Array.isArray(q.blanks) || q.blanks.length === 0) {
          throw new Error("Gemini returned an invalid fill_blank question.");
        }
      } else if (q.questionType === "arrange") {
        if (!Array.isArray(q.blocks) || q.blocks.length < 2 || !Array.isArray(q.correctOrder)) {
          throw new Error("Gemini returned an invalid arrange question (missing blocks).");
        }
      } else {
        throw new Error("Gemini returned an unknown questionType.");
      }

      setQuestion(q);
      setArrangedIdxs([]);
      setArrangeResult(null);
      setSelectedChoice(null);
      setResult(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function handleSpeak(text: string) {
    try {
      console.log("Generating voice for mobile/web...");
      const audioDataUri = await generateSpeech(text);

      // Play using expo-av instead of 'new Audio'
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioDataUri },
        { shouldPlay: true }
      );

      // Automatically unload sound from memory when finished
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (e) {
      console.error("Voice Error:", e);
    }
  }

  // ... keep the rest of your UI the same

  useEffect(() => {
    nextQuestion(); // random between two types
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedLessonIndex, currentLanguage]);



  // Start screen
  if (!question) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ marginBottom: 10 }}>Loading question…</Text>
        {loadingQuestion && <Text>Generating…</Text>}
        {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}
        <Pressable onPress={() => nextQuestion()} style={{ marginTop: 16 }}>
          <Text>Retry</Text>
        </Pressable>
        <Pressable onPress={onExit} style={{ marginTop: 24 }}>
          <Text style={{ color: "red" }}>Exit Lesson</Text>
        </Pressable>
      </View>
    );
  }



  // Fill blank
  if (question.questionType === "fill_blank") {
  const blank = question.blanks?.[0];

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontWeight: "700" }}>Fill in the blank</Text>
      <Pressable 
        onPress={() => handleSpeak(question.promptText)} 
        style={{ backgroundColor: '#e0e7ff', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginVertical: 10 }}
      >
        <Text style={{ color: '#4f46e5', fontWeight: 'bold' }}>🔈 Listen</Text>
      </Pressable>
      <Text style={{ marginTop: 10 }}>{question.promptText}</Text>
      <Text style={{ marginTop: 10 }}>{question.codeSnippet}</Text>

      <Text style={{ marginTop: 16, fontWeight: "600" }}>Choose an answer:</Text>

      {blank?.choices?.map((choice) => (
        <Pressable
          key={choice}
          onPress={() => {
            setSelectedChoice(choice);
            setResult(null);
          }}
          style={{
            marginTop: 10,
            padding: 12,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: selectedChoice === choice ? "#4f46e5" : "#ccc",
          }}
        >
          <Text>{choice}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() => {
          if (!blank) return;
          if (!selectedChoice) return;
          setResult(selectedChoice === blank.answer ? "correct" : "incorrect");
        }}
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 10,
          backgroundColor: "#4f46e5",
          opacity: selectedChoice ? 1 : 0.5,
        }}
        disabled={!selectedChoice}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
          Check Answer
        </Text>
      </Pressable>

      {result && (
        <Text style={{ marginTop: 14, fontWeight: "700", color: result === "correct" ? "green" : "red" }}>
          {result === "correct" ? "✅ Correct!" : "❌ Incorrect"}
        </Text>
      )}

      {result === "incorrect" && (
        <Text style={{ marginTop: 8 }}>
          Hint: {question.explanation ?? "Try again!"}
        </Text>
      )}

      <Pressable
        onPress={() => {
          nextQuestion();          // ✅ new random question
          setArrangedIdxs([]);
          setArrangeResult(null);
        }}
        style={{ marginTop: 24 }}
      >
        <Text>Back to question picker</Text>
      </Pressable>

      <Pressable onPress={onExit} style={{ marginTop: 12 }}>
        <Text style={{ color: "red" }}>Exit Lesson</Text>
      </Pressable>
    </View>
  );
}

  // --- ARRANGE QUESTION UI ---
  const blocks = question.blocks ?? [];

  // represent blocks by index so duplicates are distinct
  const availableIdxs = blocks
    .map((_, idx) => idx)
    .filter((idx) => !arrangedIdxs.includes(idx));

  const correct = question.correctOrder ?? [];

  // map arranged indices -> actual block text (preserves duplicates)
  const arranged = arrangedIdxs.map((idx) => blocks[idx]);


  if ((question.blocks ?? []).length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ marginBottom: 10, color: "red" }}>
          This arrange question didn’t include blocks.
        </Text>

        <Pressable onPress={() => nextQuestion("arrange")}>
          <Text>Regenerate Arrange</Text>
        </Pressable>

        <Pressable onPress={() => nextQuestion("fill_blank")} style={{ marginTop: 10 }}>
          <Text>Regenerate Fill Blank</Text>
        </Pressable>

        <Pressable onPress={onExit} style={{ marginTop: 24 }}>
          <Text style={{ color: "red" }}>Exit Lesson</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>Arrange the code</Text>
      <Pressable 
        onPress={() => handleSpeak(question.promptText)} // New direct version
        style={{ backgroundColor: '#e0e7ff', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 }}
        >
        <Text style={{ color: '#4f46e5', fontWeight: 'bold' }}>🔈 Listen</Text>
      </Pressable>
      <Text style={{ marginTop: 10, color: "#444" }}>{question.promptText}</Text>

      {/* ANSWER AREA: Where blocks go when tapped */}
      <View style={{ 
        marginTop: 20, 
        minHeight: 60, 
        padding: 10, 
        backgroundColor: "#f9fafb", 
        borderWidth: 2, 
        borderStyle: "dashed", 
        borderColor: "#ddd",
        borderRadius: 12,
        flexDirection: "row",
        flexWrap: "wrap"
      }}>
        {arranged.length === 0 && <Text style={{ color: "#aaa" }}>Tap blocks below to build your answer...</Text>}
        {arrangedIdxs.map((blockIdx, idx) => {
          const b = blocks[blockIdx];
          return (
            <Pressable
              key={`arranged-${idx}-${blockIdx}`}
              onPress={() => {
                setArrangedIdxs((prev) => prev.filter((_, i) => i !== idx));
                setArrangeResult(null);
              }}
              style={{
                padding: 10,
                backgroundColor: "#4f46e5",
                borderRadius: 8,
                margin: 4,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>{b}</Text>
            </Pressable>
          );
        })}

      </View>

      {/* OPTIONS AREA: Available blocks to choose from */}
      <Text style={{ marginTop: 20, fontWeight: "600" }}>Available Blocks:</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
        {availableIdxs.map((blockIdx) => {
          const b = blocks[blockIdx];
          return (
            <Pressable
              key={`available-${blockIdx}`}
              onPress={() => {
                setArrangedIdxs((prev) => [...prev, blockIdx]);
                setArrangeResult(null);
              }}
              style={{
                padding: 10,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#ccc",
                margin: 4,
                backgroundColor: "white",
              }}
            >
              <Text>{b}</Text>
            </Pressable>
          );
        })}

      </View>

      {/* ACTIONS */}
      <View style={{ flexDirection: "row", marginTop: 24, gap: 10 }}>
        <Pressable
          onPress={() => {
            setArrangedIdxs([]);
            setArrangeResult(null);
          }}
          style={{ 
            flex: 1,
            padding: 14, 
            borderWidth: 1, 
            borderRadius: 10, 
            borderColor: "#ccc", 
            alignItems: "center"
          }}
        >
          <Text>Clear All</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            const isCorrect =
              arranged.length === correct.length &&
              arranged.every((val, i) => norm(val) === norm(correct[i]));

            setArrangeResult(isCorrect ? "correct" : "incorrect");
          }}
          style={{
            flex: 2,
            padding: 14,
            borderRadius: 10,
            backgroundColor: "#4f46e5",
            opacity: arranged.length > 0 ? 1 : 0.5,
            alignItems: "center",
          }}
          disabled={arranged.length === 0}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Check Order</Text>
        </Pressable>


        {/* <Pressable
          onPress={() => {
            // Normalize strings (trim) and compare
            const ok = 
              arranged.length === correct.length && 
              arranged.every((val, i) => val.trim() === correct[i].trim());
            
            setArrangeResult(ok ? "correct" : "incorrect");
          }}
          style={{ 
            flex: 2,
            padding: 14, 
            borderRadius: 10, 
            backgroundColor: "#4f46e5", 
            opacity: arranged.length === correct.length ? 1 : 0.5,
            alignItems: "center"
          }}
          disabled={arranged.length !== correct.length}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Check Order</Text>
        </Pressable> */}
      </View>

      {/* FEEDBACK */}
      {arrangeResult && (
        <View style={{ 
          marginTop: 20, 
          padding: 15, 
          borderRadius: 10, 
          backgroundColor: arrangeResult === "correct" ? "#ecfdf5" : "#fef2f2" 
        }}>
          <Text style={{ 
            fontWeight: "700", 
            color: arrangeResult === "correct" ? "#059669" : "#dc2626" 
          }}>
            {arrangeResult === "correct" ? "✅ Perfect Coding!" : "❌ Not quite right"}
          </Text>
          {arrangeResult === "incorrect" && (
            <Text style={{ marginTop: 5, color: "#444" }}>
              Hint: {question.explanation}
            </Text>
          )}
        </View>
      )}

      {/* NAVIGATION */}
      <Pressable
        onPress={() => {
          nextQuestion();          // ✅ new random question
          setArrangedIdxs([]);
          setArrangeResult(null);
        }}
        style={{ marginTop: 30, alignItems: "center" }}
      >
        <Text style={{ color: "#4f46e5", fontWeight: "600" }}>← Try another question</Text>
      </Pressable>
    </View>
  );
}