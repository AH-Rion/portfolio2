import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import type { Experience } from '@/lib/types';
import { SectionHeading } from '@/components/Reveal';

export default function ExperienceSection({ items }: { items: Experience[] }) {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading label="04 — Experience" title="My journey" />

      <div className="mt-12 relative">
        {/* vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-glow/60 via-white/10 to-electric-glow/60 sm:left-1/2" />

        <div className="space-y-10">
          {items.map((item, i) => {
            const isLeft = i % 2 === 0;
            const isEducation = /university|school|b\.s\.|b\.a\.|b\.tech|m\.s\.|degree|student/i.test(
              `${item.title} ${item.organization ?? ''}`
            );
            const Icon = isEducation ? GraduationCap : Briefcase;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-start gap-6 sm:gap-0 ${
                  isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* node */}
                <div className="absolute left-4 top-1 z-10 -translate-x-1/2 sm:left-1/2">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-glow/40 bg-ink-900 shadow-glow-cyan">
                    <Icon className="h-4 w-4 text-cyan-300" />
                  </span>
                </div>

                {/* card */}
                <div className={`ml-12 w-full sm:ml-0 sm:w-1/2 ${isLeft ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-cyan-glow/30">
                    <div className={`flex items-center gap-2 ${isLeft ? 'sm:justify-end' : ''}`}>
                      <Icon className="h-4 w-4 text-cyan-400" />
                      <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                        {item.start_date}
                        {item.end_date ? ` — ${item.end_date}` : ''}
                      </span>
                    </div>
                    <h3 className="mt-2 font-mono text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    {item.organization && (
                      <p className="text-sm text-slate-400">{item.organization}</p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {/* spacer for the other half on desktop */}
                <div className="hidden sm:block sm:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {items.length === 0 && (
        <p className="mt-12 text-slate-500">Experience entries will appear here once added.</p>
      )}
    </section>
  );
}
