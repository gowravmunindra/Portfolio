import React, { useState, useEffect, useRef, useCallback } from 'react';
/* ── Framer Motion: hero anims + section reveals + mobile menu ── */
import { motion, AnimatePresence } from 'framer-motion';
/* ── Swiper: coverflow project carousel ─────────────────────── */
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/mousewheel';
/* ── @hello-pangea/dnd: draggable skill pills ───────────────── */
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
/* ── jszip + file-saver: download contact info zip ─────────── */
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { initialData } from './data';
import {
  Github, Linkedin, Mail, Twitter,
  X, Phone, ArrowRight, Layout,
  ArrowUpRight, ChevronLeft, ChevronRight as ChevronRightIcon,
  Zap, Check, Download,
} from 'lucide-react';

/* ── helpers ────────────────────────────────────────────────────────────── */
const ensureProtocol = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://') ||
      url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  return `https://${url}`;
};

const SECTION_NAMES = {
  hero: 'Home', about: 'About', skills: 'Skills',
  projects: 'Projects', contact: 'Contact',
};

/* ══════════════════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Section Reveal (framer-motion whileInView) ─────────────────────────── */
const SectionReveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 42 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-8% 0px' }}
    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

/* ── Magnetic Button ────────────────────────────────────────────────────── */
const MagneticButton = ({ children, onClick }) => {
  const ref = useRef(null);
  const onMove  = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width  / 2) * 0.18}px,
                                              ${(e.clientY - r.top  - r.height / 2) * 0.18}px)`;
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    ref.current.style.transform  = 'translate(0,0)';
  };
  const onEnter = () => { if (ref.current) ref.current.style.transition = 'transform 0.1s ease'; };
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      className="magnetic-btn"
    >
      {children}
    </button>
  );
};

/* ── Section Badge ──────────────────────────────────────────────────────── */
const SectionBadge = ({ children }) => (
  <div className="section-badge mb-5">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
    {children}
  </div>
);

/* ── Section Header ─────────────────────────────────────────────────────── */
const SectionHeader = ({ sectionObj }) => (
  <div className="mb-12 text-center">
    <div className="flex justify-center"><SectionBadge>{sectionObj.title}</SectionBadge></div>
    <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">{sectionObj.title}</h2>
    {sectionObj.desc && (
      <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">{sectionObj.desc}</p>
    )}
  </div>
);

/* ── Project Slider — Swiper Coverflow ──────────────────────────────────── */
const ProjectSlider = ({ item, data }) => {
  const sd = data[item.id];
  const swiperRef = useRef(null);
  if (!sd) return null;

  return (
    <section className="py-16 sm:py-28 scroll-mt-20" id={item.id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <SectionReveal><SectionHeader sectionObj={sd} /></SectionReveal>
      </div>

      <SectionReveal delay={0.12}>
        <Swiper
          modules={[EffectCoverflow, Mousewheel]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          coverflowEffect={{ rotate: 18, stretch: 0, depth: 180, modifier: 1.2, slideShadows: false }}
          mousewheel={{ forceToAxis: true, sensitivity: 1 }}
          onSwiper={(s) => { swiperRef.current = s; }}
          className="project-swiper"
        >
          {(sd.items || []).map((p) => (
            <SwiperSlide key={p.id} className="project-swiper-slide">
              <div className="project-card-premium group">
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-900 rounded-t-3xl">
                  {p.imageUrl
                    ? <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} loading="lazy" />
                    : <div className="w-full h-full flex items-center justify-center opacity-20"><Layout size={40} /></div>}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                    {p.link && (
                      <a href={ensureProtocol(p.link)} target="_blank" rel="noreferrer"
                         className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                         onClick={e => e.stopPropagation()}>
                        <ArrowUpRight size={20} />
                      </a>
                    )}
                    {p.codeLink && (
                      <a href={ensureProtocol(p.codeLink)} target="_blank" rel="noreferrer"
                         className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform border border-white/20"
                         onClick={e => e.stopPropagation()}>
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl font-black text-white mb-2 leading-snug">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{p.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom prev / next buttons */}
        <div className="flex items-center justify-center gap-5 mt-6 px-4">
          <motion.button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <ChevronRightIcon size={20} />
          </motion.button>
        </div>
      </SectionReveal>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   CUSTOM HOOKS
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Custom Cursor (3-layer: dot / ring / trail) ────────────────────────── */
function useCursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const trailRef = useRef(null);
  const mouse = useRef({ x: -300, y: -300 });
  const ring  = useRef({ x: -300, y: -300 });
  const trail = useRef({ x: -300, y: -300 });
  const rafId = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.documentElement.classList.add('custom-cursor');

    const tick = () => {
      ring.current.x  += (mouse.current.x - ring.current.x)  * 0.12;
      ring.current.y  += (mouse.current.y - ring.current.y)  * 0.12;
      trail.current.x += (mouse.current.x - trail.current.x) * 0.06;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.06;
      if (ringRef.current)
        ringRef.current.style.transform  = `translate(calc(${ring.current.x}px  - 50%), calc(${ring.current.y}px  - 50%))`;
      if (trailRef.current)
        trailRef.current.style.transform = `translate(calc(${trail.current.x}px - 50%), calc(${trail.current.y}px - 50%))`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current)
        dotRef.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    };
    window.addEventListener('mousemove', onMove);
    return () => { cancelAnimationFrame(rafId.current); window.removeEventListener('mousemove', onMove); };
  }, []);

  return { dotRef, ringRef, trailRef };
}

/* ── Nav Loading Bar ────────────────────────────────────────────────────── */
function useNavProgress() {
  const barRef = useRef(null);
  const flash  = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = 'none'; bar.style.width = '0%'; bar.style.opacity = '1';
    void bar.offsetWidth;
    bar.style.transition = 'width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease';
    bar.style.width = '100%';
    setTimeout(() => { if (bar) bar.style.opacity = '0'; }, 600);
  }, []);
  return { barRef, flash };
}

/* ══════════════════════════════════════════════════════════════════════════
   DOWNLOAD CONTACT INFO  (jszip + file-saver)
   ══════════════════════════════════════════════════════════════════════════ */
const downloadContactInfo = async (contact, hero) => {
  const zip = new JSZip();

  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${hero.name} ${hero.lastName}`,
    `N:${hero.lastName};${hero.name};;;`,
    `TITLE:${hero.role}`,
    `EMAIL:${contact.email}`,
    `TEL:${contact.phone}`,
    contact.github   ? `URL:${contact.github}`   : '',
    contact.linkedin ? `URL:${contact.linkedin}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\n');

  const readme = [
    `CONTACT INFO — ${hero.name} ${hero.lastName}`,
    '='.repeat(42),
    `Role     : ${hero.role}`,
    `Email    : ${contact.email}`,
    `Phone    : ${contact.phone}`,
    contact.github   ? `GitHub   : ${contact.github}`   : '',
    contact.linkedin ? `LinkedIn : ${contact.linkedin}` : '',
    '',
    `Generated : ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`,
  ].filter(l => l !== undefined).join('\n');

  zip.file('contact.vcf',      vcard);
  zip.file('contact_info.txt', readme);
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${hero.name}_${hero.lastName}_contact.zip`);
};

/* ══════════════════════════════════════════════════════════════════════════
   APP
   ══════════════════════════════════════════════════════════════════════════ */
function App() {
  const [data]           = useState(initialData);
  const [activeSection, setActiveSection] = useState('hero');
  const [skills,        setSkills]        = useState(() => initialData.skills.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { dotRef, ringRef, trailRef } = useCursor();
  const { barRef, flash }             = useNavProgress();

  /* ── active-section tracker ─────────────────────────────────────────── */
  useEffect(() => {
    document.documentElement.classList.add('dark');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting && e.target.id) setActiveSection(e.target.id); }),
      { rootMargin: '-48% 0px -48% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    flash();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  /* ── DnD reorder (skills) ───────────────────────────────────────────── */
  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const arr = Array.from(skills);
    const [moved] = arr.splice(source.index, 1);
    arr.splice(destination.index, 0, moved);
    setSkills(arr);
  };

  /* ════════════════════════════════════════════════════════════════════════
     SECTION RENDERERS
     ════════════════════════════════════════════════════════════════════════ */

  const renderHero = () => (
    <section className="hero-section pt-20 pb-24 relative overflow-hidden" id="hero">
      <div className="hero-mesh"><div className="mesh-1" /><div className="mesh-2" /><div className="mesh-3" /></div>
      <div className="hero-grid" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        {data.hero.greeting && (
          <motion.div
            className="section-badge mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <Zap size={12} className="text-emerald-500 animate-pulse" />
            {data.hero.greeting}
          </motion.div>
        )}

        <motion.h1
          className="text-6xl sm:text-7xl xl:text-8xl font-black mb-6 leading-[1.05] w-full"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-slate-400 text-2xl sm:text-3xl xl:text-4xl mb-3 font-medium">Hello, I'm</span>
          <span className="text-premium-gradient">{data.hero.name} {data.hero.lastName}</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl font-medium text-slate-400 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.30 }}
        >
          {data.hero.rolePrefix} <span className="text-white font-bold">{data.hero.role}</span> {data.hero.roleSuffix}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xs sm:max-w-none mx-auto"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.44 }}
        >
          <MagneticButton onClick={() => scrollTo('FrontendProjects')}>
            <span className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white w-full sm:w-auto"
                  style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 8px 30px -6px rgba(5,150,105,.5)' }}>
              {data.hero.ctaPrimary || 'View Work'} <ArrowRight size={16} />
            </span>
          </MagneticButton>
          <MagneticButton onClick={() => scrollTo('contact')}>
            <span className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white border border-white/10 w-full sm:w-auto"
                  style={{ background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(12px)' }}>
              {data.hero.ctaSecondary || 'Contact'}
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section className="py-16 sm:py-28 scroll-mt-20" id="about">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          <div className="mb-10 sm:mb-14 flex flex-col items-center text-center">
            <SectionBadge>{data.about.title || 'About Me'}</SectionBadge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-4">{data.about.title}</h2>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.12}>
          <div className="about-premium-card">
            <div className="top-accent" />
            <div className="p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row gap-8 sm:gap-12 items-center lg:items-start text-center lg:text-left">

              {/* Avatar + Stats — data-driven */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4 sm:gap-6 w-full lg:w-48">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-4xl sm:text-5xl font-black text-emerald-500">
                    {data.hero.name?.[0]}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-3 w-full justify-center">
                  {(data.about.stats || []).map((stat, i) => (
                    <div key={i} className="about-stat-card flex-1">
                      <span className="text-2xl font-black text-emerald-400">{stat.value}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio + Tags — data-driven */}
              <div className="flex-1 min-w-0">
                <div className="text-4xl sm:text-5xl font-black text-emerald-500/10 mb-2 leading-none flex justify-center lg:justify-start">"</div>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed italic">
                  {data.about.bio.split('. ').filter(s => s.trim()).map((s, i) => (
                    <p key={i}>{s.endsWith('.') ? s : `${s}.`}</p>
                  ))}
                </div>
                <div className="mt-6 sm:mt-10 pt-6 sm:pt-10 border-t border-white/5 flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                  {(data.about.tags || []).map(t => (
                    <span key={t} className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-500/80">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );

  /* Skills section — draggable pills via @hello-pangea/dnd */
  const renderSkills = (item = { id: 'skills' }) => {
    const sd = data[item.id];
    if (!sd) return null;
    return (
      <section className="py-16 sm:py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal><SectionHeader sectionObj={sd} /></SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6">✦ Drag to reorder ✦</p>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="skills" direction="horizontal">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="skills-dnd-track">
                    {skills.map((s, i) => (
                      <Draggable key={s} draggableId={s} index={i}>
                        {(provided, snapshot) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`skill-pill flex-shrink-0 ${snapshot.isDragging ? 'shadow-lg shadow-emerald-500/30 !border-emerald-500/60 !text-white scale-105' : ''}`}
                            style={provided.draggableProps.style}
                          >
                            {s}
                          </span>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </SectionReveal>
        </div>
      </section>
    );
  };

  const renderContact = (item = { id: 'contact' }) => {
    const sd = data[item.id];
    if (!sd) return null;
    const socialIcons = { email: Mail, phone: Phone, linkedin: Linkedin, github: Github, twitter: Twitter };
    const getLabel = (key, value) => {
      if (key === 'email' || key === 'phone') return value;
      try {
        const url  = new URL(ensureProtocol(value));
        const path = url.pathname.replace(/^\//, '').replace(/\/$/, '');
        return path || url.hostname;
      } catch { return value; }
    };

    return (
      <section className="py-16 sm:py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal><SectionHeader sectionObj={sd} /></SectionReveal>
          <SectionReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
              {Object.keys(socialIcons).filter(k => sd[k]).map((k, i) => {
                const Icon = socialIcons[k];
                const href = k === 'email' ? `mailto:${sd[k]}` : k === 'phone' ? `tel:${sd[k]}` : ensureProtocol(sd[k]);
                return (
                  <motion.a
                    key={k}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-card-premium"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.09, duration: 0.6 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                  >
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 sm:mb-4 mx-auto">
                      <Icon size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-1">{k}</p>
                    <span className="text-sm font-bold text-white truncate block w-full text-center">{getLabel(k, sd[k])}</span>
                  </motion.a>
                );
              })}
            </div>

            {/* Download contact zip — jszip + file-saver */}
            <div className="mt-10 flex justify-center">
              <motion.button
                onClick={() => downloadContactInfo(data.contact, data.hero)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download size={16} /> Download Contact Info
              </motion.button>
            </div>
          </SectionReveal>
        </div>
      </section>
    );
  };

  const renderCustom = (item) => {
    const sd = data[item.id];
    if (!sd) return null;
    return (
      <section className="py-28 scroll-mt-20" id={item.id}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionReveal>
            <div className="rounded-3xl p-12 relative overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg,#10b981,#06b6d4,#8b5cf6)' }} />
              {sd.title && <h2 className="text-4xl md:text-5xl font-black mb-8 text-white italic uppercase">{sd.title}</h2>}
              <p className="text-xl md:text-2xl text-slate-300 italic">"{sd.content}"</p>
            </div>
          </SectionReveal>
        </div>
      </section>
    );
  };

  /* ── Section map ────────────────────────────────────────────────────── */
  const sectionMap = {
    hero:              ()     => renderHero(),
    about:             ()     => renderAbout(),
    skills:            (item) => renderSkills(item),
    FrontendProjects:  (item) => <ProjectSlider key={item.id} item={item} data={data} />,
    MernStackProjects: (item) => <ProjectSlider key={item.id} item={item} data={data} />,
    contact:           (item) => renderContact(item),
  };

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen selection:bg-emerald-500/30" style={{ background: '#050a14' }}>
      {/* Custom cursor */}
      <div ref={trailRef} className="cursor-trail" />
      <div ref={dotRef}   className="cursor-dot"   />
      <div ref={ringRef}  className="cursor-ring"  />
      {/* Nav progress bar */}
      <div ref={barRef} className="nav-loading-bar" style={{ width: '0%', opacity: 0 }} />

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 h-20 flex items-center justify-between"
        style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black">
            {data.hero.name?.[0]}
          </div>
          <span className="text-lg font-black tracking-tighter text-white hidden sm:block">
            {data.hero.name} <span className="text-premium-gradient">{data.hero.lastName}</span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {data.layout.filter(l => l.visible).map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={`nav-link-premium ${activeSection === l.id ? 'active' : ''}`}
            >
              {l.navLabel || data[l.id]?.title?.split(' ')[0] || SECTION_NAMES[l.id.split('_')[0]] || 'BLOCK'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400"
        >
          <Layout size={20} />
        </button>
      </nav>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="pt-20 pb-20">
        {data.layout.filter(l => l.visible).map(l => (
          <div key={l.id}>
            {l.id.startsWith('custom_')
              ? renderCustom(l)
              : (sectionMap[l.id] ?? sectionMap[l.id.split('_')[0]])?.(l)}
          </div>
        ))}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-black uppercase text-slate-500 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">
              {data.hero.name?.[0]}
            </div>
            {data.hero.name} {data.hero.lastName}
          </div>
          <p>© {new Date().getFullYear()} — Excellence in Development</p>
          <div className="flex gap-4">
            {data.contact?.github   && <a href={ensureProtocol(data.contact.github)}   target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors"><Github   size={18} /></a>}
            {data.contact?.linkedin && <a href={ensureProtocol(data.contact.linkedin)} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors"><Linkedin size={18} /></a>}
          </div>
        </div>
      </footer>

      {/* ── Mobile Menu (AnimatePresence slide-in) ───────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[1001] bg-[#050a14]/98 backdrop-blur-2xl p-8 flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-black text-white">
                {data.hero.name} <span className="text-premium-gradient">{data.hero.lastName}</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {data.layout.filter(l => l.visible).map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => { scrollTo(l.id); setMobileMenuOpen(false); }}
                  className="text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tighter hover:text-emerald-400 text-left transition-colors flex items-center gap-4"
                  initial={{ opacity: 0, x: 48 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.38 }}
                >
                  <span className="text-emerald-500/30 text-sm font-bold not-italic">0{i + 1}.</span>
                  {l.navLabel || data[l.id]?.title?.split(' ')[0] || SECTION_NAMES[l.id.split('_')[0]]}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
