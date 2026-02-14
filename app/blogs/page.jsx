"use client";

import Image from "next/image";

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-[#e7e7e7] py-10 px-6 flex flex-col items-center gap-12">

      {/* ================= SECTION 1 ================= */}
      <section className="w-full max-w-5xl bg-[#d9d9d9] rounded-md p-10 md:p-14">
        
        {/* Title */}
        <h1 className="text-center text-3xl md:text-4xl font-extrabold tracking-wide mb-10">
          REDEFINING SUCCESS!
        </h1>

        {/* Content Row */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          {/* Left Image */}
          <div className="shrink-0 flex justify-center md:justify-start">
            <Image
              src="/img1.png"
              alt="Chess Knight"
              width={140}
              height={140}
              className="w-[120px] md:w-[140px] h-auto"
              priority
            />
          </div>

          {/* Right Text */}
          <p className="text-[16px] md:text-[18px] leading-7 text-[#1b1b1b] text-justify">
            Chess, an enduring game of tactics, intellect, and creativity, has captivated
            enthusiasts for centuries. Celebrated not only as a sport but also as an art form,
            it provides players with a unique medium to express their individuality. The 64
            squares represent a universe of infinite possibilities, where passion and
            imagination meet. Yet, in recent years, a subtle but significant shift has occurred:
            the intrinsic love of chess is increasingly giving way to a success-driven mindset.
            This raises an important question: is the soul of chess being overshadowed by the
            relentless pursuit of achievement?
          </p>
        </div>

      </section>

      {/* ================= SECTION 2 ================= */}
     {/* ================= SECTION 2 ================= */}
<section className="w-full max-w-5xl bg-[#d9d9d9] rounded-md p-10 md:p-14">

  {/* Title */}
  <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-8">
    The Joy of Pure Play
  </h2>

  {/* Content Row */}
  <div className="flex flex-col md:flex-row gap-10 items-start">

    {/* LEFT TEXT */}
    <div className="md:w-2/3">
      <p className="text-[15px] leading-7 text-[#1b1b1b] text-justify">
        Throughout history, chess has been a pursuit of curiosity and delight,
        profoundly shaped by the Romantic Era. This period celebrated bold
        sacrifices and daring attacks, emphasizing creativity and imagination
        over purely strategic play. It was a time when players sought beauty on
        the board, weaving games that were as much works of art as they were
        contests of skill.
      </p>
    </div>

    {/* RIGHT IMAGE */}
    <div className="md:w-1/3 flex justify-end">
      <img
        src="/img2.png"
        alt="Joy Image"
        className="w-[200px] object-contain"
      />
    </div>

  </div>

</section>



{/* ================= SECTION 3 ================= */}
<section className="w-full max-w-5xl bg-[#d9d9d9] rounded-md p-10 md:p-14">

  {/* Title */}
  <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-10">
    The Rise of the Success-Oriented Approach
  </h2>

  {/* Top Row */}
  <div className="flex flex-col md:flex-row gap-10 items-start">

    {/* LEFT IMAGE */}
    <div className="md:w-1/3 flex justify-start">
      <img
  src="/img3.png"
  alt="Rise Image"
  className="w-[420px] md:w-[380px] object-contain"
/>

    </div>

    {/* RIGHT TEXT */}
    <div className="md:w-2/3">
      <p className="text-[15px] leading-7 text-[#1b1b1b] text-justify">
        In today’s fast-paced world, the narrative has changed. Chess is increasingly
        viewed through the lens of measurable outcomes: ratings, titles, trophies,
        and rankings. This shift has profound psychological effects, particularly
        on younger players, who may feel immense pressure to achieve tangible
        milestones at the cost of enjoying the game itself.

        <br /><br />

        This mindset is not without merit. Competition drives excellence, and
        success can be deeply fulfilling. Yet, when success becomes the sole focus,
        the essence of chess risks being lost. The pressure to win at all costs can
        stifle creativity and reduce the game to a mechanical exercise.
      </p>
    </div>

  </div>


</section>

{/* ================= SECTION 4 ================= */}
{/* ================= SECTION 4 ================= */}
<section className="w-full max-w-5xl bg-[#d9d9d9] rounded-md p-10 md:p-14">

  {/* Title */}
  <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-10">
    The Role of Modern Training Methods
  </h2>

  {/* Content Row */}
  <div className="flex flex-col md:flex-row gap-10 items-start">

    {/* LEFT TEXT */}
    <div className="md:w-2/3">
      <p className="text-[16px] leading-8 text-[#1b1b1b] text-justify">
        Advancements in technology have revolutionized chess training. Chess computers
        and databases have become indispensable tools for players at all levels.
        While these resources have raised the overall standard of play, they have
        also contributed to the shift in mindset. The joy of discovery—once found
        in delving into books or experimenting on the board—is now often replaced
        by the efficiency of computer-assisted preparation. Players are rewarded
        for memorization and precision rather than originality and imagination.
      </p>
    </div>

    {/* RIGHT IMAGE */}
    <div className="md:w-1/3 flex justify-end">
      <img
        src="/img9.png"
        alt="Training Icon"
        className="w-[220px] md:w-[260px] object-contain"
      />
    </div>

  </div>

</section>
{/* ================= SECTION 5 ================= */}
   <section className="w-full max-w-5xl bg-[#d9d9d9] rounded-md p-10 md:p-14">
  <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-10">
    A Harmonious Approach
  </h2>

  <div className="flex flex-col md:flex-row gap-12 items-start">

    {/* LEFT IMAGE */}
    <div className="md:w-1/3 flex justify-start">
      <img
        src="/img4.png"
        alt="Balance Icon"
       className="w-[320px] md:w-[380px] object-contain"
      />
    </div>

    {/* RIGHT TEXT */}
    <div className="md:w-2/3">
      <p className="text-[16px] leading-8 text-[#1b1b1b] text-justify mb-6">
Does this mean that the love of chess is doomed to fade, or can a balance be struck
between competitive ambition and the intrinsic joy of the game? Not necessarily.
The key lies in finding a balance between pursuing success and preserving the
passion that makes chess special. Here are a few ways to strike that balance: 
      </p>

      <ul className="list-decimal pl-6 space-y-3 text-[16px] leading-7 text-[#1b1b1b]">
        <li>
          Celebrate Creativity – Encourage unconventional ideas and beauty in play.
        </li>
        <li>
          Redefine Success – Growth and learning matter more than winning.
        </li>
        <li>
          Foster Community – Chess is a shared experience, not just competition.
        </li>
        <li>
          Embrace Playfulness – Keep the joy alive through experimentation.
        </li>
      </ul>
    </div>

  </div>

  {/* BOTTOM CENTER IMAGE */}
  
</section>


    </main>
  );
}