import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import type { Project } from '@/lib/types';
import { SectionHeading } from '@/components/Reveal';

function isValidImageUrl(url: string | null | undefined): url is string {
  return !!url && typeof url === 'string' && /^https?:\/\//.test(url);
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const title = project?.title ?? 'Untitled';
  const techStack = Array.isArray(project?.tech_stack) ? project.tech_stack : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60 backdrop-blur-sm transition-colors hover:border-cyan-glow/40"
      >
        {/* glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-cyan-glow/10 to-electric-glow/10" />
        </div>

        {/* thumbnail */}
        <div className="relative aspect-video overflow-hidden border-b border-white/5">
          {isValidImageUrl(project?.image_url) ? (
            <img
              src={project.image_url}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-700 to-ink-900">
              <span className="font-mono text-5xl font-bold text-white/10">
                {title?.charAt(0) ?? 'P'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-800/80 to-transparent" />
        </div>

        {/* body */}
        <div className="relative flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-mono text-lg font-bold text-white transition-colors group-hover:text-cyan-300">
              {title}
            </h3>
            <div className="flex gap-2">
              {project?.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 transition-colors hover:text-cyan-300"
                  aria-label={`${title} GitHub`}
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {project?.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 transition-colors hover:text-cyan-300"
                  aria-label={`${title} live`}
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {project?.description && (
            <p className="text-sm leading-relaxed text-slate-400">{project.description}</p>
          )}

          {techStack.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="rounded border border-cyan-glow/20 bg-cyan-glow/5 px-2 py-0.5 font-mono text-[11px] text-cyan-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ProjectsProps {
  projects: Project[];
  loading?: boolean;
  error?: string | null;
}

export default function Projects({ projects, loading, error }: ProjectsProps) {
  const safe = Array.isArray(projects) ? projects : [];

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading label="03 — Projects" title="Selected work" />

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        </div>
      ) : error ? (
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-500">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {safe.map((p, i) => (
              <ProjectCard key={p.id ?? i} project={p} index={i} />
            ))}
          </div>

          {safe.length === 0 && (
            <p className="mt-12 text-slate-500">Projects will appear here once added.</p>
          )}
        </>
      )}
    </section>
  );
}
