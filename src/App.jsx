import { useState, useEffect } from 'react';
import './App.css';
import DotMatrixIcon from './components/DotMatrixIcon';
import SegmentedBar from './components/SegmentedBar';
import ActivityLog from './components/ActivityLog';
import CustomCursor from './components/CustomCursor';


import ccnaImg from './assets/certificates/CCNA.png';
import deanImg from './assets/certificates/Dean honor.jpeg';
import mobilityImg from './assets/certificates/Mobility.jpeg';
import aboutMeImg from './assets/about-me/about-me.jpeg';
import cvPdf from './assets/cv/Muhammad_Zahid_CV_Unity_Intern.pdf';
import paper1Pdf from './assets/projects/Comparative Analysis of Statistical Learning Models and CNNs for.pdf';
import paper2Pdf from './assets/projects/Return-Cancellation Risk.pdf';

export default function App() {
  // Theme Toggle State
  const [theme, setTheme] = useState('dark');

  // Onboarding loading stage: 'theme-select' | 'typing' | 'fade-out' | 'done'
  const [loadingStage, setLoadingStage] = useState('theme-select');
  const [welcomeText, setWelcomeText] = useState('');

  // Live Clock State
  const [time, setTime] = useState(new Date());

  // Unified State Machine Status: 'idle' | 'running' | 'needs-input' | 'done' | 'error'
  const [appStatus, setAppStatus] = useState('idle');

  // Interactive Skills State (Unity-themed defaults)
  const [activeSkills, setActiveSkills] = useState(new Set(['unity', 'csharp', 'vr', 'iot']));

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Loading Onboarding Typing & Fade-out Effect
  useEffect(() => {
    if (loadingStage !== 'typing') return;

    const fullText = 'HELLO.';

    const typingInterval = setInterval(() => {
      setWelcomeText((prev) => {
        if (prev.length < fullText.length) {
          return prev + fullText[prev.length];
        } else {
          clearInterval(typingInterval);

          // Wait 800ms after typing finished, then fade out
          setTimeout(() => {
            setLoadingStage('fade-out');

            // Wait 600ms for fade-out transition, then complete
            setTimeout(() => {
              setLoadingStage('done');
            }, 600);
          }, 800);

          return prev;
        }
      });
    }, 250); // 250ms per character (total ~1.5s)

    return () => clearInterval(typingInterval);
  }, [loadingStage]);

  const selectInitialTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    if (selectedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    setLoadingStage('typing');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  const toggleSkill = (skill) => {
    setActiveSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  // Form Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('ALL FIELDS ARE REQUIRED.');
      setAppStatus('needs-input');
      return;
    }

    setAppStatus('running');

    // Simulate sending message
    setTimeout(() => {
      setFormSuccess(true);
      setAppStatus('done');
      setFormData({ name: '', email: '', message: '' });

      // Return to idle status after 3 seconds
      setTimeout(() => {
        setAppStatus('idle');
      }, 3000);
    }, 1500);
  };

  // Form Input Change Handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // If user starts typing, clean error and return to idle
    if (appStatus === 'needs-input' || appStatus === 'error') {
      setAppStatus('idle');
      setFormError('');
    }
  };

  const scrollToProjects = () => {
    const section = document.getElementById('projects-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pad = (num) => String(num).padStart(2, '0');
  const hr = pad(time.getHours());
  const min = pad(time.getMinutes());
  const sec = pad(time.getSeconds());

  const formattedDate = time.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  const skillsList = [
    { id: 'unity', name: 'Unity Engine (VR/XR)' },
    { id: 'csharp', name: 'C# Scripting' },
    { id: 'vr', name: 'VR Mechanics' },
    { id: 'iot', name: 'IoT ESP32 / Sensors' },
    { id: 'mqtt', name: 'MQTT / Serial Comm' },
    { id: 'blender', name: 'Blender 3D Modeling' },
    { id: 'web', name: 'Web Dev (HTML/CSS/JS, PHP)' },
    { id: 'ml', name: 'Machine Learning (Python)' },
    { id: 'git', name: 'Git & Version Control' },
  ];

  const certificatesList = [
    {
      id: 1,
      title: 'Cisco Certified Network Associate (CCNA)',
      issuer: 'Cisco Systems',
      year: '2025',
      credentialId: 'CS-CCNA-2025',
      verifyUrl: '#',
      image: ccnaImg,
      icon: 'terminal',
      description: 'Validation of networking skills including IP routing, network security, switching, subnetting, and network automation tools.'
    },
    {
      id: 2,
      title: "Dean's Honor List Award",
      issuer: 'President University',
      year: '2024',
      credentialId: 'PU-DEAN-2024',
      verifyUrl: '#',
      image: deanImg,
      icon: 'user',
      description: 'Academic excellence award certifying top-ranking GPA and exceptional scholastic performance in Informatics.'
    },
    {
      id: 3,
      title: 'Student Mobility Certificate',
      issuer: 'INTI International University',
      year: '2025',
      credentialId: 'INTI-MOB-2025',
      verifyUrl: '#',
      image: mobilityImg,
      icon: 'link',
      description: 'Certifies participation in the international student mobility exchange program in Malaysia, focusing on CS systems design.'
    }
  ];

  if (loadingStage !== 'done') {
    const isLightOnboarding = theme === 'light';
    const onboardingThemeClass = isLightOnboarding ? 'light-onboarding' : 'dark-onboarding';
    const fadeOutClass = loadingStage === 'fade-out' ? 'fade-out' : '';

    return (
      <>
        <CustomCursor />
        <div className={`onboarding-screen ${onboardingThemeClass} ${fadeOutClass}`}>
          {loadingStage === 'theme-select' ? (
            <div className="theme-select-container">
              <h2 className="mono-text onboarding-title">SELECT_SYSTEM_THEME.CFG</h2>
              <div className="theme-options">
                <div className="theme-option-col">
                  <DotMatrixIcon name="moon" size="36px" className="onboarding-theme-icon moon-icon" />
                  <button
                    className="btn btn-outline theme-opt-btn"
                    onClick={() => selectInitialTheme('dark')}
                  >
                    [ DARK_MODE ]
                  </button>
                </div>
                <div className="theme-option-col">
                  <DotMatrixIcon name="sun" size="36px" className="onboarding-theme-icon sun-icon" />
                  <button
                    className="btn btn-outline theme-opt-btn"
                    onClick={() => selectInitialTheme('light')}
                  >
                    [ LIGHT_MODE ]
                  </button>
                </div>
              </div>
              <div className="onboarding-brand mono-text">Muhammad Zahid Setiansyah // V1.0</div>
            </div>
          ) : (
            <div className="welcome-container">
              <h1 className="display-text welcome-header">{welcomeText}</h1>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <div className="app-container app-wrapper">
        {/* 1. Header Area */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="display-text" style={{ fontSize: '20px', letterSpacing: '0.05em' }}>
              E-PORTFOLIO
            </span>
            <span style={{ color: 'var(--line-2)' }}>|</span>
            <div className="header-status">
              <span className={`state-dot ${appStatus}`} />
              <span className="mono-text" style={{ color: 'var(--secondary)' }}>
                STATUS: {appStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Live Widget & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Live Dot Clock */}
            <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--f-mono)' }}>
              <span className="step-number" style={{ fontSize: '18px' }}>{hr}</span>
              <span className="colon"></span>
              <span className="step-number" style={{ fontSize: '18px' }}>{min}</span>
              <span className="colon"></span>
              <span className="step-number" style={{ fontSize: '18px' }}>{sec}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono-text" style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                {theme === 'dark' ? 'DARK_MODE' : 'LIGHT_MODE'}
              </span>
              <label className="switch" aria-label="Toggle Theme switch">
                <input type="checkbox" checked={theme === 'light'} onChange={toggleTheme} />
                <span className="slider-knob"></span>
              </label>
            </div>
          </div>
        </header>

        {/* 2. Hero Section */}
        <section className="hero-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="mono-text" style={{ fontSize: '11px', color: 'var(--secondary)', display: 'block', marginBottom: '8px' }}>
                PROFILE // UNITY GAME DEVELOPER & VR-IOT INTEGRATOR
              </span>
              <h1 className="hero-title-main">
                IMMERSIVE PLAY.<br />
                INTERACTIVE SYSTEMS.
              </h1>
              <p className="hero-subtitle">
                Informatics student specializing in Unity VR development and IoT integrations. Experienced in player controllers, grabbable medical toolkits, and MQTT hardware-software pipelines.
              </p>
            </div>

            {/* Large Hero Year */}
            <div style={{ textAlign: 'right' }}>
              <span className="display-text" style={{ fontSize: '64px', lineHeight: '0.9', display: 'block' }}>
                3.80
              </span>
              <span className="mono-text" style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                INFORMATICS_GPA
              </span>
            </div>
          </div>

          <blockquote className="brand-quote editorial-text">
            "Like a precision instrument: black and white as the base, information first, the accent lighting up only for the single most important thing."
          </blockquote>
        </section>

        <div className="section-divider"></div>

        {/* 2.5. About Me Section */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
            <h2 className="mono-text" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>
              ABOUT_ME.TXT // PROFILE & TECH STACK
            </h2>
            <span className="mono-text" style={{ fontSize: '11px', color: 'var(--secondary)' }}>
              ROLE: FULL-STACK XR / IOT
            </span>
          </div>

          <div className="about-grid-layout">
            {/* Left: Bio card */}
            <div className="glass-card about-bio-card">
              <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                Hi, I'm <strong>Muhammad Zahid Setiansyah</strong>, an Informatics student specializing in Unity VR development and IoT integrations. I bridge the gap between virtual worlds and physical systems by designing immersive user interfaces, custom physics-based player controllers, and hardware-software telemetry pipelines.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--secondary)', lineHeight: '1.6', margin: 0 }}>
                My focus is on creating developer tools and medical simulation systems that feel responsive and precise. I enjoy translating complex interactive systems into clean, industrial designs with rich visual feedback.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <a href={cvPdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  VIEW_CV.PDF
                  <DotMatrixIcon name="arrowRight" size="14px" style={{ color: 'inherit' }} />
                </a>
                <button onClick={scrollToProjects} className="btn btn-outline">
                  SEE_PROJECTS
                </button>
              </div>
            </div>

            {/* Right: Tech Stack card */}
            <div className="glass-card about-tech-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '10px', marginBottom: '20px' }}>
                <h3 className="mono-text" style={{ fontSize: '12px', color: 'var(--secondary)', margin: 0 }}>
                  CORE_TECH_STACK.CFG
                </h3>
                <span className="mono-text" style={{ fontSize: '10px', color: 'var(--accent-text)' }}>[USER_CAM.DLL]</span>
              </div>

              {/* Interactive Dot-Matrix Profile Photo */}
              <div className="pixel-photo-container">
                <img src={aboutMeImg} alt="Muhammad Zahid Setiansyah" className="about-photo" />
                <div className="dot-matrix-overlay"></div>
              </div>

              <div className="tech-stack-grid">
                {/* Row 1 */}
                <div className="tech-stack-item" title="UNITY">
                  <DotMatrixIcon name="unity" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="C#">
                  <DotMatrixIcon name="csharp" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="BLENDER">
                  <DotMatrixIcon name="blender" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="PYTHON">
                  <DotMatrixIcon name="python" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="GIT">
                  <DotMatrixIcon name="git" size="32px" className="tech-icon" />
                </div>

                {/* Row 2 */}
                <div className="tech-stack-item" title="GITHUB">
                  <DotMatrixIcon name="github" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="TENSORFLOW">
                  <DotMatrixIcon name="tensorflow" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="MQTT">
                  <DotMatrixIcon name="mqtt" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="ESP32">
                  <DotMatrixIcon name="esp32" size="32px" className="tech-icon" />
                </div>
                <div className="tech-stack-item" title="VR HEADSET">
                  <DotMatrixIcon name="vr" size="32px" className="tech-icon" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* 3. More Activity Section */}
        <section style={{ marginBottom: '64px' }}>
          <h2 className="mono-text" style={{ fontSize: '14px', letterSpacing: '0.08em', marginBottom: '24px' }}>
            MORE_ACTIVITY.PDF // SOCIAL PROJECTS, TEACHING & WORKSHOPS
          </h2>
          <ActivityLog />
        </section>

        <div className="section-divider"></div>

        {/* 4. Projects Section */}
        <section id="projects-section" style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
            <h2 className="mono-text" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>
              PROJECTS.TXT
            </h2>
            <span className="mono-text" style={{ fontSize: '11px', color: 'var(--secondary)' }}>
              TOTAL: <span className="step-number" style={{ fontSize: '14px' }}>06</span> ACTIVE
            </span>
          </div>

          <div className="projects-container">
            {/* Project 1 */}
            <div className="glass-card project-card">
              <div className="project-header">
                <h3 className="project-title">MedScan VR</h3>
                <DotMatrixIcon name="vr" size="20px" style={{ color: 'var(--secondary)' }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', minHeight: '63px' }}>
                Hospital Triage VR Simulation Game. Integrated Unity VR controllers, custom grabbable tools, and MQTT sensor telemetry.
              </p>
              <div className="project-tech">
                <span className="tech-tag">UNITY VR</span>
                <span className="tech-tag">C#</span>
                <span className="tech-tag">ESP32</span>
                <span className="tech-tag">MQTT</span>
              </div>
              <div className="project-stat">
                <SegmentedBar value={100} label="TESTS PASSED" limit={85} />
              </div>
            </div>

            {/* Project 2 */}
            <div className="glass-card project-card">
              <div className="project-header">
                <h3 className="project-title">MBG Driver</h3>
                <DotMatrixIcon name="car" size="20px" style={{ color: 'var(--secondary)' }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', minHeight: '63px' }}>
                Low-Poly Arcade delivery game. Features a vehicle controller, delivery timers, and dynamic narrative consequences.
              </p>
              <div className="project-tech">
                <span className="tech-tag">UNITY 3D</span>
                <span className="tech-tag">C#</span>
                <span className="tech-tag">LOW-POLY</span>
                <span className="tech-tag">DEVLOG</span>
              </div>
              <div className="project-stat">
                <SegmentedBar value={70} label="STAGES COMPLETE" limit={85} />
              </div>
            </div>

            {/* Project 3 */}
            <div className="glass-card project-card">
              <div className="project-header">
                <h3 className="project-title">RISE (Rayhan Information System Education)</h3>
                <DotMatrixIcon name="terminal" size="20px" style={{ color: 'var(--secondary)' }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', minHeight: '63px' }}>
                Administrative school RISE (Rayhan Information System Education)ing student, teacher, and class workflows, built alongside CS tutoring.
              </p>
              <div className="project-tech">
                <span className="tech-tag">PHP</span>
                <span className="tech-tag">HTML</span>
                <span className="tech-tag">CSS</span>
                <span className="tech-tag">JS</span>
              </div>
              <div className="project-stat">
                <SegmentedBar value={100} label="INTEGRATION" limit={85} />
              </div>
            </div>

            {/* Project 4 */}
            <div className="glass-card project-card">
              <div className="project-header">
                <h3 className="project-title">Smart-Triage</h3>
                <DotMatrixIcon name="health" size="20px" style={{ color: 'var(--secondary)' }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', minHeight: '63px' }}>
                Hospital triage clinical decision support. Calculates MEOWS scores using integrated AI and role-based portals (Admin, Nurse, Doctor).
              </p>
              <div className="project-tech">
                <span className="tech-tag">REACT</span>
                <span className="tech-tag">FASTAPI</span>
                <span className="tech-tag">SUPABASE</span>
                <span className="tech-tag">BOOTSTRAP</span>
              </div>
              <div className="project-stat">
                <SegmentedBar value={100} label="SYSTEM INTEGRATED" limit={85} />
              </div>
            </div>

            {/* Project 5: CNN vs Statistical Learning Paper */}
            <a
              href={paper1Pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card project-card project-link-card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
              <div className="project-header">
                <h3 className="project-title">CNN vs Statistical Models</h3>
                <DotMatrixIcon name="paper" size="20px" style={{ color: 'var(--secondary)' }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', minHeight: '63px' }}>
                Comparative research paper evaluating classical statistical learning models against deep learning Convolutional Neural Networks (CNNs).
              </p>
              <div className="project-tech">
                <span className="tech-tag">PYTHON</span>
                <span className="tech-tag">TENSORFLOW</span>
                <span className="tech-tag">CNN</span>
                <span className="tech-tag">ML_PAPER</span>
              </div>
              <div className="project-stat">
                <SegmentedBar value={100} label="UNIVERSITY RESEARCH" limit={85} />
              </div>
            </a>

            {/* Project 6: Return-Cancellation Risk Paper */}
            <a
              href={paper2Pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card project-card project-link-card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
              <div className="project-header">
                <h3 className="project-title">Return-Cancellation Risk</h3>
                <DotMatrixIcon name="paper" size="20px" style={{ color: 'var(--secondary)' }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', minHeight: '63px' }}>
                Machine learning research paper analyzing and predicting return-cancellation risks using statistical models and classifiers.
              </p>
              <div className="project-tech">
                <span className="tech-tag">PYTHON</span>
                <span className="tech-tag">SCIKIT-LEARN</span>
                <span className="tech-tag">PANDAS</span>
                <span className="tech-tag">RISK_PAPER</span>
              </div>
              <div className="project-stat">
                <SegmentedBar value={100} label="UNIVERSITY RESEARCH" limit={85} />
              </div>
            </a>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* 5. Experience / Education Section */}
        <section style={{ marginBottom: '64px' }}>
          <h2 className="mono-text" style={{ fontSize: '14px', letterSpacing: '0.08em', marginBottom: '24px' }}>
            TIMELINE.MD // ACADEMIC & PROFESSIONAL HISTORY
          </h2>
          <div className="glass-card" style={{ padding: '8px 0', overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>PERIOD</th>
                  <th>ROLE / PROGRAM</th>
                  <th>ORGANIZATION / INSTITUTION</th>
                  <th className="num">GPA / REF</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024 - PRESENT</td>
                  <td>BACHELOR OF INFORMATICS (AI FOR HEALTHCARE)</td>
                  <td>PRESIDENT UNIVERSITY</td>
                  <td className="num">3.80</td>
                </tr>
                <tr>
                  <td>2025 (AUG - DEC)</td>
                  <td>EXCHANGE PROGRAM (COMPUTER SCIENCE)</td>
                  <td>INTI INTERNATIONAL UNIVERSITY, MALAYSIA</td>
                  <td className="num">3.72</td>
                </tr>
                <tr>
                  <td>2025 (FEB - MAY)</td>
                  <td>WEB DEVELOPER (ENTREPRENEURSHIP PROJECT)</td>
                  <td>BENERINAJA.MY.ID (LAPTOP REPAIR SERVICE)</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td>2025 (JAN - APR)</td>
                  <td>COMPUTER TEACHER & WEB DEVELOPER (PART-TIME)</td>
                  <td>SMP PLUS RAYHAN, CIKARANG</td>
                  <td className="num">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* 6. Skills Section */}
        <section style={{ marginBottom: '64px' }}>
          <h2 className="mono-text" style={{ fontSize: '14px', letterSpacing: '0.08em', marginBottom: '16px' }}>
            COMPETENCIES.DLL
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '20px' }}>
            Click tags to activate/invert control states and dynamically toggle skill parameters.
          </p>
          <div className="skills-container">
            {skillsList.map((skill) => (
              <button
                key={skill.id}
                className={`chip ${activeSkills.has(skill.id) ? 'active' : ''}`}
                onClick={() => toggleSkill(skill.id)}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </section>

        <div className="section-divider"></div>

        {/* 6.5. Certificates Section */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
            <h2 className="mono-text" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>
              CERTIFICATES.DAT
            </h2>
            <span className="mono-text" style={{ fontSize: '11px', color: 'var(--secondary)' }}>
              TOTAL: <span className="step-number" style={{ fontSize: '14px' }}>03</span> VERIFIED
            </span>
          </div>

          <div className="projects-container">
            {certificatesList.map((cert) => (
              <div key={cert.id} className="glass-card project-card">
                <div className="project-header">
                  <span className="mono-text" style={{ fontSize: '10px', color: 'var(--accent-text)' }}>[VERIFIED]</span>
                  <DotMatrixIcon name={cert.icon} size="20px" style={{ color: 'var(--secondary)' }} />
                </div>

                <div className="certificate-img-container">
                  <img src={cert.image} alt={cert.title} className="certificate-thumbnail" />
                </div>

                <h3 className="project-title" style={{ fontSize: '18px', marginTop: '12px', minHeight: '44px' }}>
                  {cert.title}
                </h3>
                <p style={{ fontSize: '11px', fontFamily: 'var(--f-mono)', color: 'var(--secondary)', textTransform: 'uppercase', margin: '4px 0 12px 0' }}>
                  {cert.issuer} // {cert.year}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', minHeight: '63px' }}>
                  {cert.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: 'auto' }}>
                  <span className="mono-text" style={{ fontSize: '10px', color: 'var(--muted)' }}>
                    ID: {cert.credentialId}
                  </span>
                  <a href={cert.verifyUrl} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '9px', textDecoration: 'none' }}>
                    VERIFY_SIGN
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider"></div>

        {/* 7. Contact / Inbox Section */}
        <section className="contact-section">
          <div>
            <h2 className="mono-text" style={{ fontSize: '14px', letterSpacing: '0.08em', marginBottom: '16px' }}>
              INBOX_COMMUNICATION.SH
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '24px' }}>
              Submit a message directly to trigger the system's state machine. Valid logs will trigger a state transition to [DONE].
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--f-mono)', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <DotMatrixIcon name="envelope" size="18px" />
                <span>mhmdzahids@gmail.com</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <DotMatrixIcon name="link" size="18px" />
                <span>linkedin.com/in/muhammad-zahid-setiansyah</span>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <form onSubmit={handleFormSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="name">NAME / SENDER</label>
                <input
                  id="name"
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="E.G. GUEST DEVELOPER"
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="email">EMAIL / ADDRESS</label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="E.G. CONTACT@DOMAIN.COM"
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="message">MESSAGE / DISPATCH</label>
                <textarea
                  id="message"
                  className="input-field"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="ENTER INQUIRY DETAILS HERE..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Error Message */}
              {formError && (
                <div style={{ marginBottom: '16px' }}>
                  <span className="state-dot error" style={{ marginRight: '6px' }}></span>
                  <span className="input-error-msg">{formError}</span>
                </div>
              )}

              {/* Success Message */}
              {formSuccess && (
                <div style={{ marginBottom: '16px', color: 'var(--success)', fontFamily: 'var(--f-mono)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <span className="state-dot done" style={{ backgroundColor: 'var(--success)', marginRight: '6px' }}></span>
                  [MESSAGE DISPATCHED SUCCESSFULLY]
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  DISPATCH_SIGNAL
                  <DotMatrixIcon name="arrowRight" size="14px" style={{ color: 'inherit' }} />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p style={{ marginBottom: '8px' }}>MUHAMMAD ZAHID SETIANSYAH // KABUPATEN BEKASI // TIMESTAMP: {formattedDate}</p>
          <p style={{ color: 'var(--muted)', fontSize: '10px' }}>
            BUILT ACCORDING TO SPECS_V1.0. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </>
  );
}
