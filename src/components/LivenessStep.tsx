import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';
import { CheckCircle2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { CameraFeed } from './CameraFeed';

interface LivenessStepProps {
  onComplete: () => void;
  onBack: () => void;
  progress: number;
}

const DIRECTIONS = [
  { label: 'Look Left', rotation: -30, dir: 'left' },
  { label: 'Look Right', rotation: 30, dir: 'right' },
  { label: 'Look Up', rotation: 0, dir: 'up', tiltY: -20 },
  { label: 'Look Down', rotation: 0, dir: 'down', tiltY: 20 },
];

const dirIcons: Record<string, typeof ChevronLeft> = {
  left: ChevronLeft,
  right: ChevronRight,
  up: ChevronUp,
  down: ChevronDown,
};

export function LivenessStep({ onComplete, onBack, progress }: LivenessStepProps) {
  const [dirIndex, setDirIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const currentDir = DIRECTIONS[dirIndex];

  const handleDetected = useCallback(() => {
    setCompleted((prev) => {
      const next = [...prev];
      next[dirIndex] = true;
      return next;
    });

    if (dirIndex < DIRECTIONS.length - 1) {
      setTimeout(() => setDirIndex((i) => i + 1), 600);
    } else {
      setIsProcessing(true);
      setTimeout(onComplete, 1200);
    }
  }, [dirIndex, onComplete]);

  useEffect(() => {
    const timer = setTimeout(handleDetected, 2000);
    return () => clearTimeout(timer);
  }, [dirIndex, handleDetected]);

  const DirIcon = dirIcons[currentDir.dir];
  const positionClass: Record<string, string> = {
    left: 'absolute -left-14 top-1/2 -translate-y-1/2',
    right: 'absolute -right-14 top-1/2 -translate-y-1/2',
    up: 'absolute top-[-3.5rem] left-1/2 -translate-x-1/2',
    down: 'absolute bottom-[-3.5rem] left-1/2 -translate-x-1/2',
  };
  const animateAxis: Record<string, { x?: number[]; y?: number[] }> = {
    left: { x: [0, -8, 0] },
    right: { x: [0, 8, 0] },
    up: { y: [0, -8, 0] },
    down: { y: [0, 8, 0] },
  };

  return (
    <StepLayout
      title="Liveness Check"
      subtitle="Follow the on-screen directions slowly"
      stepNumber={1}
      progress={progress}
      onBack={onBack}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border-2 border-dashed border-pixl-cyan/30"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-5 rounded-full bg-pixl-cyan/10 blur-xl"
          />
          <div className="w-72 h-[22rem] rounded-[50%] border-2 border-pixl-cyan/50 bg-pixl-surface/30 backdrop-blur-sm relative overflow-hidden flex items-center justify-center">
            <CameraFeed className="absolute inset-0 w-full h-full object-cover" mirrored />
            <motion.div
              animate={{ y: [-170, 170, -170] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pixl-cyan/50 to-transparent z-10"
            />
          </div>
          <AnimatePresence mode="wait">
            {!isProcessing && (
              <motion.div
                key={currentDir.dir}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={positionClass[currentDir.dir]}
              >
                <motion.div
                  animate={animateAxis[currentDir.dir]}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-11 h-11 rounded-full bg-pixl-cyan/20 border border-pixl-cyan/40 flex items-center justify-center"
                >
                  <DirIcon size={22} className="text-pixl-cyan" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.div
              key={dirIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="text-center mb-6"
            >
              <p className="text-xl font-semibold text-white mb-1">{currentDir.label}</p>
              <p className="text-xs text-pixl-muted">Move your head slowly</p>
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center mb-6">
              <CheckCircle2 className="text-pixl-success mx-auto mb-2" size={32} />
              <p className="text-lg font-semibold text-pixl-success">Liveness Confirmed</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3">
          {DIRECTIONS.map((d, i) => (
            <motion.div
              key={d.label}
              animate={{ scale: i === dirIndex && !isProcessing ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.8, repeat: i === dirIndex && !isProcessing ? Infinity : 0 }}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${completed[i] ? 'bg-pixl-success' : i === dirIndex ? 'bg-pixl-cyan' : 'bg-pixl-surface border border-white/10'}`}
            />
          ))}
        </div>
      </div>
    </StepLayout>
  );
}
