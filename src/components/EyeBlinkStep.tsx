import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';
import { CheckCircle2, Eye } from 'lucide-react';
import { CameraFeed } from './CameraFeed';

interface EyeBlinkStepProps {
  onComplete: () => void;
  onBack: () => void;
  progress: number;
}

export function EyeBlinkStep({ onComplete, onBack, progress }: EyeBlinkStepProps) {
  const [blinks, setBlinks] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [done, setDone] = useState(false);
  const required = 3;

  useEffect(() => {
    if (blinks >= required) {
      setDone(true);
      setTimeout(onComplete, 1500);
      return;
    }
    const timer = setTimeout(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        setBlinks((b) => b + 1);
      }, 300);
    }, 1800);
    return () => clearTimeout(timer);
  }, [blinks, onComplete]);

  return (
    <StepLayout
      title="Eye Blink Detection"
      subtitle="Blink naturally 3 times while looking at the camera"
      stepNumber={6}
      progress={progress}
      onBack={onBack}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <motion.div
            animate={{
              boxShadow: done
                ? '0 0 0 4px rgba(0,230,118,0.3), 0 0 20px rgba(0,230,118,0.15)'
                : '0 0 0 4px rgba(0,212,255,0.2), 0 0 20px rgba(0,212,255,0.1)',
            }}
            className="w-72 h-[22rem] rounded-[50%] bg-pixl-surface/30 backdrop-blur-sm border border-pixl-cyan/30 relative overflow-hidden"
          >
            <CameraFeed className="absolute inset-0 w-full h-full object-cover" mirrored />
            {!done && (
              <motion.div
                animate={{ y: [-170, 170, -170] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pixl-cyan/40 to-transparent z-10"
              />
            )}
            <AnimatePresence>
              {isBlinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 bg-pixl-cyan/20 z-20"
                />
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence>
            {isBlinking && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-pixl-cyan/20 border border-pixl-cyan/40 flex items-center justify-center z-30"
              >
                <Eye size={16} className="text-pixl-cyan" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-4 mb-6">
          {[...Array(required)].map((_, i) => (
            <motion.div
              key={i}
              animate={i < blinks ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold border transition-colors duration-300 ${i < blinks ? 'bg-pixl-success/20 border-pixl-success/40 text-pixl-success' : 'bg-pixl-surface/40 border-white/5 text-pixl-muted'}`}
            >
              {i < blinks ? <CheckCircle2 size={20} /> : i + 1}
            </motion.div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key="counting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <p className="text-base font-semibold text-white mb-1">{blinks} of {required} blinks detected</p>
              <p className="text-xs text-pixl-muted">Keep looking at the camera</p>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <CheckCircle2 size={36} className="text-pixl-success mb-2" />
              <p className="text-lg font-semibold text-pixl-success">Blink Detection Complete</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepLayout>
  );
}
