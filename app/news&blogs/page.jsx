"use client";

import React from "react";

export default function NewsBlogsPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-[#061a3a] to-[#04122a]">

      {/* NEWS MARQUEE – STICKS TO NAVBAR BOTTOM */}
      <div className="sticky top-[80px] z-40">
        <div className="w-full h-[36px] bg-[#020d1f] overflow-hidden flex items-center">
          <div className="flex whitespace-nowrap animate-marquee text-sm text-white">

            {/* TRACK 1 */}
            <div className="flex items-center gap-8 px-4">
              <span>sample news</span>
              <span className="opacity-60">||</span>
              <span>sample2</span>
              <span className="opacity-60">||</span>
              <span>
                something that you have done successfully, especially through hard work or skill.
              </span>
              <span className="opacity-60">||</span>
              <span>something that you have done successfully</span>
            </div>

            {/* TRACK 2 (duplicate) */}
            <div className="flex items-center gap-8 px-4">
              <span>sample news</span>
              <span className="opacity-60">||</span>
              <span>sample2</span>
              <span className="opacity-60">||</span>
              <span>
                something that you have done successfully, especially through hard work or skill.
              </span>
              <span className="opacity-60">||</span>
              <span>something that you have done successfully</span>
            </div>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-32 flex justify-center items-center">
        <div className="flex gap-12 flex-wrap justify-center">

          <div className="w-[260px] h-[160px] bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <h2 className="text-lg font-semibold tracking-wide">BLOG&apos;S</h2>
          </div>

          <div className="w-[260px] h-[160px] bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <h2 className="text-lg font-semibold tracking-wide text-center">
              INTERACTIVE <br /> & ENGAGING
            </h2>
          </div>

          <div className="w-[260px] h-[160px] bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <h2 className="text-lg font-semibold tracking-wide">GALLERY</h2>
          </div>

        </div>
      </section>

    </main>
  );
}
