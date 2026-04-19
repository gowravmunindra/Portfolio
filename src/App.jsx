import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initialData } from './data';
import {
  Github, Linkedin, Mail, Twitter, GripVertical, Eye, EyeOff, Upload,
  Sun, Moon, X, Phone, ArrowRight, Layout,
  ArrowUpRight, Briefcase, Award, User, Code2, MessageSquare, Home,
  ChevronRight, Star, Zap, MousePointer2, ChevronLeft, ChevronRight as ChevronRightIcon,
  MapPin, Calendar, ExternalLink as LinkIcon, Check
} from 'lucide-react';

const ensureProtocol = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  return `https://${url}`;
};

const SECTION_NAMES = {
  hero: 'Home', about: 'About', experience: 'Experience',
  skills: 'Skills', projects: 'Projects', achievements: 'Awards', contact: 'Contact'
};

/* ─── Magnetic Button ────────────────────────────────────────────────────── */
const MagneticButton = ({ children, onClick, className = '' }) => {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    ref.current.style.transform = 'translate(0, 0)';
  };
  const handleMouseEnter = () => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 0.1s ease';
  };
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`magnetic-btn ${className}`}
    >
      {children}
    </button>
  );
};

/* ─── Section Badge ──────────────────────────────────────────────────────── */
const SectionBadge = ({ children }) => (
  <div className="section-badge mb-5">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
    {children}
  </div>
);

/* ─── Section Header ─────────────────────────────────────────────────────── */
const SectionHeader = ({ sectionObj, centered = true }) => (
  <div className={`mb-14 ${centered ? 'text-center' : ''}`}>
    <div className={centered ? 'flex justify-center' : ''}>
      <SectionBadge>{sectionObj.title}</SectionBadge>
    </div>
    <h2 className={`text-4xl md:text-5xl font-black mb-4 text-white stagger-item`}>{sectionObj.title}</h2>
    {sectionObj.desc && (
      <p className={`text-base text-slate-400 max-w-xl ${centered ? 'mx-auto' : ''} leading-relaxed stagger-item`} style={{ '--delay': '100ms' }}>
        {sectionObj.desc}
      </p>
    )}
  </div>
);

/* ─── Scroll Drag Indicator ──────────────────────────────────────────────── */
const ScrollDragIndicator = () => (
  <div className="flex flex-col items-center gap-3 pt-4 pb-2">
    <div className="scroll-drag-indicator">
      <div className="orbit-ring" />
      <div className="orbit-ring orbit-ring-2" />
      <div className="orbit-dot" />
    </div>
    <div className="drag-hint">
      <div className="drag-hint-arrow left" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">Drag to Explore</span>
      <div className="drag-hint-arrow" />
    </div>
  </div>
);

/* ─── Custom Cursor Hook ─────────────────────────────────────────────────── */
function useCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRef = useRef(null);
  const mouse = useRef({ x: -300, y: -300 });
  const ring = useRef({ x: -300, y: -300 });
  const trail = useRef({ x: -300, y: -300 });
  const rafId = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.documentElement.classList.add('custom-cursor');

    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) ringRef.current.style.transform = `translate(calc(${ring.current.x}px - 50%), calc(${ring.current.y}px - 50%))`;
      
      trail.current.x += (mouse.current.x - trail.current.x) * 0.06;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.06;
      if (trailRef.current) trailRef.current.style.transform = `translate(calc(${trail.current.x}px - 50%), calc(${trail.current.y}px - 50%))`;

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; if (dotRef.current) dotRef.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`; };
    window.addEventListener('mousemove', onMove);
    return () => { cancelAnimationFrame(rafId.current); window.removeEventListener('mousemove', onMove); };
  }, []);
  return { dotRef, ringRef, trailRef };
}

/* ─── Nav Progress Bar ───────────────────────────────────────────────────── */
function useNavProgress() {
  const barRef = useRef(null);
  const flash = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = 'none'; bar.style.width = '0%'; bar.style.opacity = '1';
    void bar.offsetWidth;
    bar.style.transition = 'width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease'; bar.style.width = '100%';
    setTimeout(() => { if (bar) bar.style.opacity = '0'; }, 600);
  }, []);
  return { barRef, flash };
}

function App() {
  const [data] = useState(initialData);
  const theme = 'dark';
  const [activeSection, setActiveSection] = useState('hero');
  const [activeSlides, setActiveSlides] = useState({});
  const { dotRef, ringRef, trailRef } = useCursor();
  const { barRef, flash } = useNavProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Trigger hero stagger immediately after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setHeroVisible(true));
    });

    const visObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && e.target.id) setActiveSection(e.target.id); });
    }, { rootMargin: '-48% 0px -48% 0px' });

    const enterObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });

    // Skip hero — it's handled by heroVisible state
    document.querySelectorAll('section[id]:not(#hero)').forEach(s => { s.classList.add('section-reveal'); visObs.observe(s); enterObs.observe(s); });
    // Still observe hero for activeSection tracking
    const heroEl = document.getElementById('hero');
    if (heroEl) visObs.observe(heroEl);
    return () => { visObs.disconnect(); enterObs.disconnect(); };
  }, []);

  useEffect(() => {
    const sliders = document.querySelectorAll('[id^="slider-"]');
    sliders.forEach(slider => {
      const secId = slider.id.replace('slider-', '');

      // Active slide detector
      const update = () => {
        const center = slider.scrollLeft + slider.clientWidth / 2;
        const slides = slider.querySelectorAll('.project-slide');
        let minDist = Infinity; let idx = 0;
        slides.forEach((s, i) => { const d = Math.abs(center - (s.offsetLeft + s.offsetWidth / 2)); if (d < minDist) { minDist = d; idx = i; } });
        setActiveSlides(p => p[secId] === idx ? p : { ...p, [secId]: idx });
      };
      slider.addEventListener('scroll', update, { passive: true });
      requestAnimationFrame(update);

      // Mouse drag-to-scroll
      let isDragging = false, startX = 0, scrollLeft = 0;
      const onMouseDown = (e) => { isDragging = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; slider.classList.add('dragging'); };
      const onMouseLeave = () => { isDragging = false; slider.classList.remove('dragging'); };
      const onMouseUp = () => { isDragging = false; slider.classList.remove('dragging'); };
      const onMouseMove = (e) => { if (!isDragging) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 1.5; slider.scrollLeft = scrollLeft - walk; };
      slider.addEventListener('mousedown', onMouseDown);
      slider.addEventListener('mouseleave', onMouseLeave);
      slider.addEventListener('mouseup', onMouseUp);
      slider.addEventListener('mousemove', onMouseMove);
    });
  }, []);

  const scrollTo = id => { flash(); setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 80); };

  const renderHero = () => (
    <section className={`hero-section pt-28 pb-24 relative overflow-hidden${heroVisible ? ' visible' : ''}`} id="hero">
      <div className="hero-mesh"><div className="mesh-1" /><div className="mesh-2" /><div className="mesh-3" /></div>
      <div className="hero-grid" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        {data.hero.greeting && <div className="section-badge mb-8 stagger-item" style={{ '--delay': '0ms' }}><Zap size={12} className="text-emerald-500 animate-pulse" />{data.hero.greeting}</div>}
        <h1 className="text-6xl sm:text-7xl xl:text-8xl font-black mb-6 leading-[1.05] stagger-item" style={{ '--delay': '100ms' }}>
          <span className="block text-slate-400 text-2xl sm:text-3xl xl:text-4xl mb-3 font-medium">Hello, I'm</span>
          <span className="text-premium-gradient">{data.hero.name} {data.hero.lastName}</span>
        </h1>
        <p className="text-lg md:text-xl font-medium text-slate-400 mb-12 max-w-xl mx-auto stagger-item" style={{ '--delay': '200ms' }}>
          {data.hero.rolePrefix} <span className="text-white font-bold">{data.hero.role}</span> {data.hero.roleSuffix}
        </p>
        <div className="flex flex-wrap gap-4 justify-center stagger-item" style={{ '--delay': '300ms' }}>
          <MagneticButton onClick={() => scrollTo('FrontendProjects')}>
            <span className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 8px 30px -6px rgba(5,150,105,0.5)' }}>
              {data.hero.ctaPrimary || 'View Work'} <ArrowRight size={16} />
            </span>
          </MagneticButton>
          <MagneticButton onClick={() => scrollTo('contact')}>
            <span className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
              {data.hero.ctaSecondary || 'Contact'}
            </span>
          </MagneticButton>
        </div>
        <div className="mt-20 stagger-item" style={{ '--delay': '450ms' }}><ScrollDragIndicator /></div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section className="py-28 scroll-mt-20" id="about">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14"><div className="flex justify-center"><SectionBadge>{data.about.title || 'About Me'}</SectionBadge></div><h2 className="text-4xl md:text-5xl font-black text-white stagger-item">{data.about.title}</h2></div>
        <div className="about-premium-card stagger-item">
          <div className="top-accent" />
          <div className="p-10 md:p-14 flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-shrink-0 flex flex-col items-center gap-6 lg:w-48">
              <div className="relative"><div className="w-28 h-28 rounded-3xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-5xl font-black text-emerald-500">{data.hero.name?.[0]}</div><div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center"><Check size={14} className="text-white" /></div></div>
              <div className="grid grid-cols-2 gap-3 w-full lg:grid-cols-1">
                <div className="about-stat-card"><span className="text-2xl font-black text-emerald-400">1</span><span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Year</span></div>
                <div className="about-stat-card"><span className="text-2xl font-black text-emerald-400">5+</span><span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Projects</span></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-5xl font-black text-emerald-500/10 mb-2 leading-none">"</div>
              <div className="space-y-6 text-lg md:text-xl text-slate-300 leading-relaxed italic">{data.about.bio.split('. ').filter(s => s.trim()).map((s, i) => <p key={i}>{s.endsWith('.') ? s : `${s}.`}</p>)}</div>
              <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap gap-3">
                {['MERN Stack', 'React.js', 'UI/UX Design', 'Freelancer', 'Clean Code'].map(t => <span key={t} className="px-5 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-500/80">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSkills = (item = { id: 'skills' }) => {
    const sd = data[item.id];
    return (
      <section className="py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeader sectionObj={sd} />
          <div className="flex flex-wrap justify-center gap-3">
            {(sd.items || []).map((s, i) => <span key={i} className="skill-pill stagger-item" style={{ '--delay': `${i * 40}ms` }}>{s}</span>)}
          </div>
        </div>
      </section>
    );
  };

  const renderProjects = (item = { id: 'projects' }) => {
    const sd = data[item.id];
    return (
      <section className="py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10"><SectionHeader sectionObj={sd} /></div>
        <div className="portfolio-slider" id={`slider-${item.id}`}>
          {/* Leading spacer: half viewport minus half card width → first card centres */}
          <div className="slider-spacer" />
          {(sd.items || []).map((p, i) => (
            <div key={p.id} className={`project-slide ${activeSlides[item.id] === i ? 'active' : 'inactive'}`}>
              <div className="project-card-premium group">
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-900 rounded-t-3xl">
                  {p.imageUrl
                    ? <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} />
                    : <div className="w-full h-full flex items-center justify-center opacity-20"><Layout size={40} /></div>}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                    {p.link && <a href={ensureProtocol(p.link)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><ArrowUpRight size={20} /></a>}
                    {p.codeLink && <a href={ensureProtocol(p.codeLink)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform border border-white/20"><Github size={20} /></a>}
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black text-white mb-2 leading-snug">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Trailing spacer: same width so last card also centres */}
          <div className="slider-spacer" />
        </div>
        <div className="mt-8"><ScrollDragIndicator /></div>
      </section>
    );
  };


  const renderExperience = (item = { id: 'experience' }) => {
    const sd = data[item.id];
    return (
      <section className="py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader sectionObj={sd} />
          <div className="space-y-6">{(sd.items || []).map((e, i) => (
            <div key={e.id} className="exp-card-premium stagger-item" style={{ '--delay': `${i * 100}ms` }}>
              <div className="p-8 flex flex-col md:flex-row justify-between gap-6">
                <div><h3 className="text-xl font-black text-white mb-1">{e.title}</h3><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 inline-block px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">{e.organization}</p><p className="text-slate-400 italic">"{e.description}"</p></div>
                <div className="shrink-0"><span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">📅 {e.duration}</span></div>
              </div>
            </div>
          ))}</div>
        </div>
      </section>
    );
  };

  const renderAchievements = (item = { id: 'achievements' }) => {
    const sd = data[item.id];
    return (
      <section className="py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader sectionObj={sd} />
          <div className="grid md:grid-cols-2 gap-6">{(sd.items || []).map((a, i) => (
            <div key={a.id} className="ach-card-premium stagger-item shadow-2xl" style={{ '--delay': `${i * 100}ms` }}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6"><Award size={24} /></div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">{a.issuer}</p><h3 className="text-xl font-black text-white mb-3">{a.title}</h3><p className="text-slate-400 italic">"{a.description}"</p>
            </div>
          ))}</div>
        </div>
      </section>
    );
  };

  const renderContact = (item = { id: 'contact' }) => {
    const sd = data[item.id];
    const socialIcons = { email: Mail, phone: Phone, linkedin: Linkedin, github: Github, twitter: Twitter };

    /* Show a friendly short label instead of the raw URL */
    const getDisplayLabel = (key, value) => {
      if (key === 'email' || key === 'phone') return value;
      try {
        const url = new URL(ensureProtocol(value));
        // Return just the pathname username, e.g. "/gowravmunindra" → "gowravmunindra"
        const path = url.pathname.replace(/^\//, '').replace(/\/$/, '');
        return path || url.hostname;
      } catch {
        return value;
      }
    };

    return (
      <section className="py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <SectionHeader sectionObj={sd} />
          <div className="flex flex-wrap justify-center gap-5">
            {Object.keys(socialIcons).filter(k => sd[k]).map((k, i) => {
              const Icon = socialIcons[k];
              const href = k === 'email' ? `mailto:${sd[k]}` : k === 'phone' ? `tel:${sd[k]}` : ensureProtocol(sd[k]);
              const label = getDisplayLabel(k, sd[k]);
              return (
                <a
                  key={k}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card-premium stagger-item"
                  style={{ '--delay': `${i * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 mx-auto">
                    <Icon size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-1">{k}</p>
                  <span className="text-sm font-bold text-white truncate block w-full text-center">{label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    );
  };


  const renderCustom = (item) => (
    <section className="py-28 scroll-mt-20" id={item.id}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="rounded-3xl p-12 relative overflow-hidden stagger-item" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)' }} />
          {data[item.id].title && <h2 className="text-4xl md:text-5xl font-black mb-8 text-white italic uppercase">{data[item.id].title}</h2>}
          <p className="text-xl md:text-2xl text-slate-300 italic">"{data[item.id].content}"</p>
        </div>
      </div>
    </section>
  );

  const sectionMap = {
    hero: renderHero,
    about: renderAbout,
    skills: renderSkills,
    projects: renderProjects,
    FrontendProjects: renderProjects,
    MernStackProjects: renderProjects,
    experience: renderExperience,
    achievements: renderAchievements,
    contact: renderContact,
  };

  return (
    <div className="min-h-screen selection:bg-emerald-500/30" style={{ background: '#050a14' }}>
      <div ref={trailRef} className="cursor-trail" /><div ref={dotRef} className="cursor-dot" /><div ref={ringRef} className="cursor-ring" />
      <div ref={barRef} className="nav-loading-bar" style={{ width: '0%', opacity: 0 }} />
      <nav className="fixed top-0 inset-x-0 z-50 px-6 h-20 flex items-center justify-between" style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black">{data.hero.name?.[0]}</div>
          <span className="text-lg font-black tracking-tighter text-white hidden sm:block">{data.hero.name} <span className="text-premium-gradient">{data.hero.lastName}</span></span>
        </button>
        <div className="hidden lg:flex items-center gap-8">
          {data.layout.filter(l => l.visible).map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className={`nav-link-premium ${activeSection === l.id ? 'active' : ''}`}>
              {l.navLabel || data[l.id]?.title?.split(' ')[0] || SECTION_NAMES[l.id.split('_')[0]] || 'BLOCK'}
            </button>
          ))}
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400"><Layout size={20} /></button>
      </nav>

      <main className="pt-20 pb-20">
        {data.layout.filter(l => l.visible).map(l => (
          <div key={l.id}>{l.id.startsWith('custom_') ? renderCustom(l) : sectionMap[l.id.split('_')[0]]?.(l)}</div>
        ))}
      </main>

      <footer className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-black uppercase text-slate-500">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">{data.hero.name?.[0]}</div>{data.hero.name} {data.hero.lastName}</div>
          <p>© {new Date().getFullYear()} — Excellence in Development</p>
          <div className="flex gap-4">
            {data.contact?.github && <a href={ensureProtocol(data.contact.github)} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors"><Github size={18} /></a>}
            {data.contact?.linkedin && <a href={ensureProtocol(data.contact.linkedin)} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors"><Linkedin size={18} /></a>}
          </div>
        </div>
      </footer>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1001] bg-[#050a14]/98 backdrop-blur-2xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-10"><span className="text-xl font-black text-white">{data.hero.name} <span className="text-premium-gradient">{data.hero.lastName}</span></span><button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><X size={24} /></button></div>
          <nav className="flex flex-col gap-6">
            {data.layout.filter(l => l.visible).map((l, i) => (
              <button key={l.id} onClick={() => { scrollTo(l.id); setMobileMenuOpen(false); }} className="text-4xl font-black text-white italic uppercase tracking-tighter hover:text-emerald-400 text-left transition-colors flex items-center gap-4">
                <span className="text-emerald-500/30 text-sm">0{i+1}.</span>{l.navLabel || data[l.id]?.title?.split(' ')[0] || SECTION_NAMES[l.id.split('_')[0]]}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export default App;
