import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Facebook, ExternalLink } from 'lucide-react';
import type { FooterContent, SocialLink } from '@/lib/types';

const ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  facebook: Facebook,
  email: Mail,
};

function SocialButton({ social }: { social: SocialLink }) {
  const Icon = ICONS[social.icon?.toLowerCase()] ?? ExternalLink;
  return (
    <motion.a
      href={social.url}
      target={social.url.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      whileHover={{ y: -4, scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-cyan-glow/50 hover:text-cyan-300 hover:shadow-glow-cyan"
      aria-label={social.label}
    >
      <Icon className="h-5 w-5" />
    </motion.a>
  );
}

export default function Footer({ footer }: { footer: FooterContent | null }) {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <a href="#top" className="font-mono text-sm font-bold text-white">
            &lt;/&gt; portfolio
          </a>

          {footer?.socials?.length ? (
            <div className="flex gap-3">
              {footer.socials.map((s, i) => (
                <SocialButton key={i} social={s} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <p className="text-sm text-slate-500">
            {footer?.text ?? `© ${new Date().getFullYear()} — All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
