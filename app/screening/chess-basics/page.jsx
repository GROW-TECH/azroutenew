'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, Crown, BookOpen } from 'lucide-react';

export default function ChessBasicsScreening() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const basicsQuestions = [
    {
      question: "Chess is played on a board with how many squares?",
      options: ["32 squares", "48 squares", "64 squares", "72 squares"],
      correct: 2,
      explanation: "A chess board has 64 squares (8x8 grid)"
    },
    {
      question: "Each player starts with how many pieces?",
      options: ["12 pieces", "14 pieces", "16 pieces", "18 pieces"],
      correct: 2,
      explanation: "Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights, and 8 pawns"
    },
    {
      question: "Which piece can only move diagonally?",
      options: ["Rook", "Knight", "Bishop", "Queen"],
      correct: 2,
      explanation: "The bishop can only move diagonally across the board"
    },
    {
      question: "What is the goal of chess?",
      options: ["Capture all opponent pieces", "Control the center", "Checkmate the opponent's king", "Promote all pawns"],
      correct: 2,
      explanation: "The goal is to checkmate the opponent's king - put it in check with no way to escape"
    },
    {
      question: "Which piece moves in an 'L' shape?",
      options: ["Bishop", "Knight", "Rook", "Pawn"],
      correct: 1,
      explanation: "The knight moves in an 'L' shape: two squares in one direction and one square perpendicular"
    }
  ];

  useEffect(() => {
    setMounted(true);
    const data = sessionStorage.getItem('studentDetails');
    const chessKnowledge = sessionStorage.getItem('chessKnowledge');
    if (!data || chessKnowledge !== 'no') {
      router.push('/screening/student-details');
      return;
    }
  }, [router]);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (answerIndex === basicsQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < basicsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      generateScreeningReport(
        newAnswers,
        score + (answerIndex === basicsQuestions[currentQuestion].correct ? 1 : 0)
      );
    }
  };

  const generateScreeningReport = (finalAnswers, finalScore) => {
    const studentData = JSON.parse(sessionStorage.getItem('studentDetails'));
    const percentage = (finalScore / basicsQuestions.length) * 100;

    let level, recommendation;
    if (percentage >= 60) {
      level = "Beginner with Knowledge";
      recommendation = "Has basic chess knowledge, ready for beginner training programs";
    } else {
      level = "Complete Beginner";
      recommendation = "Recommended to start with absolute basics and fundamentals";
    }

    const report = {
      studentName: studentData.studentName,
      screeningType: "Chess Basics Q&A",
      score: finalScore,
      totalQuestions: basicsQuestions.length,
      percentage: percentage.toFixed(1),
      level,
      recommendation,
      answers: finalAnswers,
      completedAt: new Date().toISOString()
    };

    sessionStorage.setItem('screeningReport', JSON.stringify(report));
  };

  const handleContinue = () => {
    router.push('/screening/report');
  };

  if (!mounted) return null;

  if (showResults) {
    const percentage = (score / basicsQuestions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              Chess Basics Assessment Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-primary">
                {score}/{basicsQuestions.length}
              </div>
              <div className="text-xl">
                Score: {percentage.toFixed(1)}%
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Assessment Result:</h3>
                <p className="text-lg">
                  {percentage >= 60 ? "Beginner with Basic Knowledge" : "Complete Beginner"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {percentage >= 60
                    ? "You have some understanding of chess basics!"
                    : "Perfect! Everyone starts somewhere, and you're at the right place!"}
                </p>
              </div>

              <Button onClick={handleContinue} className="w-full">
                View Full Report & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/screening/chess-knowledge')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-center mb-2">Chess Basics Assessment</h1>
        <p className="text-center text-muted-foreground">
          Question {currentQuestion + 1} of {basicsQuestions.length}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {basicsQuestions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {basicsQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={loading}
                variant="outline"
                className="w-full h-auto p-4 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {option}
              </Button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
            <Crown className="mr-2 h-4 w-4" />
            Don't worry if you're not sure – this is just to help us understand your level!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
