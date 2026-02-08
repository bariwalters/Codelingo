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

  // --- ARRANGE QUESTION UI ---
  const availableBlocks = (question.blocks ?? []).filter(
    (block) => !arranged.includes(block)
  );
  const correct = question.correctOrder ?? [];

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>Arrange the code</Text>
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
        {arranged.map((b, idx) => (
          <Pressable
            key={`arranged-${idx}`}
            onPress={() => {
              // Remove block from arranged and put it back in available
              setArranged((prev) => prev.filter((_, i) => i !== idx));
              setArrangeResult(null);
            }}
            style={{ 
              padding: 10, 
              backgroundColor: "#4f46e5", 
              borderRadius: 8, 
              margin: 4 
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>{b}</Text>
          </Pressable>
        ))}
      </View>

      {/* OPTIONS AREA: Available blocks to choose from */}
      <Text style={{ marginTop: 20, fontWeight: "600" }}>Available Blocks:</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
        {availableBlocks.map((b, idx) => (
          <Pressable
            key={`available-${idx}`}
            onPress={() => {
              setArranged((prev) => [...prev, b]);
              setArrangeResult(null);
            }}
            style={{ 
              padding: 10, 
              borderWidth: 1, 
              borderRadius: 8, 
              borderColor: "#ccc", 
              margin: 4,
              backgroundColor: "white" 
            }}
          >
            <Text>{b}</Text>
          </Pressable>
        ))}
      </View>

      {/* ACTIONS */}
      <View style={{ flexDirection: "row", marginTop: 24, gap: 10 }}>
        <Pressable
          onPress={() => {
            setArranged([]);
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
            // 1. Convert both arrays into "Compressed" strings (no spaces at all)
            // This makes "print (" and "print(" identical to the logic
            const userCode = arranged.join("").replace(/\s+/g, "");
            const correctCode = correct.join("").replace(/\s+/g, "");

            // 2. Debug logs - check these in your terminal!
            console.log("Compressed User:", userCode);
            console.log("Compressed Correct:", correctCode);

            // 3. Compare the final strings
            const isCorrect = userCode === correctCode && userCode.length > 0;
            
            setArrangeResult(isCorrect ? "correct" : "incorrect");
          }}
          style={{ 
            flex: 2,
            padding: 14, 
            borderRadius: 10, 
            backgroundColor: "#4f46e5", 
            opacity: arranged.length > 0 ? 1 : 0.5,
            alignItems: "center"
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
          setQuestion(null);
          setArranged([]);
          setArrangeResult(null);
        }}
        style={{ marginTop: 30, alignItems: "center" }}
      >
        <Text style={{ color: "#4f46e5", fontWeight: "600" }}>← Try another question</Text>
      </Pressable>
    </View>
  );
}