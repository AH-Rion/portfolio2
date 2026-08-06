import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { AboutContent } from '@/lib/types';
import { Reveal, SectionHeading } from '@/components/Reveal';

export default function About({ about }: { about: AboutContent | null }) {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading label="01 — About" title="Who I am" />

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Photo */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-glow/10 to-electric-glow/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {about?.about_image_url ? (
              <img
                src={about.about_image_url}
                alt="About"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-ink-800 to-ink-950">
                <Sparkles className="h-12 w-12 text-cyan-glow/40" />
              </div>
            )}
          </div>
        </Reveal>

        {/* Bio */}
        <div>
          <Reveal delay={0.1}>
            <p className="whitespace-pre-line text-lg leading-relaxed text-slate-300">
              {about?.bio ?? 'Your bio will appear here once you add it from the admin dashboard.'}
            </p>
          </Reveal>

          {about?.highlights?.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {about.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-glow shadow-glow-cyan" />
                  <span className="text-sm text-slate-200">{h}</span>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
