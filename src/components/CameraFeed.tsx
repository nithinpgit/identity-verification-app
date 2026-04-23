import { useEffect, useRef } from 'react';

interface CameraFeedProps {
  className?: string;
  mirrored?: boolean;
  facingMode?: 'user' | 'environment';
  onStreamReady?: (stream: MediaStream) => void;
}

export function CameraFeed({
  className = '',
  mirrored = true,
  facingMode = 'user',
  onStreamReady,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        onStreamReady?.(stream);
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [facingMode, onStreamReady]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={className}
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    />
  );
}
