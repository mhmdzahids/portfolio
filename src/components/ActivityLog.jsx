import { useState, useEffect, useRef, useCallback } from 'react';
import './ActivityLog.css';

import teachingImg from '../assets/activities/teaching.jpg';
import socialProjectImg from '../assets/activities/social-project.JPG';
import exchangeImg from '../assets/activities/exchange.jpeg';
import articleImg from '../assets/activities/article.png';

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

// Helper to draw cover-fit image on canvas
const drawImageCover = (ctx, img, width, height) => {
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;
  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgRatio > canvasRatio) {
    sWidth = img.height * canvasRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / canvasRatio;
    sy = (img.height - sHeight) / 2;
  }
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
};

export default function ActivityLog() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const canvasRef = useRef(null);
  const loadedImages = useRef([]);
  const luminanceGrids = useRef([]);
  const animationFrameId = useRef(null);

  // Pre-load all images & compute luminance maps
  useEffect(() => {
    let active = true;
    const loadAllImages = async () => {
      try {
        const loadImg = (src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
          });
        };

        const imgs = await Promise.all(
          activities.map((act) => loadImg(act.image))
        );

        if (!active) return;

        const grids = imgs.map((img) => {
          const offCanvas = document.createElement('canvas');
          offCanvas.width = 1280;
          offCanvas.height = 720;
          const offCtx = offCanvas.getContext('2d');
          
          drawImageCover(offCtx, img, 1280, 720);
          
          const imgData = offCtx.getImageData(0, 0, 1280, 720).data;
          const gridW = 128;
          const gridH = 72;
          const grid = new Float32Array(gridW * gridH);
          
          for (let row = 0; row < gridH; row++) {
            for (let col = 0; col < gridW; col++) {
              const x = col * 10 + 5;
              const y = row * 10 + 5;
              const idx = (y * 1280 + x) * 4;
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];
              // Luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255
              grid[row * gridW + col] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            }
          }
          return grid;
        });

        if (!active) return;

        loadedImages.current = imgs;
        luminanceGrids.current = grids;
        setImagesLoaded(true);
      } catch (err) {
        console.error('Failed to load images for canvas transition:', err);
      }
    };

    loadAllImages();

    return () => {
      active = false;
    };
  }, []);

  // Frame rendering function
  const renderFrame = useCallback((ctx, imgA, imgB, gridA, gridB, animProgress) => {
    const width = 1280;
    const height = 720;
    const gridW = 128;
    const gridH = 72;
    const cellSize = 10;
    const maxRadius = 5.0; // scales from 0 to Luminance * maxRadius

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (animProgress <= 1.0) {
      // STAGE 1 (0.0 to 1.0) [PIXELLATION]
      const opacityA = 1.0 - animProgress;
      ctx.globalAlpha = opacityA;
      drawImageCover(ctx, imgA, width, height);
      ctx.globalAlpha = 1.0;

      // Growing dot-matrix layer over it
      const t = animProgress;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      for (let row = 0; row < gridH; row++) {
        for (let col = 0; col < gridW; col++) {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          const lumA = gridA[row * gridW + col];
          const r = t * lumA * maxRadius;
          if (r > 0.1) {
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
    } else if (animProgress <= 2.0) {
      // STAGE 2 (1.0 to 2.0) [RADIAL MATRIX WIPE]
      const t = animProgress - 1.0;
      const xCenter = width / 2;
      const yCenter = height / 2;
      const maxDistance = Math.sqrt(xCenter * xCenter + yCenter * yCenter);
      const transitionWidth = 150; // smooth wavefront transition block

      const wavefrontPos = t * (maxDistance + transitionWidth);

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      for (let row = 0; row < gridH; row++) {
        for (let col = 0; col < gridW; col++) {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;

          const dx = x - xCenter;
          const dy = y - yCenter;
          const d = Math.sqrt(dx * dx + dy * dy);

          // Interpolation factor: 0.0 is Image A, 1.0 is Image B
          let k;
          if (d < wavefrontPos - transitionWidth) {
            k = 1.0;
          } else if (d > wavefrontPos) {
            k = 0.0;
          } else {
            k = (wavefrontPos - d) / transitionWidth;
          }

          const lumA = gridA[row * gridW + col];
          const lumB = gridB[row * gridW + col];
          const interpolatedLuminance = (1 - k) * lumA + k * lumB;

          const r = interpolatedLuminance * maxRadius;
          if (r > 0.1) {
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
    } else {
      // STAGE 3 (2.0 to 3.0) [MATERIALIZATION / REVEAL]
      const t = animProgress - 2.0;

      // Fade in Image B
      ctx.globalAlpha = t;
      drawImageCover(ctx, imgB, width, height);
      ctx.globalAlpha = 1.0;

      // Fade out and shrink dot-matrix of Image B
      ctx.fillStyle = `rgba(255, 255, 255, ${1.0 - t})`;
      ctx.beginPath();
      for (let row = 0; row < gridH; row++) {
        for (let col = 0; col < gridW; col++) {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          const lumB = gridB[row * gridW + col];
          const r = (1.0 - t) * lumB * maxRadius;
          if (r > 0.1) {
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
    }
  }, []);

  // Run the linear transition loop
  const triggerTransition = useCallback((fromIdx, toIdx) => {
    if (isTransitioning || !imagesLoaded) return;
    
    setIsTransitioning(true);
    setActiveIndex(toIdx);

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds transition duration
    const fps = 60;
    const fpsInterval = 1000 / fps;
    let lastDrawTime = startTime;

    const imgA = loadedImages.current[fromIdx];
    const imgB = loadedImages.current[toIdx];
    const gridA = luminanceGrids.current[fromIdx];
    const gridB = luminanceGrids.current[toIdx];

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsTransitioning(false);
      return;
    }

    const ctx = canvas.getContext('2d');

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const animProgress = progress * 3.0; // Scale 0.0 to 3.0

      // Only draw if 16.7ms has passed, or it is the final frame
      if (now - lastDrawTime >= fpsInterval || progress === 1.0) {
        lastDrawTime = now;
        renderFrame(ctx, imgA, imgB, gridA, gridB, animProgress);
      }

      if (progress < 1.0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
  }, [imagesLoaded, isTransitioning, renderFrame]);

  // Handle slide auto-rotation with canvas transitions (every 3s)
  useEffect(() => {
    if (isTransitioning || !imagesLoaded) return;

    const timer = setTimeout(() => {
      const nextIdx = (activeIndex + 1) % activities.length;
      triggerTransition(activeIndex, nextIdx);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeIndex, isTransitioning, imagesLoaded, triggerTransition]);

  // Fallback slideshow rotation when canvas images are not fully loaded
  useEffect(() => {
    if (imagesLoaded) return;

    const timer = setTimeout(() => {
      const nextIdx = (activeIndex + 1) % activities.length;
      setActiveIndex(nextIdx);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeIndex, imagesLoaded]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // When inactive and canvas is mounted, draw static cover-fit of the active image
  useEffect(() => {
    if (!isTransitioning && imagesLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = loadedImages.current[activeIndex];
      if (img) {
        ctx.clearRect(0, 0, 1280, 720);
        drawImageCover(ctx, img, 1280, 720);
      }
    }
  }, [activeIndex, imagesLoaded, isTransitioning]);

  const handleSelectSlide = (index) => {
    if (isTransitioning) return;
    if (imagesLoaded) {
      triggerTransition(activeIndex, index);
    } else {
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    const prevIdx = (activeIndex - 1 + activities.length) % activities.length;
    if (imagesLoaded) {
      triggerTransition(activeIndex, prevIdx);
    } else {
      setActiveIndex(prevIdx);
    }
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const nextIdx = (activeIndex + 1) % activities.length;
    if (imagesLoaded) {
      triggerTransition(activeIndex, nextIdx);
    } else {
      setActiveIndex(nextIdx);
    }
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
            <button className="btn btn-outline nav-btn" onClick={handlePrev} disabled={isTransitioning} aria-label="Previous Activity">
              [◀] PREV
            </button>
            <button className="btn btn-outline nav-btn" onClick={handleNext} disabled={isTransitioning} aria-label="Next Activity">
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
                disabled={isTransitioning}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Image Viewport */}
      <div className="activity-image-viewport">
        {imagesLoaded ? (
          <canvas
            ref={canvasRef}
            className="activity-transition-canvas"
            width={1280}
            height={720}
          />
        ) : (
          <>
            {activities.map((act, index) => (
              <img
                key={act.id}
                src={act.image}
                alt={act.title}
                className={`activity-slider-img ${index === activeIndex ? 'active' : ''}`}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
