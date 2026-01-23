"use client";
import { useState } from "react";
import Image from "next/image";
import { FiX, FiAward } from "react-icons/fi";

export default function ImagePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const images = [
    "/images/1.jpeg",
    "/images/2.jpeg",
    "/images/3.jpeg",
    "/images/4.jpeg",
    "/images/5.jpeg",
    "/images/6.jpeg",
    "/images/7.jpeg",
    "/images/8.jpeg",
    "/images/9.jpeg",
    "/images/10.jpeg",
    "/images/11.jpeg",
    "/images/12.jpeg",
    "/images/13.jpeg",
    "/images/14.jpeg",
    "/images/15.jpeg",
    "/images/16.jpeg",
    "/images/17.jpeg",
  ];

  // 🔁 duplicate for infinite scroll
  const scrollImages = [...images, ...images];

  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 py-12 overflow-hidden">
      <h2 className="text-2xl sm:text-4xl font-semibold text-center mb-8 text-gray-800 flex items-center justify-center gap-3">
        <FiAward size={28} /> Student&apos;s Achievements
      </h2>

      {/* IMAGE AUTO SCROLL */}
      <div className="overflow-hidden w-full">
        <div className="flex gap-4 animate-scroll w-max">
          {scrollImages.map((image, index) => (
            <div
              key={index}
              className="w-[160px] h-[160px] sm:w-64 sm:h-64 flex-shrink-0"
              onClick={() => openModal(image)}
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                width={256}
                height={256}
                className="object-cover rounded-lg h-full w-full shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <FiX size={24} />
            </button>
            <Image
              src={currentImage}
              alt="Modal Image"
              width={900}
              height={600}
              className="object-contain rounded-lg w-full h-[70vh]"
            />
          </div>
        </div>
      )}

      {/* AUTO SCROLL CSS (UNCHANGED METHOD, FIXED MATH) */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
