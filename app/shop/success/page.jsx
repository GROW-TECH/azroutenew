"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function SuccessPage() {
  const params = useSearchParams();

  // Read Razorpay details from URL
  const razorpay_order_id = params.get("oid");
  const razorpay_payment_id = params.get("pid");
  const razorpay_signature = params.get("sig");
  const amount = params.get("amount");
  const name = params.get("name") || "Customer";

  // Optional → If you want student_id, pass it in URL
  const student_id = params.get("student_id") || null;

  useEffect(() => {
    async function storePayment() {
      // Stop if missing Razorpay info
      if (!razorpay_payment_id || !razorpay_order_id) return;

      // Prevent duplicate insert
      const { data: exists } = await supabase
        .from("payments")
        .select("id")
        .eq("razorpay_payment_id", razorpay_payment_id)
        .single();

      if (exists) {
        console.log("Payment already stored.");
        return;
      }

      // Insert payment into Supabase
      const { error } = await supabase.from("payments").insert({
        student_id: student_id ? Number(student_id) : null,
        method: "Razorpay",
        amount: Number(amount),
        status: "Paid",
        date: new Date().toISOString().slice(0, 10),

        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (error) {
        console.error("Supabase INSERT ERROR:", error);
      } else {
        console.log("Payment stored successfully in Supabase!");
      }
    }

    storePayment();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-7xl">✓</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-7">
          Thank you {name}! Your order has been completed successfully.
        </p>

        {/* Continue button */}
        <a
          href="/shop"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg transition-all block"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
