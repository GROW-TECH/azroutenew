"use client";

export default function GalleryPage() {
  const images = [
    "/gallery/31097002_azure1.jpg",
    "/gallery/16816131_azure2.jpg",
    "/gallery/25737276_azure3.jpg",
    "/gallery/63958629_azure4.jpg",
    "/gallery/30021708_azure5.jpg",
    "/gallery/88326660_slide2.jpg",
  ];

  const videos = [
    "/videos/Azure_4K.mp4",
    "/videos/ReelOne.mp4",
    "/videos/ReelTwo.mp4",
  ];

  return (
    <>
      <style jsx>{`
        .gallery-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        .single-gallery img {
          width: 100%;
          height: 275px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .video-section {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .video-container {
          width: 100%;
          max-width: 367px;
          height: 275px;
          position: relative;
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .play-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.7);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
        }

        @media screen and (max-width: 768px) {
          .video-container {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="container my-5">

        {/* IMAGE GALLERY */}
        <div className="row gallery-grid">
          {images.map((img, index) => (
            <div key={index} className="col-md-4 single-gallery">
              <a href={img} target="_blank" rel="noreferrer">
                <img src={img} alt={`Gallery Image ${index + 1}`} />
              </a>
            </div>
          ))}
        </div>

        {/* VIDEO SECTION */}
        <div className="video-section">
          {videos.map((video, index) => (
            <div key={index} className="video-container">
              <video controls>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button className="play-button"></button>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
