'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, Trophy, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; // ✅ ADDED

export default function RookieLevelScreening() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setMounted(true);

    const data = sessionStorage.getItem('studentDetails');
    const chessKnowledge = sessionStorage.getItem('chessKnowledge');

    if (!data || chessKnowledge !== 'yes') {
      router.push('/screening/student-details');
      return;
    }

    loadQuestions();
  }, [router]);

  async function loadQuestions() {
    try {
      const res = await fetch('/api/chess-questions');
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid AI response');
      }

      setQuestions(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load AI questions');
      setLoading(false);
    }
  }

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    let newScore = score;
    if (answerIndex === questions[currentQuestion].correct) {
      newScore++;
      setScore(newScore);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      generateScreeningReport(newAnswers, newScore);
    }
  };

  // ✅ UPDATED: STORE FINAL SCORE IN SUPABASE
  const generateScreeningReport = async (finalAnswers, finalScore) => {
    const studentId = sessionStorage.getItem('studentId');
    const studentData = JSON.parse(sessionStorage.getItem('studentDetails'));

    const percentage = (finalScore / questions.length) * 100;

    let level, recommendation;
    if (percentage >= 80) {
      level = 'Intermediate';
      recommendation = 'Ready for intermediate training programs';
    } else if (percentage >= 60) {
      level = 'Beginner-Intermediate';
      recommendation = 'Start with beginner to intermediate courses';
    } else {
      level = 'Beginner';
      recommendation = 'Recommended to start with basic chess fundamentals';
    }

    // ✅ UPDATE SAME STUDENT ROW
    const { error } = await supabase
      .from('students')
      .update({
        screening_type: 'Rookie Level (AI)',
        score: finalScore,
        total_questions: questions.length,
        percentage: percentage,
        level: level,
        recommendation: recommendation,
      })
      .eq('id', studentId);

    if (error) {
      console.error('Failed to save screening result:', error);
    }

    const report = {
      studentName: studentData.studentName,
      screeningType: 'Rookie Level (AI)',
      score: finalScore,
      totalQuestions: questions.length,
      percentage: percentage.toFixed(1),
      level,
      recommendation,
      answers: finalAnswers,
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem('screeningReport', JSON.stringify(report));
  };

  const handleContinue = () => {
    router.push('/screening/report');
  };

  if (!mounted) return null;

  if (loading) {
    return <div className="text-center p-10">Loading AI questions...</div>;
  }

  if (!questions.length) {
    return <div className="text-center p-10">No questions available</div>;
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;

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
                {score}/{questions.length}
              </div>
              <div className="text-xl">
                Score: {percentage.toFixed(1)}%
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Assessment Result:</h3>
                <p className="text-lg">
                  {percentage >= 80
                    ? 'Intermediate Level'
                    : percentage >= 60
                    ? 'Beginner-Intermediate Level'
                    : 'Beginner Level'}
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

        <h1 className="text-3xl font-bold text-center mb-2">
          Rookie Level Screening
        </h1>
        <p className="text-center text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
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
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
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
