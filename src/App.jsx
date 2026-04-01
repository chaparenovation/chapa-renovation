import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { content } from './data/content';

// ══════════════════════════════════════
//  UTILITY — Animation Variants
// ══════════════════════════════════════
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: i * 0.1 },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ══════════════════════════════════════
//  COMPONENT — Section Wrapper
// ══════════════════════════════════════
function Section({ id, children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Header
// ══════════════════════════════════════
function Header({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '#services', label: t.nav.services },
    { href: '#expertise', label: t.nav.expertise },
    { href: '#galerie', label: t.nav.galerie },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'header-solid' : 'header-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-gold-500 flex items-center justify-center transition-all duration-300 group-hover:bg-gold-500">
            <span className="text-gold-500 group-hover:text-obsidian-950 font-display font-black text-xs transition-colors duration-300">CR</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-sm tracking-widest text-white uppercase leading-none">Chapa</p>
            <p className="font-mono text-[9px] tracking-[0.3em] text-gold-500 uppercase leading-none mt-0.5">Rénovation</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-mono tracking-widest text-obsidian-300 hover:text-gold-500 uppercase transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 border border-obsidian-700 p-0.5">
            {['fr', 'en', 'es'].map((l) => (
              <button
                key={l}
                id={`lang-${l}`}
                onClick={() => setLang(l)}
                className={`lang-btn ${lang === l ? 'active' : ''}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CTA */}
          <a href="#contact" className="hidden lg:flex btn-gold text-xs py-2.5 px-5">
            <span>{t.nav.devis}</span>
          </a>

          {/* Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Menu"
          >
            <span className={`w-5 h-px bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-5 h-px bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden bg-obsidian-900 border-t border-gold-500/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-mono tracking-widest text-obsidian-300 hover:text-gold-500 uppercase"
                >
                  {item.label}
                </a>
              ))}
              <a href="#contact" className="btn-gold text-xs self-start py-3 px-6 mt-2">
                <span>{t.nav.devis}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Hero Section
// ══════════════════════════════════════
function Hero({ t }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.4], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #040404 0%, #080808 30%, #0d0d0d 100%)' }}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,180,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,180,0,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,180,0,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-gold-500/20" />
      <div className="absolute top-24 right-8 w-16 h-16 border-r border-t border-gold-500/20" />
      <div className="absolute bottom-16 left-8 w-16 h-16 border-l border-b border-gold-500/20" />
      <div className="absolute bottom-16 right-8 w-16 h-16 border-r border-b border-gold-500/20" />

      {/* Vertical text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:block">
        <p className="writing-vertical font-mono text-[9px] tracking-[0.4em] text-obsidian-500 uppercase rotate-180">
          Paris · Île-de-France · 2004
        </p>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block">
        <p className="writing-vertical font-mono text-[9px] tracking-[0.4em] text-obsidian-500 uppercase">
          Excellence · Artisanat · Précision
        </p>
      </div>

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12">
        <motion.div variants={fadeUp} custom={0}>
          <p className="section-label mb-8">{t.hero.label}</p>
        </motion.div>

        <motion.div variants={fadeUp} custom={1} className="mb-6">
          <h1 className="font-display font-black leading-[0.9] tracking-tight">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white/90">
              {t.hero.title.split('\n')[0]}
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white/90 mt-1">
              {t.hero.title.split('\n')[1]}
            </span>
            <span className="block text-gold-gradient text-6xl sm:text-7xl lg:text-8xl xl:text-9xl mt-2">
              {t.hero.years}
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="max-w-2xl text-obsidian-300 text-base lg:text-lg leading-relaxed mb-10 font-light"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
          <a href="#contact" id="hero-cta-primary" className="btn-gold">
            <span>{t.hero.cta_primary}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#galerie" id="hero-cta-secondary" className="btn-outline">
            <span>{t.hero.cta_secondary}</span>
          </a>
        </motion.div>

        {/* Badge */}
        <motion.div variants={fadeUp} custom={4} className="mt-12 inline-flex items-center gap-2 border border-gold-500/20 px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-gold-500/80 uppercase">{t.hero.badge}</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-obsidian-500 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gold-500/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Ticker / Marquee
// ══════════════════════════════════════
function Ticker({ t }) {
  const items = [
    '✦ Menuiserie',
    '✦ Peinture',
    '✦ Électricité',
    '✦ Plomberie',
    '✦ Domotique',
    '✦ Paris',
    '✦ Île-de-France',
    '✦ 20 ans',
    '✦ Excellence',
    '✦ Artisans Certifiés',
    '✦ Menuiserie',
    '✦ Peinture',
    '✦ Électricité',
    '✦ Plomberie',
    '✦ Domotique',
    '✦ Paris',
    '✦ Île-de-France',
    '✦ 20 ans',
    '✦ Excellence',
    '✦ Artisans Certifiés',
  ];

  return (
    <div className="py-4 border-y border-gold-500/10 overflow-hidden bg-obsidian-900/40">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="font-mono text-[10px] tracking-[0.25em] text-gold-500/60 uppercase mx-6 whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Services Section
// ══════════════════════════════════════
function Services({ t }) {
  const [hovered, setHovered] = useState(null);

  return (
    <Section id="services" className="py-28 lg:py-36 max-w-7xl mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
        <div>
          <motion.p variants={fadeUp} className="section-label mb-4">{t.services.label}</motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-display font-black text-4xl lg:text-6xl text-white leading-tight"
          >
            {t.services.title}
          </motion.h2>
        </div>
        <motion.p variants={fadeUp} custom={2} className="max-w-sm text-obsidian-400 text-sm leading-relaxed">
          {t.services.subtitle}
        </motion.p>
      </div>

      {/* Grid */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold-500/5"
      >
        {t.services.items.map((service, i) => (
          <motion.div
            key={service.code}
            variants={fadeUp}
            custom={i}
            className="service-card bg-obsidian-950"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Code number */}
            <p className="font-mono text-[10px] text-gold-500/40 tracking-[0.3em] mb-6">// {service.code}</p>

            {/* Icon */}
            <div className="text-4xl mb-4 transition-transform duration-300" style={{
              transform: hovered === i ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
            }}>
              {service.icon}
            </div>

            {/* Name */}
            <h3 className="font-display font-bold text-2xl text-white mb-3">{service.name}</h3>

            {/* Description */}
            <p className="text-obsidian-400 text-sm leading-relaxed mb-6">{service.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span key={tag} className="font-mono text-[9px] tracking-widest text-gold-500/60 border border-gold-500/15 px-2 py-1 uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Expertise / About Section
// ══════════════════════════════════════
function Expertise({ t }) {
  return (
    <section id="expertise" className="py-28 lg:py-36 bg-obsidian-900/30 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            rgba(212,180,0,1) 0px,
            rgba(212,180,0,1) 1px,
            transparent 1px,
            transparent 20px
          )`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left */}
          <Section id="expertise-left">
            <motion.p variants={fadeUp} className="section-label mb-4">{t.expertise.label}</motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display font-black text-4xl lg:text-5xl xl:text-6xl text-white leading-tight mb-8"
            >
              {t.expertise.title.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-obsidian-400 text-sm leading-relaxed mb-5">
              {t.expertise.desc1}
            </motion.p>
            <motion.p variants={fadeUp} custom={3} className="text-obsidian-400 text-sm leading-relaxed mb-8">
              {t.expertise.desc2}
            </motion.p>
            <motion.a
              variants={fadeUp}
              custom={4}
              href="#contact"
              className="btn-outline text-sm inline-flex"
            >
              <span>{t.expertise.cta}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>

            {/* Areas */}
            <motion.div variants={fadeUp} custom={5} className="mt-10">
              <p className="section-label mb-3">Zones d'intervention</p>
              <div className="flex flex-wrap gap-2">
                {t.expertise.areas.map((area) => (
                  <span key={area} className="font-mono text-[9px] tracking-widest text-obsidian-400 border border-obsidian-700 px-3 py-1.5 uppercase">
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </Section>

          {/* Right — Stats */}
          <Section id="expertise-right">
            <div className="grid grid-cols-2 gap-px bg-gold-500/8 border border-gold-500/08">
              {t.expertise.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  custom={i}
                  className="stat-card bg-obsidian-950"
                >
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="font-display font-black text-5xl text-gold-gradient">{stat.nb}</span>
                    {stat.unit && (
                      <span className="font-display font-bold text-xl text-gold-600">{stat.unit}</span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] tracking-widest text-obsidian-400 uppercase">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Timeline */}
            <motion.div variants={fadeUp} custom={4} className="mt-8 border border-gold-500/10 p-6">
              <p className="section-label mb-6">Milestones</p>
              {[
                { year: '2004', text: 'Fondation à Paris 11ème' },
                { year: '2010', text: 'Certification RGE & Qualibat' },
                { year: '2015', text: 'Intégration de la domotique KNX' },
                { year: '2024', text: '20 ans · +800 chantiers réalisés' },
              ].map((item, i) => (
                <div key={item.year} className="flex gap-4 mb-4 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-gold-500 mt-1 flex-shrink-0" />
                    {i < 3 && <div className="w-px flex-1 bg-gold-500/20 mt-1" />}
                  </div>
                  <div className="pb-4 last:pb-0">
                    <p className="font-mono text-xs text-gold-500 mb-0.5">{item.year}</p>
                    <p className="text-obsidian-300 text-xs">{item.text}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </Section>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Gallery Section
// ══════════════════════════════════════
const galleryItems = [
  { src: '/gallery_menuiserie.jpg', label: 'Menuiserie', size: 'lg' },
  { src: '/gallery_plomberie.jpg', label: 'Plomberie', size: 'sm' },
  { src: '/gallery_cuisine.jpg', label: 'Cuisine', size: 'sm' },
  { src: '/gallery_peinture.jpg', label: 'Peinture', size: 'sm' },
  { src: '/gallery_domotique.jpg', label: 'Domotique', size: 'lg' },
];

function Gallery({ t }) {
  const [selected, setSelected] = useState(null);

  return (
    <section id="galerie" className="py-28 lg:py-36 max-w-7xl mx-auto px-6 lg:px-12">
      <Section id="gallery-content">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <motion.p variants={fadeUp} className="section-label mb-4">{t.gallery.label}</motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display font-black text-4xl lg:text-6xl text-white leading-tight"
            >
              {t.gallery.title}
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} custom={2} className="max-w-sm text-obsidian-400 text-sm leading-relaxed">
            {t.gallery.subtitle}
          </motion.p>
        </div>

        {/* Masonry-style grid */}
        <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[220px] lg:auto-rows-[260px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className={`gallery-item cursor-pointer ${
                item.size === 'lg'
                  ? i === 0
                    ? 'lg:col-span-2 row-span-2'
                    : 'lg:col-span-2'
                  : ''
              }`}
              onClick={() => setSelected(item)}
            >
              <img src={item.src} alt={item.label} loading="lazy" />
              <div className="gallery-overlay">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.3em] text-gold-500/80 uppercase mb-1">
                    Réalisation
                  </p>
                  <p className="font-display font-bold text-white text-lg">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.src}
                alt={selected.label}
                className="w-full h-full object-contain max-h-[85vh]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-display font-bold text-white text-xl">{selected.label}</p>
                <p className="font-mono text-[10px] text-gold-500 tracking-widest uppercase mt-1">CHAPA RÉNOVATION · Paris</p>
              </div>
              <button
                id="gallery-close"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Contact Section
// ══════════════════════════════════════
function Contact({ t }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const infoItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.34a2 2 0 0 1 1.72-2.18l3-.27a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.92z" />
        </svg>
      ),
      label: t.contact.info.phone_label,
      value: '+33 1 00 00 00 00',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: t.contact.info.email_label,
      value: 'contact@chaparenovation.fr',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: t.contact.info.hours_label,
      value: t.contact.info.hours,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: t.contact.info.address_label,
      value: t.contact.info.address,
    },
  ];

  return (
    <section
      id="contact"
      className="py-28 lg:py-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0d0d 0%, #080808 100%)' }}
    >
      {/* Background accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(212,180,0,1) 0px,
            rgba(212,180,0,1) 1px,
            transparent 1px,
            transparent 20px
          )`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <Section id="contact-header">
          <div className="mb-16">
            <motion.p variants={fadeUp} className="section-label mb-4">{t.contact.label}</motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display font-black text-4xl lg:text-6xl text-white leading-tight mb-4"
            >
              {t.contact.title.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-obsidian-400 text-sm max-w-md">
              {t.contact.subtitle}
            </motion.p>
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <Section id="contact-form-section" className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t.contact.form.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                />
                <input
                  id="contact-email"
                  type="email"
                  placeholder={t.contact.form.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input"
                />
              </motion.div>
              <motion.div variants={fadeUp} custom={1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder={t.contact.form.phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
                <select
                  id="contact-service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                  className="form-input"
                  style={{ appearance: 'none' }}
                >
                  <option value="" disabled>{t.contact.form.service}</option>
                  <option value="menuiserie">Menuiserie</option>
                  <option value="peinture">Peinture</option>
                  <option value="electricite">Électricité</option>
                  <option value="plomberie">Plomberie</option>
                  <option value="domotique">Domotique</option>
                  <option value="complet">Rénovation complète</option>
                </select>
              </motion.div>
              <motion.textarea
                variants={fadeUp}
                custom={2}
                id="contact-message"
                rows={5}
                placeholder={t.contact.form.message}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-input resize-none"
              />
              <motion.div variants={fadeUp} custom={3}>
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 py-4 px-6 border border-green-500/30 bg-green-500/05"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="font-mono text-xs text-green-400 tracking-widest uppercase">Message envoyé avec succès</span>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="submit"
                      id="contact-submit"
                      type="submit"
                      className="btn-gold w-full justify-center py-4"
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{t.contact.form.submit}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </form>
          </Section>

          {/* Info */}
          <Section id="contact-info-section" className="lg:col-span-2">
            <div className="space-y-0 border border-gold-500/10">
              {infoItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  custom={i}
                  className="flex gap-4 p-6 border-b border-gold-500/08 last:border-0 hover:bg-gold-500/02 transition-colors"
                >
                  <div className="text-gold-500 mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.3em] text-obsidian-500 uppercase mb-1">{item.label}</p>
                    <p className="text-obsidian-200 text-sm whitespace-pre-line">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RGE Badges */}
            <motion.div variants={fadeUp} custom={4} className="mt-6 p-4 border border-gold-500/10">
              <p className="section-label mb-3">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {['RGE', 'Qualibat', 'Qualifelec', 'Label FFBQ'].map((cert) => (
                  <span key={cert} className="font-mono text-[9px] tracking-widest text-gold-500/70 border border-gold-500/20 px-3 py-1.5 uppercase">
                    {cert}
                  </span>
                ))}
              </div>
            </motion.div>
          </Section>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Footer
// ══════════════════════════════════════
function Footer({ t }) {
  return (
    <footer className="border-t border-gold-500/10 bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gold-500/40 flex items-center justify-center">
              <span className="text-gold-500/70 font-display font-black text-xs">CR</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm tracking-widest text-white/70 uppercase leading-none">Chapa Rénovation</p>
              <p className="font-mono text-[9px] tracking-[0.25em] text-gold-500/50 uppercase mt-0.5">{t.footer.tagline}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex gap-6">
            {['#services', '#expertise', '#galerie', '#contact'].map((href, i) => {
              const labels = { '#services': 'Services', '#expertise': 'Expertise', '#galerie': 'Galerie', '#contact': 'Contact' };
              return (
                <a key={href} href={href} className="font-mono text-[9px] tracking-widest text-obsidian-500 hover:text-gold-500 uppercase transition-colors">
                  {labels[href]}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-obsidian-800 text-center">
          <p className="font-mono text-[10px] tracking-widest text-obsidian-600 uppercase">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════
//  COMPONENT — Floating CTA Button
// ══════════════════════════════════════
function FloatingCTA({ t }) {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <div className="fixed bottom-8 right-6 z-[999] flex items-center gap-3">
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-obsidian-900 border border-gold-500/20 px-4 py-2 hidden sm:block"
          >
            <p className="font-mono text-[10px] tracking-widest text-gold-500 uppercase whitespace-nowrap">{t.cta_call}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        id="floating-call-btn"
        href="tel:+33100000000"
        aria-label={t.cta_call}
        className="floating-cta"
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.34a2 2 0 0 1 1.72-2.18l3-.27a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.92z" />
        </svg>
      </a>
    </div>
  );
}

// ══════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState('fr');
  const t = content[lang];

  return (
    <div className="noise-overlay">
      <Header lang={lang} setLang={setLang} t={t} />
      <main>
        <Hero t={t} />
        <Ticker t={t} />
        <Services t={t} />
        <Expertise t={t} />
        <Gallery t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
      <FloatingCTA t={t} />
    </div>
  );
}
