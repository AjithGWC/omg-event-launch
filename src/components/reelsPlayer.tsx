'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

/* ================= TYPES ================= */

export type ReelData = {
  id: string;
  type: 'video' | 'youtube'; 
  url: string;
  title?: string;
  desc?: string;
};

interface ReelsPlayerProps {
  videos: ReelData[];
}

/* ================= REEL ITEM ================= */

const ReelItem = ({
  data,
  isActive,
}: {
  data: ReelData;
  isActive: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for viewport visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5, // Video must be at least 50% visible
        rootMargin: '0px 0px -10% 0px' // Trigger slightly before fully out of view
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto play/pause based on viewport visibility
  useEffect(() => {
    if (!videoRef.current) return;

    if (isVisible) {
      // Reset to beginning when becoming visible
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full snap-start overflow-hidden bg-black rounded-3xl">
      <video
        ref={videoRef}
        src={data.url}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      {/* Play Icon Overlay (visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-full">
            <Play size={48} className="text-white opacity-80 fill-white" />
          </div>
        </div>
      )}

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all border border-white/10"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Bottom Text Overlay */}
      {(data.title || data.desc) && (
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
          {data.title && <h3 className="font-bold text-xl mb-1">{data.title}</h3>}
          {data.desc && <p className="text-sm opacity-80">{data.desc}</p>}
        </div>
      )}
    </div>
  );
};

/* ================= REELS PLAYER ================= */

export const ReelsPlayer: React.FC<ReelsPlayerProps> = ({ videos }) => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {videos.map((video) => (
          <div key={video.id} className="w-full h-full snap-start">
            <ReelItem data={video} isActive={false} />
          </div>
        ))}
      </div>
    </div>
  );
};