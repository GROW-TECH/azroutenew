// app/components/CertificatesPage.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FiX, FiAward, FiChevronRight, FiChevronLeft } from "react-icons/fi";

export default function CertificatesPage() {
  const [modalSrc, setModalSrc] = useState("");
  const [currentCertificateIndex, setCurrentCertificateIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const certificates = [
    "/images/balkishan_profile.jpeg",
    "/images/jayashree.jpg",
    "/certificates/1.jpeg",
    "/certificates/2.jpeg",
    "/certificates/3.jpeg",
    "/certificates/4.jpeg",
    "/certificates/5.jpeg",
    "/certificates/6.jpeg",
    "/certificates/7.jpeg",
  ];

  // duplicate twice for smooth infinite scroll
  const scrollList = [...certificates, ...certificates, ...certificates];

  const handleNextCertificate = () => {
    setCurrentCertificateIndex((prev) => (prev + 1) % certificates.length);
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // width of card + gap
      const newPosition =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-3 md:px-6 py-12 w-full overflow-hidden">
      {/* HEADER */}
      <header className="mb-6 text-center">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold inline-flex items-center gap-3">
          <FiAward size={24} />
          Students Certificates & Achievement Certificates
        </h2>
      </header>

      {/* AUTO SCROLL WITH NAVIGATION */}
      <div className="relative w-full">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all hover:scale-110"
          aria-label="Previous certificates"
        >
          <FiChevronLeft size={24} className="text-gray-700" />
        </button>

        {/* SCROLLABLE CONTAINER */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div className="flex gap-4 py-4 animate-scroll w-max px-12">
            {scrollList.map((src, i) => (
              <button
                key={`${src}-${i}`}
                onClick={() => setModalSrc(src)}
                className="flex-shrink-0 w-[180px] h-[130px] sm:w-[260px] sm:h-[190px] md:w-[320px] md:h-[220px] bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition"
              >
                <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                  <div className="relative w-full h-full p-2 sm:p-3">
                    <Image
                      src={src}
                      alt={`Certificate ${i + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* NEXT BUTTON */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all hover:scale-110"
          aria-label="Next certificates"
        >
          <FiChevronRight size={24} className="text-gray-700" />
        </button>
      </div>

    

      {/* MODAL */}
      {modalSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModalSrc("")}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalSrc("")}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-100"
            >
              <FiX size={18} />
            </button>

            <div className="relative w-full h-[70vh] bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={modalSrc}
                alt="Certificate"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 45s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}