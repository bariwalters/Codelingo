import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { GeneratedQuestion, QuestionType, LanguageId } from "../src/firebase/types";
import { generateQuestionGemini } from "../src/ai/gemini";

export default function LessonScreen(props: { onExit: () => void }) {
  const { onExit } = props;

  const [lessonIndex] = useState(0);
  const [language] = useState<LanguageId>("python");

  const [question, setQuestion] = useState<
    Omit<GeneratedQuestion, "id" | "createdAt"> | null
  >(null);

  const [arranged, setArranged] = useState<string[]>([]);
  const [arrangeResult, setArrangeResult] = useState<"correct" | "incorrect" | null>(null);



const [loadingQuestion, setLoadingQuestion] = useState(false);
const [error, setError] = useState<string | null>(null);
const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
const [result, setResult] = useState<"correct" | "incorrect" | null>(null);


async function nextQuestion(type: QuestionType) {
  try {
    setError(null);
    setLoadingQuestion(true);

    console.log("Generating question:", { language, lessonIndex, type });

    const q = await generateQuestionGemini({
      language,
      lessonIndex,
      questionType: type,
    });

    console.log("Generated question:", q);
    setQuestion(q);
  } catch (e: any) {
    console.log("Gemini generation error:", e);
    setError(e?.message ?? String(e));
  } finally {
    setLoadingQuestion(false);
  }
}



  // Start screen
  if (!question) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ marginBottom: 16 }}>Select a question type</Text>

        {loadingQuestion && <Text style={{ marginBottom: 10 }}>Generating…</Text>}

        {error && (
            <Text style={{ marginBottom: 10, color: "red", textAlign: "center" }}>
            {error}
            </Text>
        )}

        <Pressable disabled={loadingQuestion} onPress={() => nextQuestion("fill_blank")}>
            <Text style={{ marginTop: 12, opacity: loadingQuestion ? 0.5 : 1 }}>
            Start Fill Blank
            </Text>
        </Pressable>

        <Pressable disabled={loadingQuestion} onPress={() => nextQuestion("arrange")}>
            <Text style={{ marginTop: 12, opacity: loadingQuestion ? 0.5 : 1 }}>
            Start Arrange
            </Text>
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
          setQuestion(null);
          setSelectedChoice(null);
          setResult(null);
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

  // Arrange (fallback branch)
  const blocks = question.blocks ?? [];
  const correct = question.correctOrder ?? [];

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontWeight: "700" }}>Arrange blocks</Text>
      <Text style={{ marginTop: 10 }}>{question.promptText}</Text>

      <Text style={{ marginTop: 16, fontWeight: "600" }}>Tap blocks to build:</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
        {blocks.map((b, idx) => (
          <Pressable
            key={`${b}-${idx}`}
            onPress={() => {
              setArranged((prev) => [...prev, b]);
              setArrangeResult(null);
            }}
            style={{ padding: 10, borderWidth: 1, borderRadius: 10, borderColor: "#ccc", margin: 4 }}
          >
            <Text>{b}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ marginTop: 14, fontWeight: "600" }}>Your order:</Text>
      <Text style={{ marginTop: 6 }}>{arranged.join(" ")}</Text>

      <View style={{ flexDirection: "row", marginTop: 14 }}>
        <Pressable
          onPress={() => {
            setArranged([]);
            setArrangeResult(null);
          }}
          style={{ padding: 12, borderWidth: 1, borderRadius: 10, borderColor: "#ccc", marginRight: 10 }}
        >
          <Text>Reset</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            const ok = arranged.length === correct.length && arranged.every((x, i) => x === correct[i]);
            setArrangeResult(ok ? "correct" : "incorrect");
          }}
          style={{ padding: 12, borderRadius: 10, backgroundColor: "#4f46e5", opacity: arranged.length ? 1 : 0.5 }}
          disabled={!arranged.length}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Check</Text>
        </Pressable>
      </View>

      {arrangeResult && (
        <Text style={{ marginTop: 14, fontWeight: "700", color: arrangeResult === "correct" ? "green" : "red" }}>
          {arrangeResult === "correct" ? "✅ Correct!" : "❌ Incorrect"}
        </Text>
      )}

      {arrangeResult === "incorrect" && (
        <Text style={{ marginTop: 8 }}>
          Hint: {question.explanation ?? "Try again!"}
        </Text>
      )}

      <Pressable
        onPress={() => {
          setQuestion(null);
          setArranged([]);
          setArrangeResult(null);
          setSelectedChoice(null);
          setResult(null);
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
