"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ===== REUSABLE SECTION ===== */
function Section({ title, text, image, reverse }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {!reverse && (
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {text}
          </p>
        </div>
      )}

      <div className="relative w-full h-[320px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 hover:scale-105" 
        />
      </div>

      {reverse && (
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  const sliderRef = useRef(null);

  const experts = [
    {
      id: 1,
      name: "Vaibhav Singh Verma",
      role: "International FIDE rated chess player and trainer",
      image: "/images/experts/expert1.jpg",
    },
    {
      id: 2,
      name: "Karthiga A",
      role: "International FIDE rated chess player and trainer",
      image: "/images/experts/expert2.jpg",
    },
    {
      id: 3,
      name: "Vidya Shree",
      role: "Administrator and support service",
      image: "/images/experts/expert3.jpg",
    },
    {
      id: 4,
      name: "Jayashree P K",
      role: "Co-founder and mentor",
      image: "/images/experts/expert4.jpg",
    },
    {
      id: 5,
      name: "Balkishan A",
      role: "Co-founder and mentor",
      image: "/images/experts/expert5.jpg",
    },
    {
      id: 6,
      name: "Nithin Pal",
      role: "International FIDE rated chess player and trainer",
      image: "/images/experts/expert6.jpg",
    },
  ];

  const scroll = (dir) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: dir === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">

      {/* ===== HERO SECTION ===== */}
    

      {/* ===== ABOUT CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-28">

        <Section
          title="Our Team"
          text="The backbone of Azroute Chess Institute is our team of dedicated coaches and staff, who bring a wealth of experience and passion for teaching. Many of our coaches have competed at the highest levels, while others are educators who have devoted their careers to mentoring students. Each member of our team is carefully selected not only for their chess expertise but also for their ability to inspire and guide students through a supportive and encouraging approach. Whether working with beginners or advanced players, our team is committed to helping each student reach their unique goals."
          image="/about/team.jpg"
        />

        <Section
          title="Our Impact"
          text="Since our inception, Azroute Chess Institute has helped hundreds of players transform their understanding of chess, improve their strategic thinking, and gain confidence both on and off the board. Our institute is more than just a place to learn chess—it's a community where students of all ages and backgrounds can find a sense of belonging and personal development. We are proud of the impact we've made in the lives of our students. From young learners gaining foundational skills to adults rediscovering their passion for the game, the journey at Azroute Chess Institute is one of continuous growth and exploration."
          image="/about/impact.jpg"
          reverse
        />

        <Section
          title="Join Us"
          text="Azroute Chess Institute is more than just an educational platform; it's a place where chess becomes a part of your personal story. We invite you to join us, not just to learn the game but to experience the transformation that comes with mastering both chess and yourself."
          image="/about/join.jpg"
        />
      </div>

      {/* ===== EXPERTS SLIDER ===== */}
      <section className="bg-white py-20 border-t overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl lg:text-4xl font-bold mb-12 text-gray-900">
            Learn Chess from our Experts
          </h2>

          <div className="relative max-w-full">

            {/* LEFT ARROW */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* SLIDER CONTAINER WITH PROPER OVERFLOW CONTROL */}
            <div className="overflow-hidden mx-12">
              <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-4"
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {experts.map((expert) => (
                  <div
                    key={expert.id}
                    className="relative min-w-[280px] max-w-[280px] h-[380px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer flex-shrink-0"
                  >
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="font-bold text-white text-lg mb-1">
                        {expert.name}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {expert.role}
                      </p>
                    </div>

                    {/* BOTTOM INFO (ALWAYS VISIBLE) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 group-hover:opacity-0 transition-opacity duration-300">
                      <h3 className="font-semibold text-white text-base">
                        {expert.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT ARROW */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
    

      {/* Add this CSS to your global styles or in a style tag */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}