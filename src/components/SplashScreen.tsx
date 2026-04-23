import { motion } from 'framer-motion';
import { Shield, Fingerprint, ScanFace, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-pixl-navy relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pixl-cyan/20 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-pixl-blue/15 blur-[80px]"
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-pixl-cyan/30"
          initial={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 600 - 300,
            opacity: 0,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo with ring animation */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border border-pixl-cyan/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-8 rounded-full border border-dashed border-pixl-blue/10"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pixl-surface to-pixl-card border border-white/10 flex items-center justify-center shadow-2xl shadow-pixl-cyan/10"
          >
            <img
              src="https://pixl.ai/assets/images/pixl_logo_black%201%20(1).png"
              alt="Pixl.ai"
              className="w-16 h-16 object-contain brightness-0 invert"
            />
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Pixl<span className="text-pixl-cyan">.ai</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-pixl-muted text-sm mb-10"
        >
          Secure Identity Verification
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 mb-12"
        >
          {[
            { icon: ScanFace, label: 'Face ID' },
            { icon: Fingerprint, label: 'Biometric' },
            { icon: Shield, label: 'Secure' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1, type: 'spring' }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-pixl-surface/50 backdrop-blur-sm border border-white/5 text-xs text-pixl-muted"
            >
              <item.icon size={14} className="text-pixl-cyan" />
              {item.label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-pixl-blue to-pixl-cyan text-white font-semibold text-base shadow-lg shadow-pixl-cyan/20 flex items-center gap-2 overflow-hidden"
        >
          <span className="relative z-10">Begin Verification</span>
          <motion.span
            className="relative z-10"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight size={18} />
          </motion.span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pixl-cyan to-pixl-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.button>
      </motion.div>
    </div>
  );
}
