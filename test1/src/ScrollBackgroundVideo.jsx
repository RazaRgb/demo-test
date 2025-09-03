import React, { useRef, useEffect, useState } from "react";

const ScrollBackgroundVideo = ({ src, heightPerSecond = 100 }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("400vh"); // default scroll area height

  useEffect(() => {
    const video = videoRef.current;

    const onVideoLoaded = () => {
      if (video) setContainerHeight(`${video.duration * heightPerSecond}px`);
    };

    if (video) {
      if (video.readyState >= 1) {
        onVideoLoaded();
      } else {
        video.addEventListener("loadedmetadata", onVideoLoaded);
      }
    }

    return () => {
      if (video) video.removeEventListener("loadedmetadata", onVideoLoaded);
    };
  }, [heightPerSecond]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!videoRef.current || !containerRef.current) return;

      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (scrollY + viewportHeight > containerTop && scrollY < containerTop + containerHeight) {
        const scrollFraction = Math.min(Math.max((scrollY - containerTop) / containerHeight, 0), 1);
        const videoDuration = videoRef.current.duration || 0;
        let targetTime = scrollFraction * videoDuration;

        if (
          (videoRef.current.currentTime < targetTime && scrollY > lastScrollY) ||
          (videoRef.current.currentTime > targetTime && scrollY < lastScrollY)
        ) {
          videoRef.current.currentTime = targetTime;
        }
      }

      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ height: containerHeight, position: "relative" }}>
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
          pointerEvents: "none",
        }}
        src={src}
        preload="auto"
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          color: "white",
          padding: "2rem",
        }}
      >
        {/* Put foreground content here */}
        Scroll to control video playback while seeing this content over the video.
      </div>
    </div>
  );
};

export default ScrollBackgroundVideo;

