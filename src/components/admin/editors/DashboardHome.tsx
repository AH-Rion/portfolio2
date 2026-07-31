import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Tags, Inbox, History, Award } from 'lucide-react';
import type { Project, Skill, ContactMessage, Experience, Certificate } from '@/lib/types';
import {
  fetchProjects,
  fetchSkills,
  fetchMessages,
  fetchExperience,
  fetchCertificates,
} from '@/lib/queries';

export default function DashboardHome() {
  const [counts, setCounts] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    experience: 0,
    certificates: 0,
    unread: 0,
  });

  useEffect(() => {
    Promise.all([fetchProjects(), fetchSkills(), fetchMessages(), fetchExperience(), fetchCertificates()])
      .then(([p, s, m, e, c]) =>
        setCounts({
          projects: p.length,
          skills: s.length,
          messages: m.length,
          unread: m.filter((msg) => !msg.read).length,
          experience: e.length,
          certificates: c.length,
        })
      )
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Projects', value: counts.projects, to: '/admin/dashboard/projects', icon: FolderGit2 },
    { label: 'Skills', value: counts.skills, to: '/admin/dashboard/skills', icon: Tags },
    { label: 'Experience', value: counts.experience, to: '/admin/dashboard/experience', icon: History },
    { label: 'Certificates', value: counts.certificates, to: '/admin/dashboard/certificates', icon: Award },
    { label: 'Messages', value: counts.messages, sub: `${counts.unread} unread`, to: '/admin/dashboard/messages', icon: Inbox },
  ];

  return (
    <div>
      <h1 className="font-mono text-2xl font-bold text-white">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Manage everything on your portfolio from here.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-cyan-glow/40"
          >
            <c.icon className="h-6 w-6 text-cyan-400" />
            <p className="mt-4 font-mono text-3xl font-bold text-white">{c.value}</p>
            <p className="text-sm text-slate-400">{c.label}</p>
            {c.sub && <p className="mt-1 text-xs text-fuchsia-400">{c.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="font-mono text-sm font-semibold text-white">Quick edit</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: 'Hero', to: '/admin/dashboard/hero' },
            { label: 'About', to: '/admin/dashboard/about' },
            { label: 'Certificates', to: '/admin/dashboard/certificates' },
            { label: 'Footer & socials', to: '/admin/dashboard/footer' },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-cyan-glow/40 hover:text-cyan-300"
            >
              {q.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
