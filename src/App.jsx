import React, { useEffect, useMemo, useRef, useState } from "react";
//import WAVES from 'vanta/dist/vanta.waves.min';
import { useEffect, useRef } from 'react';
import OCEAN from 'vanta/dist/vanta.ocean.min.js';
import * as THREE from 'three';
import $ from "jquery";
import './App.css';
import './index.css';

// === Aman Benjwal — Portfolio without Tailwind ===

// ===== Helper Components =====
const Section = ({ id, children, className = '' }) => {
  const { ref, visible } = useReveal();
  return (
    <section id={id} ref={ref} className={`section ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </section>
  );
};

const Badge = ({ children, variant = "info" }) => (
  <span className={`status-badge ${variant}`}>{children}</span>
);

// ===== Custom Hooks =====
const useReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  
  return { ref, visible };
};

const useTypewriter = (phrases, speed = 60, pause = 1200) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    const current = phrases[index % phrases.length];
    let timer;
    
    const tick = () => {
      setText(t => deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1));
      
      if (!deleting && text === current) {
        timer = setTimeout(() => setDeleting(true), pause);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex(i => (i + 1) % phrases.length);
      }
    };
    
    timer = setTimeout(tick, deleting ? speed / 1.6 : speed);
    return () => clearTimeout(timer);
  }, [text, deleting, phrases, index, speed, pause]);
  
  return text;
};

// ===== UI Components =====

const RadialSkill = ({ label, value }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { ref, visible } = useReveal();
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setAnimatedValue(value), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, value]);

  const conicGradient = `conic-gradient(var(--cyan) ${animatedValue * 3.6}deg, rgba(255,255,255,0.15) 0deg)`;

  return (
    <div ref={ref} className="radial-skill">
      <div className="radial-meter" style={{ background: conicGradient }}>
        <div className="radial-meter-inner">
          <span>{animatedValue}%</span>
        </div>
      </div>
      <span>{label}</span>
    </div>
  );
};

const SkillBar = ({ label, value }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { ref, visible } = useReveal();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setAnimatedValue(value), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, value]);

  return (
    <div ref={ref} className="skill-bar">
      <div className="skill-bar-info">
        <span>{label}</span>
        <span>{animatedValue}%</span>
      </div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: `${animatedValue}%` }} />
      </div>
    </div>
  );
};

const ProjectCard = ({ title, desc, tech = [], img, status, link }) => {
  const { ref, visible } = useReveal();
  const statusVariant = { "Completed": "success", "In Progress": "warning", "Coming Soon": "info" }[status] || "info";

  return (
    <div ref={ref} className="project-card">
      <div className="project-card-image-container">
        {img ? <img src={img} alt={`${title} preview`} className="project-card-image" /> : <div>Preview coming soon</div>}
        <Badge variant={statusVariant}>{status}</Badge>
        {link && link !== "#" && (
          <div className="project-card-overlay">
            <a href={link} target="_blank" rel="noopener noreferrer" className="button button-primary">
              View Project
            </a>
          </div>
        )}
      </div>
      <div className="project-card-content">
        <h3 className="project-card-title">{title}</h3>
        <p className="project-card-desc">{desc}</p>
        <div className="project-card-tech">
          {tech.map((t) => <span key={t} className="tech-badge">{t}</span>)}
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ year, text, isLast }) => {
  const { ref, visible } = useReveal();

  return (
    <div ref={ref} className={`timeline-item ${visible ? 'is-visible' : ''}`}>
      <div className="timeline-visual">
        <div className="timeline-dot"></div>
        {!isLast && <div className="timeline-connector"></div>}
      </div>
      <div className="timeline-content">
        <div className="timeline-year">{year}</div>
        <div className="timeline-text">{text}</div>
      </div>
    </div>
  );
};

const ContactSection = ({ data }) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! This form is a demo; please contact me via email.");
  };

  return (
    <Section id="contact">
      <div className="section-header">
        <h2 className="section-title">Let's Connect</h2>
        <p className="section-subtitle">
          Whether you have a project in mind, want to collaborate, or just want to say hello, I'd love to hear from you.
        </p>
      </div>
      <div className="contact-grid">
        <div className="contact-details">
          <div className="contact-info-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <div>
              <strong>Email</strong>
              <br />
              <a href={`mailto:${data.email}`}>{data.email}</a>
            </div>
          </div>
          <div className="contact-info-card">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <div>
              <strong>Phone</strong>
              <br />
              <a href={`tel:${data.phone}`}>{data.phone}</a>
            </div>
          </div>
          <div className="contact-socials">
              <a href={data.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
          </div>
          <a href={data.resumeUrl} download className="button button-primary">
            Download Resume
          </a>
        </div>
        <form className="contact-form" onSubmit={handleFormSubmit}>
          <h3>Send a Message</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="your.email@example.com" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="What's this about?" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Tell me about your project or just say hello..." required></textarea>
          </div>
          <button type="submit" className="button button-primary" style={{width: '100%'}}>
            Send Message
          </button>
        </form>
      </div>
    </Section>
  );
};


// ================== MAIN APP ==================
export default function App() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  // VANTA.JS BACKGROUND EFFECT HOOK
useEffect(() => {
  const effect = OCEAN({
    el: vantaRef.current,
    THREE: THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x6c63ff,
    shininess: 60.0,
    waveHeight: 20.0,
    waveSpeed: 1.0,
    zoom: 0.75,
    backgroundColor: 0x0f0022,
  });

  // 💧 Add ripple effect
  const script = document.createElement("script");
  script.src = "/js/jquery.ripples-min.js";
  script.onload = () => {
    try {
      $(vantaRef.current).ripples({
        resolution: 512,
        perturbance: 0.04,   // How wavy the ripples look
        dropRadius: 20,      // Ripple size
        interactive: true,   // Enable hover interaction
      });
    } catch (e) {
      console.error("Ripples init failed", e);
    }
  };
  document.body.appendChild(script);

  return () => {
    if (effect) effect.destroy();
    try {
      $(vantaRef.current).ripples("destroy");
    } catch {}
  };
}, []);



  const data = useMemo(() => ({
      name: "Aman Benjwal",
      taglinePhrases: ["Web Developer", "Graphic Designer", "AI Enthusiast"],
      intro: "Creative and detail-oriented Computer Science student with strong skills in web and software development, brand design, and effective use of AI tools.",
      email: "amanbenjwal2004@gmail.com",
      phone: "+91 7351105153",
      resumeUrl: "/Aman_Benjwal_Resume.pdf", 
      linkedin: "https://www.linkedin.com/in/aman-benjwal/",
      github: "https://github.com/amanbenjwal",
      skillsRadial: [
        { label: "JavaScript", value: 85 },
        { label: "HTML/CSS", value: 90 },
        { label: "C++", value: 80 },
        { label: "SQL", value: 75 },
      ],
      skillsBars: [
        { label: "React", value: 70 },
        { label: "Graphic Design", value: 85 },
        { label: "Figma", value: 80 },
        { label: "MySQL", value: 75 },
        { label: "Git", value: 80 },
        { label: "AI Tools", value: 75 },
      ],
      projects: [
        {
            title: "Employee Management System",
            desc: "Developed a system to manage employee records with features to mark, update, and view data, improving accuracy and efficiency in organizational workflows.",
            tech: ["JavaScript", "HTML", "CSS", "SQL"],
            img: "https://picsum.photos/seed/employee/600/400",
            status: "Completed",
            link: "#"
        },
        {
            title: "Text-to-Audio and Audio-to-Text Converter",
            desc: "Built a web tool using HTML, CSS, and JavaScript with speech APIs for real-time text-audio conversion, highlighting front-end and accessibility skills.",
            tech: ["JavaScript", "HTML", "CSS", "Web APIs"],
            img: "https://picsum.photos/seed/audiotext/600/400",
            status: "Completed",
            link: "#"
        },
        {
          title: "ML-Based Attendance System",
          desc: "Built an attendance system using machine learning and camera input to recognize faces and auto-record attendance in Excel, enhancing accuracy and minimizing manual work.",
          tech: ["Python", "Machine Learning", "OpenCV", "Excel"],
          img: "https://picsum.photos/seed/attendance/600/400",
          status: "Completed",
          link: "#"
        },
      ],
      journey: [
        { year: "2020", text: "Completed CBSE schooling with focus on computer science fundamentals." },
        { year: "2022", text: "Started BTech in Computer Science at Graphic Era Hill University, Dehradun." },
        { year: "2023", text: "Developed Employee Management System and Text-to-Audio Converter projects." },
        { year: "2024", text: "Worked on ML-Based Attendance System and improved skills in AI tools." },
        { year: "2025", text: "Completed internship on AGNIRVA Space Program by AICTE and obtained Google Cloud certification." },
      ],
    }), []);

  const typed = useTypewriter(data.taglinePhrases);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = ["Skills", "Projects", "Journey", "Contact"];

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }),
      { rootMargin: "-30% 0px -70% 0px" }
    );
    sections.forEach(s => observer.observe(s));
    return () => sections.forEach(s => observer.unobserve(s));
  }, []);

return (
  <div className="app-container selection-bg relative" ref={vantaRef}>
    {/* 🌊 Ocean + Ripple Background */}
    <div
      id="vanta-bg"
      className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden"
    />

    {/* 🌟 Main Content */}
    <nav className="nav">
      <div className="nav-container">
        <a href="#hero" className="nav-brand text-gradient">{data.name}</a>
        <div className="nav-links">
          {navLinks.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={activeSection === item.toLowerCase() ? 'active' : ''}
            >
              {item}
            </a>
          ))}
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>

    <main>
      {/* All your Section components */}
      <Section id="hero" className="hero-section">
        <div className="hero-content">
          <Badge>Web Developer & Graphic Designer</Badge>
          <h1 className="hero-title">
            Hi, I'm <span className="text-gradient">{data.name.split(' ')[0]}</span>
          </h1>
          <div className="hero-typewriter">
            <span className="text-gradient">{typed}</span>
            <span className="cursor">|</span>
          </div>
          <p className="hero-intro">{data.intro}</p>
          <div className="hero-buttons">
            <a href={`mailto:${data.email}`} className="button button-primary">Email Me</a>
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="button button-secondary">LinkedIn</a>
          </div>
        </div>
      </Section>

      {/* Other sections */}
      <Section id="skills"> ... </Section>
      <Section id="projects"> ... </Section>
      <Section id="journey"> ... </Section>
      <ContactSection data={data} />
    </main>

    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} {data.name}. Built with ❤️ and creativity.</p>
        <div className="footer-links">
          <a href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={data.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={`mailto:${data.email}`}>Email</a>
        </div>
      </div>
    </footer>
  </div>
);

