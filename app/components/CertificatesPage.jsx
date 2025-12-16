// app/components/CertificatesPage.jsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { FiX, FiAward } from "react-icons/fi";

export default function CertificatesPage() {
  const [modalSrc, setModalSrc] = useState("");

  const certificates = [
    "/certificates/1.jpeg",
    "/certificates/2.jpeg",
    "/certificates/3.jpeg",
    "/certificates/4.jpeg",
    "/certificates/5.jpeg",
    "/certificates/6.jpeg",
    "/certificates/7.jpeg",
  ];

  return (
<section className="px-3 md:px-6 py-12 w-full">
      <header className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold inline-flex items-center gap-3">
          <FiAward size={26} /> Achievement Certificates
        </h2>
      </header>

      {/* Horizontal marquee-like scroll (fixed card size). cards use object-cover to fill frame */}
<div className="overflow-hidden w-full">
        <div className="flex gap-6 animate-scroll py-4">
          {certificates.concat(certificates).map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setModalSrc(src)}
              className="flex-shrink-0 w-[320px] h-[220px] bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
              aria-label={`Open certificate ${i + 1}`}>
              <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
                {/* object-cover ensures the card is fully filled (no black bars). */}
                <Image src={src} alt={`Certificate ${i + 1}`} fill className="object-cover" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal (no download) */}
      {modalSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModalSrc("")}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalSrc("")}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>

            <div className="relative w-full h-[70vh] bg-gray-50 rounded-md overflow-hidden">
              {/* Modal shows full image without crop */}
              <Image src={modalSrc} alt="Certificate" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* marquee animation. duplicate array makes continuous effect */
        .animate-scroll {
          display: flex;
          gap: 1.5rem;
          animation: scroll 22s linear infinite;
        }

        /* pause on hover for better UX */
        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* optional: hide scrollbar on supported browsers */
        .animate-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
