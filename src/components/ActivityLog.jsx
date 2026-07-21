import { useState, useEffect, useRef } from 'react';
import './ActivityLog.css';

import teachingImg from '../assets/activities/teaching.jpg';
import socialProjectImg from '../assets/activities/social-project.JPG';
import exchangeImg from '../assets/activities/exchange.jpeg';
import articleImg from '../assets/activities/article.png';

export default function ActivityLog() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoSlideTimer = useRef(null);

  const activities = [
    {
      id: 1,
      title: 'Computer Teacher (Deepfake & AI)',
      organization: 'SMP PLUS RAYHAN',
      role: 'IT EDUCATOR',
      location: 'CIKARANG',
      image: teachingImg,
      description: 'Showing how deepfakes work, their inner mechanics, and what they can be used for (both constructive and risk potentials).'
    },
    {
      id: 2,
      title: 'Is It Real or AI? – Raising Awareness',
      organization: 'DIGITAL LITERACY CAMPAIGN',
      role: 'CAMPAIGN LEADER',
      location: 'BEKASI',
      image: socialProjectImg,
      description: 'Educating students about AI-generated hoaxes, teaching them how to differentiate between AI-generated and real content.'
    },
    {
      id: 3,
      title: 'INTI Student Mobility Exchange',
      organization: 'INTI INTERNATIONAL UNIVERSITY',
      role: 'EXCHANGE REPRESENTATIVE',
      location: 'MALAYSIA',
      image: exchangeImg,
      description: 'Participating in cultural exchange events representing President University at INTI International University, Malaysia.'
    },
    {
      id: 4,
      title: 'TikTok Focus Research Publicity',
      organization: 'GNFI & KOMPASIANA',
      role: 'RESEARCH AUTHOR',
      location: 'ONLINE',
      image: articleImg,
      description: 'Published articles discussing my AI-based research on resolving student focus issues caused by continuous TikTok scrolling.',
      links: [
        { label: 'READ_GNFI', url: 'https://www.goodnewsfromindonesia.id/2026/05/29/scroll-tiktok-terus-menerus-bisa-pengaruhi-fokus-mahasiswa-ini-cari-solusinya-dengan-ai' },
        { label: 'READ_KOMPASIANA', url: 'https://www.kompasiana.com/bellazakiyah5221/6a157ca1ed64151ae66ca1b3/tiktok-reels-bikin-gen-z-sulit-fokus-mahasiswa-president-university-punya-jawabannya' }
      ]
    }
  ];

  // Start the auto-slide timer
  const startTimer = () => {
    stopTimer();
    autoSlideTimer.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activities.length);
    }, 4000); // Change image every 4 seconds
  };

  // Stop the auto-slide timer
  const stopTimer = () => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (activeIndex === displayIndex) return;

    setIsAnimating(true);

    const imageSwitchTimeout = setTimeout(() => {
      setDisplayIndex(activeIndex);
    }, 500);

    const animEndTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, 980);

    return () => {
      clearTimeout(imageSwitchTimeout);
      clearTimeout(animEndTimeout);
    };
  }, [activeIndex]);

  const handleSelectSlide = (index) => {
    if (isAnimating) return;
    setActiveIndex(index);
    startTimer(); // Reset timer on manual action
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev - 1 + activities.length) % activities.length);
    startTimer();
  };

  const handleNext = () => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev + 1) % activities.length);
    startTimer();
  };

  const currentActivity = activities[activeIndex];
  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className="activity-grid-layout">
      {/* Left side: Card with info */}
      <div className="glass-card activity-info-card">
        <div className="activity-card-header">
          <span className="mono-text caption-index">[{pad(activeIndex + 1)}/{pad(activities.length)}]</span>
          <span className="mono-text card-type">ACTIVITY_LOG</span>
        </div>
        
        <div className="activity-card-body">
          <h3 className="activity-title">{currentActivity.title.toUpperCase()}</h3>
          <p className="activity-organization">{currentActivity.organization.toUpperCase()}</p>
          <p className="activity-description" style={{ fontSize: '12px', color: 'var(--secondary)', lineHeight: '1.5', margin: '0 0 16px 0', textTransform: 'uppercase', fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' }}>
            {currentActivity.description.toUpperCase()}
          </p>

          {currentActivity.links && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '0 0 16px 0' }}>
              {currentActivity.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '9px', textDecoration: 'none' }}
                >
                  {link.label}
                  <span style={{ fontSize: '7px', marginLeft: '4px' }}>[↗]</span>
                </a>
              ))}
            </div>
          )}
          
          <div className="activity-meta-grid">
            <div className="meta-item">
              <span className="meta-label">ROLE</span>
              <span className="meta-value">{currentActivity.role.toUpperCase()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">LOCATION</span>
              <span className="meta-value">{currentActivity.location.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="activity-card-footer">
          {/* Navigation Controls */}
          <div className="activity-nav-buttons">
            <button className="btn btn-outline nav-btn" onClick={handlePrev} aria-label="Previous Activity">
              [◀] PREV
            </button>
            <button className="btn btn-outline nav-btn" onClick={handleNext} aria-label="Next Activity">
              NEXT [▶]
            </button>
          </div>

          {/* Dash Indicators */}
          <div className="activity-slider-dots">
            {activities.map((_, index) => (
              <button
                key={index}
                className={`slider-dash-btn ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelectSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Image Viewport */}
      <div className="activity-image-viewport">
        {activities.map((act, index) => (
          <img
            key={act.id}
            src={act.image}
            alt={act.title}
            className={`activity-slider-img ${index === displayIndex ? 'active' : ''}`}
          />
        ))}

        {/* Matrix Transition Overlay */}
        {isAnimating && (
          <div className="matrix-transition-overlay">
            {Array.from({ length: 100 }).map((_, i) => {
              const delay = ((i * 17) % 20) * 10; // Stable pseudo-random delay between 0ms and 190ms
              return (
                <div
                  key={i}
                  className="matrix-cell"
                  style={{
                    animationDelay: `${delay}ms`,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
