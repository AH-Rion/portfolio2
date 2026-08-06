import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface Props {
  loading: boolean;
  children: React.ReactNode;
}

/** Shows a branded loader while content loads, then fades content in. */
export default function Loader({ loading, children }: Props) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid min-h-[60vh] place-items-center"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
              loading
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
