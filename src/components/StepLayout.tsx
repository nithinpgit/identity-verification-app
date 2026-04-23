import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface StepLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  progress?: number;
  onBack?: () => void;
  showHeader?: boolean;
}

export function StepLayout({
  children,
  title,
  subtitle,
  stepNumber,
  totalSteps = 6,
  progress = 0,
  onBack,
  showHeader = true,
}: StepLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col bg-pixl-navy relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-pixl-cyan/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-pixl-blue/8 blur-[100px]" />
      </div>

      {showHeader && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 px-5 pt-5 pb-3"
        >
          <div className="flex items-center justify-between mb-4">
            {onBack ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-pixl-surface/60 backdrop-blur-sm border border-white/5 flex items-center justify-center text-pixl-muted hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </motion.button>
            ) : (
              <div className="w-10" />
            )}
            <img
              src="https://pixl.ai/assets/images/pixl_logo_black%201%20(1).png"
              alt="Pixl.ai"
              className="h-7 object-contain brightness-0 invert"
            />
            {stepNumber ? (
              <span className="text-xs text-pixl-muted font-medium">
                {stepNumber}/{totalSteps}
              </span>
            ) : (
              <div className="w-10" />
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-pixl-surface/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pixl-blue to-pixl-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      <div className="relative z-10 flex-1 flex flex-col px-5 pb-5 overflow-hidden">
        {(title || subtitle) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mt-4 mb-5"
          >
            {title && (
              <h2 className="text-2xl font-bold text-white mb-1.5">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-pixl-muted leading-relaxed max-w-xs mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </div>
  );
}
