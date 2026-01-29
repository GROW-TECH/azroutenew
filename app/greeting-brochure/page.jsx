'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Trophy, Users, Star, BookOpen, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GreetingBrochurePage() {
  const router = useRouter();

  useEffect(() => {
    // Clear sessionStorage after opening brochure
    setTimeout(() => {
      sessionStorage.removeItem('studentDetails');
      sessionStorage.removeItem('chessKnowledge');
      sessionStorage.removeItem('screeningReport');
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary">Azroute Chess Institute</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to chess mastery starts here! We're excited to be part of your chess adventure.
          </p>
        </div>

        {/* Why Choose Azroute */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Why Choose Azroute?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Expert Coaches</h3>
                  <p className="text-sm text-gray-600">Learn from certified and experienced chess coaches who are passionate about teaching.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Personalized Learning</h3>
                  <p className="text-sm text-gray-600">Customized training programs based on your skill level and learning goals.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Structured Curriculum</h3>
                  <p className="text-sm text-gray-600">Comprehensive curriculum with regular progress reviews and assessments.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Target className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Tournament Preparation</h3>
                  <p className="text-sm text-gray-600">Special training for tournaments and competitive chess events.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Programs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Beginner Program</h3>
                <p className="text-sm text-gray-600">Perfect for those new to chess. Learn the fundamentals and basic strategies.</p>
              </div>
              
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Intermediate Program</h3>
                <p className="text-sm text-gray-600">For players who know the basics and want to improve their skills.</p>
              </div>
              
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Advanced Program</h3>
                <p className="text-sm text-gray-600">For experienced players looking to master advanced strategies.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                <p className="text-gray-700">Our team will contact you within 24 hours</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                <p className="text-gray-700">Personal consultation to discuss your goals</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                <p className="text-gray-700">Program recommendation based on your assessment</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                <p className="text-gray-700">Schedule your first class and begin your journey!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Have questions? We're here to help!
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Email: support@azroutechess.com</p>
              <p className="font-semibold">Phone: +91-XXXXXXXXXX</p>
              <p className="font-semibold">Website: www.azroutechess.com</p>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => router.push('/')}
                className="bg-primary hover:bg-primary/90"
              >
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 Azroute Chess Institute. All rights reserved.</p>
          <p className="mt-2">Empowering minds through the royal game of chess</p>
        </div>
      </div>
    </div>
  );
}
