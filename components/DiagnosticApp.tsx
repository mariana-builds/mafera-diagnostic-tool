"use client";

import { useState, useCallback } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import DiagnosticQuestion from "@/components/DiagnosticQuestion";
import ScopeSummary, { ScopeData } from "@/components/ScopeSummary";
import LeadCapture from "@/components/LeadCapture";
import ThankYouPage from "@/components/ThankYouPage";
import DiscoveryRedirect from "@/components/DiscoveryRedirect";
import {
  automationQuestion,
  getQuestion,
  regularQuestionIds,
} from "@/lib/questions";
import {
  calculateRegularScore,
  getComplexityResult,
  getAutomationResult,
} from "@/lib/scoring";

type Screen = "welcome" | "questions" | "scope" | "lead" | "thankyou" | "discovery";
type Flow = "regular" | "automation";

type Answers = Record<number, string>;
type Scores = Record<number, number>;

interface LeadData {
  name: string;
  email: string;
  company: string;
  context: string;
}

export default function DiagnosticApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [flow, setFlow] = useState<Flow>("regular");
  const [currentQId, setCurrentQId] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [scores, setScores] = useState<Scores>({});
  // History tracks answered question IDs in order (for back navigation)
  const [history, setHistory] = useState<number[]>([]);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  // ── Question flow helpers ─────────────────────────────────────────────────

  const nextQId = useCallback(
    (qId: number, currentFlow: Flow): number | null => {
      if (currentFlow === "automation") return null;
      const idx = regularQuestionIds.indexOf(qId);
      if (idx === -1 || idx === regularQuestionIds.length - 1) return null;
      return regularQuestionIds[idx + 1];
    },
    []
  );

  const currentStep = useCallback((): number => {
    if (flow === "automation") {
      return currentQId === 12 ? 2 : 1;
    }
    return regularQuestionIds.indexOf(currentQId) + 1;
  }, [flow, currentQId]);

  const totalSteps = flow === "automation" ? 2 : regularQuestionIds.length;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    setScreen("questions");
    setCurrentQId(1);
  }, []);

  const handleAnswer = useCallback(
    (qId: number, choice: string, score?: number) => {
      const newAnswers = { ...answers, [qId]: choice };
      const newScores =
        score !== undefined ? { ...scores, [qId]: score } : scores;
      setAnswers(newAnswers);
      setScores(newScores);
      setHistory((h) => [...h, qId]);

      if (qId === 1) {
        if (choice === "C" || choice === "D") {
          setScreen("discovery");
          return;
        }
        if (choice === "B") {
          setFlow("automation");
          setCurrentQId(12);
          return;
        }
        setCurrentQId(2);
        return;
      }

      if (flow === "automation" && qId === 12) {
        setScreen("scope");
        return;
      }

      const next = nextQId(qId, flow);
      if (next) {
        setCurrentQId(next);
      } else {
        setScreen("scope");
      }
    },
    [answers, scores, flow, nextQId]
  );

  const handleBack = useCallback(() => {
    if (history.length === 0) {
      setScreen("welcome");
      return;
    }

    const prevQId = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    const newAnswers = { ...answers };
    delete newAnswers[prevQId];
    const newScores = { ...scores };
    delete newScores[prevQId];

    setHistory(newHistory);
    setAnswers(newAnswers);
    setScores(newScores);
    setCurrentQId(prevQId);

    if (prevQId === 1) {
      setFlow("regular");
    }
  }, [history, answers, scores]);

  const handleBackFromScope = useCallback(() => {
    const lastQId =
      flow === "automation" ? 12 : regularQuestionIds[regularQuestionIds.length - 1];

    const newAnswers = { ...answers };
    delete newAnswers[lastQId];
    const newScores = { ...scores };
    delete newScores[lastQId];

    setHistory((h) => h.slice(0, -1));
    setAnswers(newAnswers);
    setScores(newScores);
    setCurrentQId(lastQId);
    setScreen("questions");
  }, [flow, answers, scores]);

  const handleLeadSubmit = useCallback((data: LeadData) => {
    setLeadData(data);
    setScreen("thankyou");
  }, []);

  const handleReset = useCallback(() => {
    setScreen("welcome");
    setFlow("regular");
    setCurrentQId(1);
    setAnswers({});
    setScores({});
    setHistory([]);
    setLeadData(null);
  }, []);

  // ── Scope data computation ─────────────────────────────────────────────────

  const getScopeData = useCallback((): ScopeData => {
    if (flow === "automation") {
      const q12 = answers[12] ?? "A";
      const result = getAutomationResult(q12);
      return {
        flow: "automation",
        answers,
        q12Choice: q12,
        ...result,
      };
    }
    const totalScore = calculateRegularScore(scores);
    const result = getComplexityResult(totalScore);
    return {
      flow: "regular",
      answers,
      scores,
      ...result,
    };
  }, [flow, answers, scores]);

  // ── Current question ───────────────────────────────────────────────────────

  const currentQuestion = flow === "automation" && currentQId === 12
    ? automationQuestion
    : getQuestion(currentQId);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (screen === "welcome") {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (screen === "discovery") {
    return <DiscoveryRedirect onBack={handleReset} />;
  }

  if (screen === "questions" && currentQuestion) {
    const step = currentStep();
    return (
      <DiagnosticQuestion
        question={currentQuestion}
        currentStep={step}
        totalSteps={totalSteps}
        onAnswer={handleAnswer}
        onBack={step === 1 ? () => setScreen("welcome") : handleBack}
        onReset={handleReset}
      />
    );
  }

  if (screen === "scope") {
    return (
      <ScopeSummary
        scopeData={getScopeData()}
        onProceed={() => setScreen("lead")}
        onBack={handleBackFromScope}
        onReset={handleReset}
      />
    );
  }

  if (screen === "lead") {
    return (
      <LeadCapture
        scopeData={getScopeData()}
        onSubmit={handleLeadSubmit}
        onBack={() => setScreen("scope")}
        onReset={handleReset}
      />
    );
  }

  if (screen === "thankyou") {
    return (
      <ThankYouPage
        scopeData={getScopeData()}
        leadData={leadData}
        onReset={handleReset}
      />
    );
  }

  return null;
}
