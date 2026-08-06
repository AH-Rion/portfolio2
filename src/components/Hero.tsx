import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import type { HeroContent } from '@/lib/types';
import { useTypingEffect } from '@/lib/useTypingEffect';

export default function Hero({ hero }: { hero: HeroContent | null }) {
  const roles = hero?.roles?.length ? hero.roles : ['Software Engineer'];
  const typed = useTypingEffect(roles);

  return (
    <section id="top" className="relative min-h-screen w-full overflow-x-hidden">
      {/* 3D canvas sits behind content */}
      <div className="absolute inset-0 z-0">
        {/* Scene3D injected by parent for perf control */}
      </div>

      {/* glow blooms */}
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-cyan-glow/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-electric-glow/20 blur-[130px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-5 pt-24 sm:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Left: text */}
          <div className="order-2 text-center lg:order-none lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur-sm"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-glow" />
              available for opportunities
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-mono text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
            >
              {hero?.name ?? 'Your Name'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 flex items-center justify-center gap-2 font-mono text-lg text-slate-300 sm:text-2xl lg:justify-start"
            >
              <span className="text-cyan-400">&gt;</span>
              <span className="typing-caret text-cyan-300">{typed}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0"
            >
              {hero?.tagline ?? 'Your tagline appears here.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-3 lg:justify-start"
            >
              <a
                href="#projects"
                className="rounded-lg bg-gradient-to-r from-cyan-glow to-electric-glow px-6 py-3 font-mono text-sm font-semibold text-ink-950 transition-transform hover:scale-105 hover:shadow-glow-cyan"
              >
                View Work
              </a>
              <a
                href="#contact"
                className="rounded-lg border border-white/15 px-6 py-3 font-mono text-sm font-semibold text-white transition-colors hover:border-cyan-glow/50 hover:text-cyan-300"
              >
                Get in touch
              </a>
            </motion.div>

            {/* quick socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-4 lg:justify-start"
            >
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#contact"
                  className="text-slate-500 transition-colors hover:text-cyan-300"
                  aria-label="Social link"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: profile photo / avatar orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto order-1 aspect-square w-56 max-w-sm sm:w-64 md:w-72 lg:order-none lg:w-full"
          >
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-tr from-cyan-glow/30 to-electric-glow/30 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 shadow-glow-soft">
              {hero?.profile_image_url ? (
                <img
                  src={hero.profile_image_url}
                  alt={hero.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-800 to-ink-950">
                  <span className="font-mono text-7xl font-bold text-white/20">
                    {hero?.name?.charAt(0) ?? 'A'}
                  </span>
                </div>
              )}
            </div>
            {/* orbiting ring */}
            <div className="absolute inset-0 animate-spin [animation-duration:18s] rounded-full border border-dashed border-cyan-glow/20" />
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 transition-colors hover:text-cyan-300"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
