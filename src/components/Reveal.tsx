import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Fade + slide in on scroll into view. */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.35, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  label,
  title,
  align = 'left',
}: {
  label: string;
  title: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
          {label}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 font-mono text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          className={`mt-4 h-px w-24 bg-gradient-to-r from-cyan-glow to-electric-glow ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        />
      </Reveal>
    </div>
  );
}
