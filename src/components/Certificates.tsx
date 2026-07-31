import { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Building2, Hash } from 'lucide-react';
import type { Certificate } from '@/lib/types';
import { SectionHeading } from '@/components/Reveal';

const STAGGER = 0.09;

function CertificateCard({ certificate, index }: { certificate: Certificate; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * STAGGER, ease: [0.21, 0.6, 0.35, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors duration-300 hover:border-cyan-glow/40 hover:shadow-glow-cyan"
    >
      {/* glow bloom on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-cyan-glow/10 via-transparent to-electric-glow/10" />
      </div>

      <div className="relative flex items-start gap-4">
        {/* thumbnail / award placeholder */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
          {certificate.image_url ? (
            <img
              src={certificate.image_url}
              alt={certificate.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-700 to-ink-900">
              <Award className="h-9 w-9 text-cyan-glow/50" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-base font-bold leading-snug text-white transition-colors group-hover:text-cyan-300">
            {certificate.title}
          </h3>
          {certificate.organization && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
              <Building2 className="h-3.5 w-3.5 text-electric-glow/70" />
              {certificate.organization}
            </p>
          )}
          {certificate.issue_date && (
            <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              {certificate.issue_date}
            </p>
          )}
        </div>
      </div>

      {certificate.skills?.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-2">
          {certificate.skills.map((s) => (
            <span
              key={s}
              className="rounded border border-cyan-glow/20 bg-cyan-glow/5 px-2 py-0.5 font-mono text-[11px] text-cyan-300"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        {certificate.credential_id ? (
          <span className="flex items-center gap-1.5 truncate font-mono text-xs text-slate-500">
            <Hash className="h-3 w-3 shrink-0" />
            <span className="truncate">{certificate.credential_id}</span>
          </span>
        ) : (
          <span />
        )}
        {certificate.certificate_url && (
          <a
            href={certificate.certificate_url}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-glow/50 hover:text-cyan-300"
          >
            View Certificate
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

const MemoizedCard = memo(CertificateCard);

export default function Certificates({ items }: { items: Certificate[] }) {
  return (
    <section id="certificates" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading label="05 — Certificates" title="Credentials & certifications" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <MemoizedCard key={c.id} certificate={c} index={i} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-12 text-slate-500">Certificates will appear here once added.</p>
      )}
    </section>
  );
}
