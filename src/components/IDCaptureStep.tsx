import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';
import { CreditCard, Upload, ScanLine, CheckCircle2, BookOpen, Car } from 'lucide-react';
import { CameraFeed } from './CameraFeed';

interface IDCaptureStepProps {
  onComplete: () => void;
  onBack: () => void;
  progress: number;
}

export function IDCaptureStep({ onComplete, onBack, progress }: IDCaptureStepProps) {
  const [phase, setPhase] = useState<'select' | 'scanning' | 'done'>('select');
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    if (phase === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setPhase('done');
            setTimeout(onComplete, 1200);
            return 100;
          }
          return p + 4;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase, onComplete]);

  const docTypes = [
    { id: 'aadhaar', label: 'Aadhaar Card', Icon: CreditCard },
    { id: 'passport', label: 'Passport', Icon: BookOpen },
    { id: 'driving', label: "Driver's License", Icon: Car },
  ];

  const handleDocSelect = (docId: string) => {
    setSelectedDoc(docId);
    setTimeout(() => setPhase('scanning'), 400);
  };

  return (
    <StepLayout
      title="Identity Document"
      subtitle="Scan or upload your government-issued ID"
      stepNumber={3}
      progress={progress}
      onBack={onBack}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <div className="space-y-3 mb-6">
                {docTypes.map((doc, i) => (
                  <motion.button
                    key={doc.id}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDocSelect(doc.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-pixl-surface/40 backdrop-blur-sm border border-white/5 hover:border-pixl-cyan/30 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pixl-cyan/10 border border-pixl-cyan/20 flex items-center justify-center">
                      <doc.Icon size={20} className="text-pixl-cyan" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{doc.label}</p>
                      <p className="text-pixl-muted text-xs">Tap to scan</p>
                    </div>
                    <CreditCard size={16} className="text-pixl-muted" />
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-pixl-muted">or</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDocSelect('upload')}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-pixl-cyan/20 text-pixl-cyan text-sm font-medium hover:border-pixl-cyan/40 transition-colors"
              >
                <Upload size={16} />
                Upload Document
              </motion.button>
            </motion.div>
          )}
          {phase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-8">
                <div className="absolute -inset-4 pointer-events-none z-20">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-pixl-cyan rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-pixl-cyan rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-pixl-cyan rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-pixl-cyan rounded-br-xl" />
                </div>
                <div className="w-80 h-56 rounded-2xl bg-pixl-surface/40 backdrop-blur-sm border border-white/10 overflow-hidden relative">
                  <CameraFeed className="absolute inset-0 w-full h-full object-cover" facingMode="environment" mirrored={false} />
                  <motion.div
                    animate={{ y: [-110, 110, -110] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pixl-cyan/60 to-transparent shadow-[0_0_8px_rgba(0,212,255,0.4)] z-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <ScanLine size={16} className="text-pixl-cyan" />
                <p className="text-sm text-pixl-muted">
                  Scanning {selectedDoc === 'aadhaar' ? 'Aadhaar Card' : selectedDoc === 'passport' ? 'Passport' : 'Document'}...
                </p>
              </div>
              <div className="w-56 h-1.5 bg-pixl-surface rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-pixl-blue to-pixl-cyan rounded-full" style={{ width: `${scanProgress}%` }} />
              </div>
              <p className="text-xs text-pixl-muted mt-2">{scanProgress}%</p>
            </motion.div>
          )}
          {phase === 'done' && (
            <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <CheckCircle2 size={56} className="text-pixl-success mb-4" />
              </motion.div>
              <p className="text-lg font-semibold text-pixl-success">Document Captured</p>
              <p className="text-xs text-pixl-muted mt-1">Data extracted successfully</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepLayout>
  );
}
