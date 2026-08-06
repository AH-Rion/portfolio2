import { motion } from 'framer-motion';
import type { Skill } from '@/lib/types';
import { SectionHeading } from '@/components/Reveal';

export default function Skills({ skills }: { skills: Skill[] }) {
  const categories = Array.from(
    skills.reduce<Map<string, Skill[]>>((map, s) => {
      const cat = s.category || 'Other';
      const arr = map.get(cat) ?? [];
      arr.push(s);
      map.set(cat, arr);
      return map;
    }, new Map()),
    ([cat, items]) => ({ cat, items })
  );

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading label="02 — Skills" title="Things I work with" />

      <div className="mt-12 space-y-10">
        {categories.map(({ cat, items }, ci) => (
          <div key={cat}>
            <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-cyan-400">
              {cat}
            </h3>
            <div className="flex flex-wrap gap-3">
              {items.map((s, i) => (
                <motion.span
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 18 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="cursor-default rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-slate-200 transition-colors hover:border-cyan-glow/40 hover:text-cyan-300 hover:shadow-glow-cyan"
                >
                  {s.name}
                </motion.span>
              ))}
            </div>
            {ci < categories.length - 1 && (
              <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-slate-500">Skills will appear here once added.</p>
        )}
      </div>
    </section>
  );
}
