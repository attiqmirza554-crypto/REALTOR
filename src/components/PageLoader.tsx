import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F172A] text-white"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] p-1 shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center"
        >
          <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
            <Building2 className="w-10 h-10 text-[#D4AF37]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <h2 className="text-2xl font-serif tracking-widest text-[#D4AF37] uppercase font-semibold">
            Aura Haven
          </h2>
          <p className="text-xs text-slate-400 tracking-widest mt-1 uppercase font-mono">
            Luxury Real Estate & Private Estates
          </p>
        </motion.div>

        {/* Loading Progress Line */}
        <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}
