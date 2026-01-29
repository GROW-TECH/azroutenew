'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, Trophy, Clock } from 'lucide-react';

export default function RookieLevelScreening() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const rookieQuestions = [
    {
      question: "What is the most powerful piece in chess?",
      options: ["King", "Queen", "Rook", "Bishop"],
      correct: 1
    },
    {
      question: "How many squares does a knight move in an 'L' shape?",
      options: ["2 squares", "3 squares", "4 squares", "5 squares"],
      correct: 1
    },
    {
      question: "What is checkmate?",
      options: ["When a piece is captured", "When the king is in check and cannot escape", "When a pawn reaches the other side", "When the game is a draw"],
      correct: 1
    },
    {
      question: "Which piece can move diagonally across the board?",
      options: ["Rook", "Knight", "Bishop", "Queen"],
      correct: 2
    },
    {
      question: "What is the opening move called when you move the king's pawn two squares forward?",
      options: ["Sicilian Defense", "King's Pawn Opening", "Queen's Gambit", "French Defense"],
      correct: 1
    }
  ];

  useEffect(() => {
    setMounted(true);
    const data = sessionStorage.getItem('studentDetails');
    const chessKnowledge = sessionStorage.getItem('chessKnowledge');
    if (!data || chessKnowledge !== 'yes') {
      router.push('/screening/student-details');
      return;
    }
  }, [router]);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    if (answerIndex === rookieQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < rookieQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      generateScreeningReport(newAnswers, score + (answerIndex === rookieQuestions[currentQuestion].correct ? 1 : 0));
    }
  };

  const generateScreeningReport = (finalAnswers, finalScore) => {
    const studentData = JSON.parse(sessionStorage.getItem('studentDetails'));
    const percentage = (finalScore / rookieQuestions.length) * 100;
    
    let level, recommendation;
    if (percentage >= 80) {
      level = "Intermediate";
      recommendation = "Ready for intermediate training programs";
    } else if (percentage >= 60) {
      level = "Beginner-Intermediate";
      recommendation = "Start with beginner to intermediate courses";
    } else {
      level = "Beginner";
      recommendation = "Recommended to start with basic chess fundamentals";
    }

    const report = {
      studentName: studentData.studentName,
      screeningType: "Rookie Level",
      score: finalScore,
      totalQuestions: rookieQuestions.length,
      percentage: percentage.toFixed(1),
      level: level,
      recommendation: recommendation,
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
    const percentage = (score / rookieQuestions.length) * 100;
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Screening Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-primary">
                {score}/{rookieQuestions.length}
              </div>
              <div className="text-xl">
                Score: {percentage.toFixed(1)}%
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Assessment Result:</h3>
                <p className="text-lg">
                  {percentage >= 80 ? "Intermediate Level" : 
                   percentage >= 60 ? "Beginner-Intermediate Level" : 
                   "Beginner Level"}
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
        <h1 className="text-3xl font-bold text-center mb-2">Rookie Level Screening</h1>
        <p className="text-center text-muted-foreground">
          Question {currentQuestion + 1} of {rookieQuestions.length}
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
            {rookieQuestions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rookieQuestions[currentQuestion].options.map((option, index) => (
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
            <Clock className="mr-2 h-4 w-4" />
            Take your time to think about each answer
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
