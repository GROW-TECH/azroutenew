"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ UI message
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info"); // success | error | info

  const emptyForm = {
    student_name: "",
    mobile: "",
    email: "",
    address: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [savedList, setSavedList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewStudent = () => {
    setForm(emptyForm);
    setSavedList([]);
    setStatusMsg("");
    setStatusType("info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    setStatusType("info");

    try {
      // ✅ 1) Save to Supabase
      const { data, error } = await supabase
        .from("contact_enquiries")
        .insert([form])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        setStatusMsg("❌ Error saving in database: " + error.message);
        setStatusType("error");
        return;
      }

      // ✅ UI update immediately after save
      setSavedList([data]);
      setForm(emptyForm);

      // ✅ 2) Send enquiry mail ONLY to AZRoute admin
      // IMPORTANT: this API should send TO = AZROUTE_ADMIN_EMAIL only
      // ReplyTo = student email
      const res = await fetch("/api/send-enquiry-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.student_name,
          email: data.email,
          phone: data.mobile,
          age: "-", // form-ல age field இல்லை; later add pannalaam
          location: data.address, // address-ஐ location ஆக use பண்றோம்
          message: "New enquiry from website contact form", // later add message field if needed
        }),
      });

      const raw = await res.text();
      let json = null;

      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {
        console.error("MAIL API returned NON-JSON:", raw);
        setStatusMsg(
          "✅ Saved. ❌ Email failed: API returned HTML/non-JSON. Check /api/send-enquiry-mail route."
        );
        setStatusType("error");
        return;
      }

      if (!res.ok || !json?.success) {
        setStatusMsg(
          "✅ Saved. ❌ Email failed: " +
            (json?.message || json?.error || `HTTP ${res.status}`)
        );
        setStatusType("error");
        return;
      }

      setStatusMsg("✅ Saved. ✅ Enquiry mail sent to AZRoute admin!");
      setStatusType("success");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Something went wrong: " + (err?.message || "Error"));
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const statusClass =
    statusType === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : statusType === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-gray-50 border-gray-200 text-gray-800";

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-12">
          Contact Azroute Chess Institute
        </h1>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-6 bg-gray-50 border rounded-xl p-8">
            <p className="text-gray-600">
              Be part of a dynamic team dedicated to excellence.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Location
              </h3>
              <p className="text-gray-600">
                Azroute Chess Institute,
                <br />
                Sathy Road, Amman Kovil,
                <br />
                Chitra Nagar, Saravanampatti,
                <br />
                Coimbatore – 641035
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Phone
              </h3>
              <p className="text-gray-600">
                +91 91503 41391 <br />
                +91 97406 44693
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Email
              </h3>
              <p className="text-gray-600">azroutechessinstitute@gmail.com</p>
            </div>

            {/* ✅ Status Message */}
            {statusMsg && (
              <div className={`border rounded-lg p-3 ${statusClass}`}>
                {statusMsg}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Student Contact
            </button>

            {/* FORM */}
            {showForm && (
              <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-semibold mb-3">
                  Student Contact Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    name="student_name"
                    placeholder="Student Name"
                    value={form.student_name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />

                  <input
                    name="mobile"
                    placeholder="Mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />

                  <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />

                  <textarea
                    name="address"
                    placeholder="Address / City / Area"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Student"}
                  </button>

                  <button
                    type="button"
                    onClick={handleNewStudent}
                    className="w-full border py-2 rounded"
                  >
                    New Student
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div className="w-full h-[420px] rounded-xl overflow-hidden border">
              <iframe
                title="Azroute Chess Institute Location"
                src="https://www.google.com/maps?q=Azroute%20Chess%20Institute%20Saravanampatti%20Coimbatore&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            {savedList.length > 0 && (
              <div className="border rounded-xl p-5 bg-green-50">
                <h3 className="font-semibold text-green-700 mb-3">
                  Saved Student Details
                </h3>

                {savedList.map((s) => (
                  <div key={s.id} className="border rounded p-3 bg-white">
                    <p>
                      <b>Name:</b> {s.student_name}
                    </p>
                    <p>
                      <b>Mobile:</b> {s.mobile}
                    </p>
                    <p>
                      <b>Email:</b> {s.email}
                    </p>
                    <p>
                      <b>Address:</b> {s.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.created_at ? new Date(s.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
