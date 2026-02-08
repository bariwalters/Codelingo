import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, SafeAreaView, ActivityIndicator } from "react-native";
import type { GeneratedQuestion, QuestionType, LanguageId } from "../src/firebase/types";
import { generateQuestionGemini } from "../src/ai/gemini";
import { generateSpeech } from "../src/services/voiceServices";
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const norm = (s: string) => s.replace(/\s+/g, "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();

export default function LessonScreen({
  lessonIndex,
  language,
  onExit,
}: {
  lessonIndex: number;
  language: LanguageId;
  onExit: () => void;
}) {
  const parsedLessonIndex = Number(lessonIndex);
  const currentLanguage = language;

  const [question, setQuestion] = useState<Omit<GeneratedQuestion, "id" | "createdAt"> | null>(null);
  const [arrangedIdxs, setArrangedIdxs] = useState<number[]>([]);
  const [arrangeResult, setArrangeResult] = useState<"correct" | "incorrect" | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  async function nextQuestion(forcedType?: QuestionType) {
    const type: QuestionType = forcedType ?? (Math.random() < 0.5 ? "fill_blank" : "arrange");
    try {
      setError(null);
      setLoadingQuestion(true);
      const q = await generateQuestionGemini({
        language: currentLanguage,
        lessonIndex: parsedLessonIndex,
        questionType: type,
      });

      if (q.questionType === "fill_blank") {
        if (!q.codeSnippet || !Array.isArray(q.blanks) || q.blanks.length === 0) throw new Error("Invalid fill_blank");
      } else if (q.questionType === "arrange") {
        if (!Array.isArray(q.blocks) || q.blocks.length < 2) throw new Error("Invalid arrange");
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
      const audioDataUri = await generateSpeech(text);
      const { sound } = await Audio.Sound.createAsync({ uri: audioDataUri }, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) await sound.unloadAsync();
      });
    } catch (e) { console.error("Voice Error:", e); }
  }

  useEffect(() => { nextQuestion(); }, [parsedLessonIndex, currentLanguage]);

  if (!question) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2F4156" />
        <Text style={styles.loadingText}>Synthesizing lesson...</Text>
      </View>
    );
  }

  const blocks = question.blocks ?? [];
  const availableIdxs = blocks.map((_, idx) => idx).filter((idx) => !arrangedIdxs.includes(idx));
  const correct = question.correctOrder ?? [];
  const arranged = arrangedIdxs.map((idx) => blocks[idx]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={onExit} style={styles.closeButton}>
          <Ionicons name="close" size={32} color="white" />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: '45%' }]} />
        </View>
        <View style={styles.headerRight}><Ionicons name="book-outline" size={26} color="white" /></View>
      </View>
      
      <View style={styles.content}>
        {/* Top Section: Now pushed down by paddingTop */}
        <View style={styles.topSection}>
          <Text style={styles.instructionText}>
            {question.questionType === "arrange" ? "Arrange the code blocks" : "Fill in the blank"}
          </Text>

          <View style={styles.mascotRow}>
            <Image source={require('../assets/cat-avatar.png')} style={styles.mascotImage} />
            <Pressable style={styles.speechBubble} onPress={() => handleSpeak(question.promptText)}>
              <Ionicons name="volume-medium" size={22} color="#2F4156" style={{ marginRight: 8 }} />
              <Text style={styles.speechText}>{question.promptText}</Text>
            </Pressable>
          </View>
        </View>

        {/* Middle Section */}
        <View style={styles.mainWorkArea}>
          {question.questionType === "arrange" ? (
            <View style={{ width: '100%' }}>
              <View style={styles.answerSection}>
                <View style={styles.linesContainer}>
                  {[1, 2, 3].map((i) => <View key={i} style={styles.underline} />)}
                </View>
                <View style={styles.arrangedBlocksWrapper}>
                  {arrangedIdxs.map((blockIdx, idx) => (
                    <Pressable 
                      key={`arranged-${idx}`} 
                      style={styles.blockActive}
                      onPress={() => { setArrangedIdxs(prev => prev.filter((_, i) => i !== idx)); setArrangeResult(null); }}
                    >
                      <Text style={styles.blockText}>{blocks[blockIdx]}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.optionsArea}>
                {availableIdxs.map((blockIdx) => (
                  <Pressable
                    key={`avail-${blockIdx}`}
                    style={styles.blockInactive}
                    onPress={() => { setArrangedIdxs(prev => [...prev, blockIdx]); setArrangeResult(null); }}
                  >
                    <Text style={styles.blockText}>{blocks[blockIdx]}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={{ width: '100%' }}>
              <View style={styles.codeSnippetContainer}>
                <Text style={styles.codeSnippet}>{question.codeSnippet}</Text>
              </View>
              <View style={styles.choicesGrid}>
                {question.blanks?.[0]?.choices?.map((choice) => (
                  <Pressable
                    key={choice}
                    onPress={() => { setSelectedChoice(choice); setResult(null); }}
                    style={[styles.choiceButton, selectedChoice === choice && styles.choiceButtonSelected]}
                  >
                    <Text style={styles.blockText}>{choice}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Bottom Section */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.checkButton, 
              ((question.questionType === "arrange" && arranged.length === 0) || 
               (question.questionType === "fill_blank" && !selectedChoice)) && styles.disabledButton
            ]}
            onPress={() => {
              if (question.questionType === "arrange") {
                const isCorrect = arranged.length === correct.length &&
                  arranged.every((val, i) => norm(val) === norm(correct[i]));
                setArrangeResult(isCorrect ? "correct" : "incorrect");
              } else {
                const isCorrect = selectedChoice === question.blanks?.[0]?.answer;
                setResult(isCorrect ? "correct" : "incorrect");
              }
            }}
          >
            <Text style={styles.checkButtonText}>CHECK</Text>
          </Pressable>
        </View>

        {(arrangeResult || result) && (
           <View style={[styles.feedbackPopup, (arrangeResult === "incorrect" || result === "incorrect") && styles.feedbackPopupError]}>
              <Text style={[styles.feedbackText, (arrangeResult === "incorrect" || result === "incorrect") && { color: '#dc2626' }]}>
                {(arrangeResult === "correct" || result === "correct") ? "✅ Perfect!" : "❌ Not quite right"}
              </Text>
              {(arrangeResult === "incorrect" || result === "incorrect") && (
                <Text style={styles.explanationText}>Hint: {question.explanation}</Text>
              )}
              <Pressable onPress={() => nextQuestion()} style={[styles.nextBtn, (arrangeResult === "incorrect" || result === "incorrect") && { backgroundColor: '#dc2626' }]}>
                <Text style={{color: 'white', fontWeight: '900'}}>CONTINUE</Text>
              </Pressable>
           </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#DDE8F0' },
  headerContainer: { height: 60, backgroundColor: '#2F4156', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginHorizontal: 15, borderRadius: 22, marginTop: 10 },
  
  // Re-added these two to fix the TypeScript errors
  closeButton: { padding: 5 },
  headerRight: { padding: 5 },

  progressTrack: { flex: 1, height: 10, backgroundColor: '#40566E', borderRadius: 10, marginHorizontal: 15 },
  progressBar: { height: '100%', backgroundColor: '#DDE8F0', borderRadius: 10 },
  
  content: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingBottom: 10 
  },
  
  // This moves the "Arrange" text, the cat, and the bubble lower
  topSection: { 
    width: '100%', 
    marginTop: 50, // Increase this to 70 or 80 if you want it even lower
    marginBottom: 20 
  },
  
  instructionText: { fontSize: 18, fontFamily: 'Courier', fontWeight: 'bold', color: '#333', marginBottom: 10 },
  mascotRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  mascotImage: { width: 60, height: 70, resizeMode: 'contain' },
  speechBubble: { flex: 1, backgroundColor: '#F9F9F9', borderWidth: 2, borderColor: '#2F4156', borderRadius: 18, padding: 10, marginLeft: 10, flexDirection: 'row', alignItems: 'center', minHeight: 60 },
  speechText: { fontSize: 14, fontFamily: 'Courier', color: '#2F4156', flex: 1, fontWeight: '600' },

  // Keeps the work area tucked under the cat instead of floating in the center
  mainWorkArea: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 20 
  },

  answerSection: { height: 120, position: 'relative', width: '100%' },
  linesContainer: { width: '100%', position: 'absolute', top: 0, bottom: 0 },
  underline: { height: 2, backgroundColor: '#2F4156', width: '100%', marginTop: 38 },
  arrangedBlocksWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, width: '100%' },
  optionsArea: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 15 },
  blockActive: { backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1.5, borderColor: '#2F4156' },
  blockInactive: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, borderColor: '#CBD5E0' },
  blockText: { fontSize: 15, fontFamily: 'Courier', color: '#2F4156', fontWeight: 'bold' },
  codeSnippetContainer: { width: '100%', marginBottom: 15 },
  codeSnippet: { backgroundColor: '#2F4156', color: '#DDE8F0', padding: 12, borderRadius: 12, fontFamily: 'Courier', fontSize: 14 },
  choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  choiceButton: { backgroundColor: 'white', padding: 10, borderRadius: 12, borderWidth: 2, borderColor: '#CBD5E0', width: '47%', alignItems: 'center' },
  choiceButtonSelected: { borderColor: '#2F4156', backgroundColor: '#EBF4FF' },
  footer: { width: '100%', height: 70, justifyContent: 'center' },
  checkButton: { backgroundColor: '#2F4156', height: 55, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  disabledButton: { opacity: 0.4 },
  checkButtonText: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DDE8F0' },
  loadingText: { marginTop: 15, fontFamily: 'Courier', fontSize: 16, color: '#2F4156' },
feedbackPopup: { 
    position: 'absolute', 
    // Push it further down to account for safe area and padding
    bottom: -40, 
    left: -20, 
    right: -20, 
    backgroundColor: '#DCFCE7', 
    padding: 25, 
    // Increase bottom padding so content doesn't get cut off by the home bar
    paddingBottom: 60, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    alignItems: 'center', 
    zIndex: 100,
    // Add elevation/shadow to make it look layered
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  feedbackPopupError: { backgroundColor: '#FEE2E2' },
  feedbackText: { fontSize: 20, fontWeight: '900', color: '#166534', marginBottom: 5 },
  explanationText: { color: '#444', marginBottom: 10, textAlign: 'center', fontFamily: 'Courier', fontSize: 13 },
  nextBtn: { backgroundColor: '#166534', paddingHorizontal: 40, paddingVertical: 10, borderRadius: 12 }
});