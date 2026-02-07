'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const INITIAL_FORM_STATE = {
  studentName: '',
  parentName: '',
  dateOfBirth: '',
  gender: '',
  fideRating: '',
  location: '',
  email: '',
  phoneNumber: '',
  primaryGoal: '',
  convenientTime: '',
};

export default function StudentDetailsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.studentName.trim()) return 'Student Name is required';
    if (!formData.parentName.trim()) return 'Parent Name is required';
    if (!formData.dateOfBirth) return 'Date of Birth is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email address';
    if (!formData.phoneNumber.trim()) return 'Phone Number is required';
    if (!formData.primaryGoal.trim()) return 'Primary Goal is required';
    if (!formData.convenientTime.trim()) return 'Convenient Time is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // ✅ Save to Supabase and get inserted student id
      const { data, error: supabaseError } = await supabase
        .from('students')
        .insert([
          {
            student_name: formData.studentName,
            parent_name: formData.parentName,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            fide_rating: formData.fideRating,
            location: formData.location,
            email: formData.email,
            phone_number: formData.phoneNumber,
            primary_goal: formData.primaryGoal,
            convenient_time: formData.convenientTime,
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        console.error(supabaseError);
        setError('Failed to save data. Please try again.');
        setLoading(false);
        return;
      }

      // ✅ Save studentId and details in sessionStorage
      sessionStorage.setItem('studentId', data.id);
      sessionStorage.setItem('studentDetails', JSON.stringify(formData));
      router.push('/screening/chess-knowledge');

    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-center mb-2">Free Screening Session</h1>
        <p className="text-center text-muted-foreground">Step 1: Student Details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Please provide the following information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Student Name */}
            <div className="space-y-2">
              <Label htmlFor="studentName">
                Student Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => handleChange('studentName', e.target.value)}
                placeholder="Enter student's full name"
                required
              />
            </div>

            {/* Parent Name */}
            <div className="space-y-2">
              <Label htmlFor="parentName">
                Parent Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => handleChange('parentName', e.target.value)}
                placeholder="Enter parent's full name"
                required
              />
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* FIDE Rating */}
            <div className="space-y-2">
              <Label htmlFor="fideRating">
                FIDE Rating <span className="text-red-500">*</span>
              </Label>
              <select
                id="fideRating"
                value={formData.fideRating}
                onChange={(e) => handleChange('fideRating', e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Select FIDE Rating Status</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, State/Country"
                required
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  placeholder="Contact number"
                  required
                />
              </div>
            </div>

            {/* Primary Goal */}
            <div className="space-y-2">
              <Label htmlFor="primaryGoal">
                Primary Goal in Chess <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="primaryGoal"
                value={formData.primaryGoal}
                onChange={(e) => handleChange('primaryGoal', e.target.value)}
                placeholder="What do you want to achieve in chess?"
                className="w-full p-2 border border-input rounded-md bg-background min-h-[80px]"
                required
              />
            </div>

            {/* Convenient Time */}
            <div className="space-y-2">
              <Label htmlFor="convenientTime">
                Convenient Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="convenientTime"
                value={formData.convenientTime}
                onChange={(e) => handleChange('convenientTime', e.target.value)}
                placeholder="e.g., Weekdays after 6 PM, Weekends anytime"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Next Step'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
