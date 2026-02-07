'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, Download, Mail, MessageCircle, FileText, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default function ScreeningReportPage() {
    const saveScoreToSupabase = async (reportData) => {
    try {
      const studentId = sessionStorage.getItem('studentId');
      if (!studentId) return;

      const { error } = await supabase
        .from('students')
        .update({
          screening_type: reportData.screeningType,
          score: reportData.score,
          total_questions: reportData.totalQuestions,
          percentage: reportData.percentage,
          level: reportData.level,
          recommendation: reportData.recommendation,
        })
        .eq('id', studentId);

      if (error) throw error;

      console.log("Score saved to Supabase");
    } catch (err) {
      console.error("Supabase save error:", err.message);
    }
  };

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [notificationsSent, setNotificationsSent] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reportData = sessionStorage.getItem('screeningReport');
    const studentData = sessionStorage.getItem('studentDetails');
    
    if (!reportData || !studentData) {
      router.push('/screening/student-details');
      return;
    }
    
    const parsedReport = JSON.parse(reportData);
setReport(parsedReport);
saveScoreToSupabase(parsedReport);

  }, [router]);

  const sendNotifications = async () => {
  setLoading(true);
  setError('');

  try {
    const studentData = JSON.parse(sessionStorage.getItem('studentDetails'));

    // existing API (admin + whatsapp etc)
    await fetch('/api/screening/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentData,
        report,
        notifications: ['email', 'whatsapp', 'admin']
      })
    });

    // 🟢 ADD THIS BLOCK → send email to student
    await fetch('/api/send-student-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentEmail: studentData.email,
        studentName: studentData.studentName,
        report: report,
      }),
    });

    setNotificationsSent(true);
    setShowPopup(true);

  } catch (err) {
    setError('Failed to send notifications. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const downloadReport = () => {
    if (!report) return;
    
    const reportContent = `
AZROUTE CHESS INSTITUTE - SCREENING REPORT
==========================================

Student Name: ${report.studentName}
Screening Type: ${report.screeningType}
Date: ${new Date(report.completedAt).toLocaleDateString()}

RESULTS:
--------
Score: ${report.score}/${report.totalQuestions}
Percentage: ${report.percentage}%
Level: ${report.level}

RECOMMENDATION:
---------------
${report.recommendation}

ASSESSMENT DETAILS:
-------------------
This screening assessment helps us understand your current chess level and recommend the best training program for you.

NEXT STEPS:
-----------
1. Our team will contact you within 24 hours
2. Personal consultation to discuss your goals
3. Program recommendation based on your assessment
4. Schedule your first class

For questions, contact: support@azroutechess.com
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `azroute-screening-report-${report.studentName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const openGreetingBrochure = () => {
    // Open greeting brochure in new tab
    window.open('/greeting-brochure', '_blank');
  };

  const handleContinue = () => {
    setShowPopup(false);
    openGreetingBrochure();
  };

  if (!mounted || !report) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-center mb-2">Screening Report</h1>
        <p className="text-center text-muted-foreground">Step 3: Your Assessment Results</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {report.score}/{report.totalQuestions}
              </div>
              <div className="text-xl text-muted-foreground">
                {report.percentage}% Score
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Screening Type:</span>
                <span>{report.screeningType}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Assessed Level:</span>
                <span className="text-primary font-semibold">{report.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Date:</span>
                <span>{new Date(report.completedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm leading-relaxed">
                {report.recommendation}
              </p>
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Next Steps:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Personal consultation with our team</li>
                <li>• Customized program recommendation</li>
                <li>• Flexible scheduling options</li>
                <li>• Start your chess journey!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Complete Your Screening</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              onClick={downloadReport}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            
            <Button
              onClick={sendNotifications}
              disabled={loading || notificationsSent}
              className="w-full"
            >
              {loading ? 'Sending...' : notificationsSent ? 'Notifications Sent' : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Notifications
                </>
              )}
            </Button>
          </div>
          
          {notificationsSent && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Notifications sent successfully!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                WhatsApp, Email, and Admin notifications have been sent.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Thank You!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Our team will contact you further. Kindly mention your convenient time to contact.
              </p>
              <Button onClick={handleContinue} className="w-full">
                Continue to Greeting Brochure
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
