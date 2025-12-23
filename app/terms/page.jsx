// app/terms/page.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Terms and Conditions – Azroute Chess Institute
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">1. Platform Usage</h2>
              <p className="text-gray-600">
                By accessing or using Azroute Chess Institute (azroutechess.com), you agree
                to follow these Terms and Conditions. Our platform provides online and
                offline chess coaching, course access, training programs, tournaments,
                and booking services.
              </p>
            </section>

            {/* 2 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">2. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide accurate registration information</li>
                <li>Maintain the confidentiality of login credentials</li>
                <li>Use the platform for genuine learning and coaching purposes</li>
                <li>Respect all students, coaches, and community guidelines</li>
                <li>Not misuse or distribute paid course material</li>
              </ul>
            </section>

            {/* 3 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">3. Data Protection & Privacy</h2>
              <p className="text-gray-600">Azroute Chess Institute follows standard GDPR principles:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Transparency and lawful data processing</li>
                <li>Collection of only necessary information</li>
                <li>Secure storage of personal data</li>
                <li>No sharing of personal data without user consent</li>
                <li>Right to access, modify, or request deletion of your data</li>
              </ul>
            </section>

            {/* 4 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">4. Course & Coaching Bookings</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Course or class bookings are confirmed after payment</li>
                <li>Each program has its own refund & rescheduling policy</li>
                <li>Azroute reserves the right to modify, postpone, or cancel classes</li>
                <li>Refunds, if applicable, follow the institute’s refund guidelines</li>
              </ul>
            </section>

            {/* 5 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">5. Intellectual Property</h2>
              <p className="text-gray-600">
                All course videos, study materials, lectures, content, graphics and
                branding on Azroute Chess Institute are copyrighted. Users may not copy,
                distribute, record, or share any material without written permission.
              </p>
            </section>

            {/* 6 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">6. Platform Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Secure user authentication</li>
                <li>Encrypted payment processing</li>
                <li>Regular backups for safety</li>
                <li>Monitoring to detect unauthorized access</li>
              </ul>
            </section>

            {/* 7 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                Azroute Chess Institute provides services on an “as available” basis. We
                do not guarantee uninterrupted platform access and are not responsible for
                indirect or consequential losses (e.g., internet issues, third-party
                service failures, etc.).
              </p>
            </section>

            {/* 8 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">8. Updates to Terms</h2>
              <p className="text-gray-600">
                Azroute may update these Terms periodically. Users will be notified of
                significant changes through email or platform notifications.
              </p>
            </section>

            {/* 9 */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">9. Contact Information</h2>
              <p className="text-gray-600">
                For questions related to our Terms & Conditions:<br />
                Email: support@azroutechess.com<br />
                Website: azroutechess.com
              </p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
