import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Tags,
  FolderGit2,
  History,
  Award,
  Inbox,
  Link2,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

const DashboardHome = lazy(() => import('@/components/admin/editors/DashboardHome'));
const HeroEditor = lazy(() => import('@/components/admin/editors/HeroEditor'));
const AboutEditor = lazy(() => import('@/components/admin/editors/AboutEditor'));
const SkillsEditor = lazy(() => import('@/components/admin/editors/SkillsEditor'));
const ProjectsEditor = lazy(() => import('@/components/admin/editors/ProjectsEditor'));
const ExperienceEditor = lazy(() => import('@/components/admin/editors/ExperienceEditor'));
const CertificatesEditor = lazy(() => import('@/components/admin/editors/CertificatesEditor'));
const MessagesInbox = lazy(() => import('@/components/admin/editors/MessagesInbox'));
const FooterEditor = lazy(() => import('@/components/admin/editors/FooterEditor'));

const NAV = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/dashboard/hero', label: 'Hero', icon: User },
  { to: '/admin/dashboard/about', label: 'About', icon: FileText },
  { to: '/admin/dashboard/skills', label: 'Skills', icon: Tags },
  { to: '/admin/dashboard/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/admin/dashboard/experience', label: 'Experience', icon: History },
  { to: '/admin/dashboard/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/dashboard/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/dashboard/footer', label: 'Footer', icon: Link2 },
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast('Signed out.', 'info');
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen bg-ink-950 text-slate-200">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/5 bg-ink-900/60 backdrop-blur-sm md:flex">
        <SidebarContent onSignOut={handleSignOut} email={user?.email ?? ''} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/5 bg-ink-900/90 px-4 py-3 backdrop-blur-md md:hidden">
        <span className="font-mono text-sm font-bold text-white">&lt;/&gt; admin</span>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="text-slate-400 hover:text-cyan-300"
            aria-label="View site"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button onClick={handleSignOut} className="text-slate-400 hover:text-fuchsia-400">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav scroll strip */}
      <nav className="fixed inset-x-0 top-14 z-20 flex gap-2 overflow-x-auto border-b border-white/5 bg-ink-900/90 px-3 py-2 no-scrollbar md:hidden">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs ${
                isActive ? 'bg-cyan-glow/15 text-cyan-300' : 'text-slate-400'
              }`
            }
          >
            <n.icon className="h-3.5 w-3.5" />
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-4xl px-4 pb-20 pt-32 md:px-10 md:pt-10">
          <Suspense
            fallback={
              <div className="grid h-40 place-items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              </div>
            }
          >
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="hero" element={<HeroEditor />} />
              <Route path="about" element={<AboutEditor />} />
              <Route path="skills" element={<SkillsEditor />} />
              <Route path="projects" element={<ProjectsEditor />} />
              <Route path="experience" element={<ExperienceEditor />} />
              <Route path="certificates" element={<CertificatesEditor />} />
              <Route path="messages" element={<MessagesInbox />} />
              <Route path="footer" element={<FooterEditor />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ onSignOut, email }: { onSignOut: () => void; email: string }) {
  return (
    <>
      <div className="border-b border-white/5 px-5 py-5">
        <span className="font-mono text-sm font-bold text-white">&lt;/&gt; admin</span>
        <p className="mt-1 truncate text-xs text-slate-500">{email || 'Signed in'}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-cyan-glow/10 text-cyan-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/5 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </a>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-fuchsia-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );
}
