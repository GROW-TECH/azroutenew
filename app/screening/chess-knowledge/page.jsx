'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, Crown, Trophy } from 'lucide-react';


export default function ChessKnowledgePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Retrieve student data from sessionStorage
    const data = sessionStorage.getItem('studentDetails');
    if (!data) {
      router.push('/screening/student-details');
      return;
    }
    setStudentData(JSON.parse(data));
  }, [router]);

  const handleChessKnowledge = (knowsChess) => {
    setLoading(true);
    setError('');

    try {
      // Store chess knowledge in sessionStorage
      sessionStorage.setItem('chessKnowledge', knowsChess);
      
      // Navigate to appropriate screening
      if (knowsChess === 'yes') {
        router.push('/screening/rookie-level');
      } else {
        router.push('/screening/chess-basics');
      }
    } catch (err) {
      setError('Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !studentData) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/screening/student-details')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-center mb-2">Free Screening Session</h1>
        <p className="text-center text-muted-foreground">Step 2: Chess Knowledge Assessment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Do you know how to play chess?</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-6">
              This helps us understand your current chess level and provide the best screening experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={() => handleChessKnowledge('yes')}
              disabled={loading}
              className="h-24 p-6 flex flex-col items-center justify-center space-y-2 hover:bg-primary/90"
              variant="default"
            >
              <Trophy className="h-8 w-8" />
              <span className="text-lg font-semibold">Yes, I know how to play</span>
              <span className="text-sm opacity-80">Start with Rookie Level Screening</span>
            </Button>

            <Button
              onClick={() => handleChessKnowledge('no')}
              disabled={loading}
              className="h-24 p-6 flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <Crown className="h-8 w-8" />

              <span className="text-lg font-semibold">No, I'm new to chess</span>
              <span className="text-sm opacity-60">Start with Chess Basics Q&A</span>
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't worry - both paths will help us assess your chess potential!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
