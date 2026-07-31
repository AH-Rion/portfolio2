import { Suspense, lazy, useEffect, useState } from 'react';
import type {
  HeroContent,
  AboutContent,
  FooterContent,
  Skill,
  Project,
  Experience,
  Certificate,
} from '@/lib/types';
import {
  fetchHero,
  fetchAbout,
  fetchFooter,
  fetchSkills,
  fetchProjects,
  fetchExperience,
  fetchCertificates,
} from '@/lib/queries';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import ExperienceSection from '@/components/Experience';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

const Scene3D = lazy(() => import('@/components/Scene3D'));

export default function PublicSite() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [footer, setFooter] = useState<FooterContent | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchHero(),
      fetchAbout(),
      fetchFooter(),
      fetchSkills(),
      fetchProjects(),
      fetchExperience(),
      fetchCertificates(),
    ])
      .then(([h, a, f, s, p, e, c]) => {
        if (!active) return;
        setHero(h);
        setAbout(a);
        setFooter(f);
        setSkills(s);
        setProjects(p);
        setExperience(e);
        setCertificates(c);
      })
      .catch(() => {
        /* swallow; sections render empty states */
      })
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-ink-950 text-slate-200">
      {/* fixed 3D + grid backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Suspense fallback={null}>
          <Scene3D variant="full" />
        </Suspense>
        <div className="absolute inset-0 bg-grid-faint bg-grid opacity-40" />
        <div className="absolute inset-0 bg-radial-faint" />
        {/* vignette so content stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/70 to-ink-950" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <Loader loading={!loaded}>
          <Hero hero={hero} />
          <About about={about} />
          <Skills skills={skills} />
          <Projects projects={projects} />
          <ExperienceSection items={experience} />
          <Certificates items={certificates} />
          <Contact />
          <Footer footer={footer} />
        </Loader>
      </main>
    </div>
  );
}
