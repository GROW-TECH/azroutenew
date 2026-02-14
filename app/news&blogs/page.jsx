"use client";

import React from "react";
import Link from "next/link";

export default function NewsBlogsPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-[#061a3a] to-[#04122a]">

      {/* NEWS BAR */}
      <div className="w-full bg-[#020d1f] overflow-hidden h-[36px] flex items-center">
        <div className="flex whitespace-nowrap animate-marquee text-sm text-white items-center">

          {/* Track 1 */}
          <div className="flex items-center gap-6 px-4">
            <span>Something that you have done successfully</span>
            <span className="opacity-60">||</span>
            <span>Sample news</span>
            <span className="opacity-60">||</span>
            <span>Sample 2</span>
            <span className="opacity-60">||</span>
            <span>
              Something that you have done successfully, especially through hard work or skill.
            </span>
          </div>

          {/* Track 2 */}
          <div className="flex items-center gap-6 px-4">
            <span>Something that you have done successfully</span>
            <span className="opacity-60">||</span>
            <span>Sample news</span>
            <span className="opacity-60">||</span>
            <span>Sample 2</span>
            <span className="opacity-60">||</span>
            <span>
              Something that you have done successfully, especially through hard work or skill.
            </span>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex justify-center items-center">
        <div className="flex gap-12 flex-wrap justify-center">

         {/* BLOGS (CLICKABLE) */}
<Link href="/blogs">
  <div className="w-[260px] h-[160px] bg-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
    <h2 className="text-lg font-semibold tracking-wide">BLOG&apos;S</h2>
  </div>
</Link>


          {/* INTERACTIVE */}
          <div className="w-[260px] h-[160px] bg-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
            <h2 className="text-lg font-semibold tracking-wide text-center">
              INTERACTIVE <br /> &amp; ENGAGING
            </h2>
          </div>

          {/* GALLERY (CLICKABLE) */}
          <Link href="/gallery">
            <div className="w-[260px] h-[160px] bg-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
              <h2 className="text-lg font-semibold tracking-wide">GALLERY</h2>
            </div>
          </Link>

        </div>
      </section>

    </main>
  );
}
