import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Contact Azroute Chess Institute
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <Card className="p-6">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-md"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded-md"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="subject">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full p-2 border rounded-md"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Your message"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md 
                hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="p-6">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-6">
                Contact Information
              </h2>

              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">info@azroutechess.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+44 7923 104892</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Academy Address</p>
                    <p className="text-gray-600">
                      Azroute Chess Institute
                    </p>
                    <p className="text-gray-600">Salem</p>
                  </div>
                </div>

                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
