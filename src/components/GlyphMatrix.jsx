import { useState, useEffect, useRef } from 'react';

// Grid size 25x25
const GRID_SIZE = 25;
const CENTER = 12;

// Check if a coordinate is outside the circular physical boundary
const isOutsideCircle = (x, y) => {
  const dx = x - CENTER;
  const dy = y - CENTER;
  // Radius of 12.5 pixels (squared is 156.25)
  return dx * dx + dy * dy > 156;
};

// G-shape glyph coordinate lookup
const getGPattern = () => {
  const lit = new Set();
  // Draw G shape on 25x25
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (isOutsideCircle(x, y)) continue;

      const dx = x - CENTER;
      const dy = y - CENTER;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // outer circle arc (left, top, bottom)
      if (dist >= 10 && dist <= 12 && (dx < 0 || dy < 0 || (dy > 0 && dx < 6))) {
        lit.add(`${x},${y}`);
      }
      // inner circle bar for G
      if (dy === 0 && dx >= 0 && dx <= 8) {
        lit.add(`${x},${y}`);
      }
      // vertical right bar for G
      if (dx === 8 && dy >= 0 && dy <= 6) {
        lit.add(`${x},${y}`);
      }
    }
  }
  return lit;
};

export default function GlyphMatrix() {
  const [litLEDs, setLitLEDs] = useState(new Set());
  const [signalLEDs, setSignalLEDs] = useState(new Set());
  const [activePreset, setActivePreset] = useState('none');
  const animationRef = useRef(null);

  // Clear all lit LEDs
  const clearGrid = () => {
    stopAnimation();
    setLitLEDs(new Set());
    setSignalLEDs(new Set());
    setActivePreset('none');
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  };

  // Toggle individual LED state on click
  const handleLedClick = (x, y) => {
    if (isOutsideCircle(x, y)) return;
    stopAnimation();
    setActivePreset('custom');

    const key = `${x},${y}`;
    setLitLEDs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Trigger preset animations
  const triggerPreset = (preset) => {
    clearGrid();
    setActivePreset(preset);

    if (preset === 'g-logo') {
      setLitLEDs(getGPattern());
    } else if (preset === 'ripple') {
      let step = 0;
      animationRef.current = setInterval(() => {
        const nextLit = new Set();
        const nextSignal = new Set();

        for (let x = 0; x < GRID_SIZE; x++) {
          for (let y = 0; y < GRID_SIZE; y++) {
            if (isOutsideCircle(x, y)) continue;
            const dx = x - CENTER;
            const dy = y - CENTER;
            const dist = Math.round(Math.sqrt(dx * dx + dy * dy));

            // Expanding ring
            if (dist === step % 14) {
              nextLit.add(`${x},${y}`);
            }
            // Signal center red dot
            if (x === CENTER && y === CENTER && (step % 2 === 0)) {
              nextSignal.add(`${x},${y}`);
            }
          }
        }
        setLitLEDs(nextLit);
        setSignalLEDs(nextSignal);
        step++;
      }, 150);
    } else if (preset === 'progress') {
      let angleStep = 0;
      animationRef.current = setInterval(() => {
        const nextLit = new Set();
        for (let x = 0; x < GRID_SIZE; x++) {
          for (let y = 0; y < GRID_SIZE; y++) {
            if (isOutsideCircle(x, y)) continue;

            const dx = x - CENTER;
            const dy = y - CENTER;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Calculate angle relative to top (12 o'clock)
            let angle = Math.atan2(dx, -dy) * (180 / Math.PI); // -180 to 180
            if (angle < 0) angle += 360;

            // Light up based on progress angle and outer ring
            if (dist >= 10 && dist <= 12 && angle <= angleStep) {
              nextLit.add(`${x},${y}`);
            }
          }
        }
        setLitLEDs(nextLit);
        angleStep += 15;
        if (angleStep > 360) {
          angleStep = 0;
        }
      }, 100);
    } else if (preset === 'signal') {
      // Pulsing alert signal
      let flash = true;
      animationRef.current = setInterval(() => {
        const nextLit = new Set();
        const nextSignal = new Set();

        if (flash) {
          // Central red cross alert
          for (let i = -2; i <= 2; i++) {
            nextSignal.add(`${CENTER + i},${CENTER}`);
            nextSignal.add(`${CENTER},${CENTER + i}`);
          }
          // Outer circular glow
          for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
              if (isOutsideCircle(x, y)) continue;
              const dx = x - CENTER;
              const dy = y - CENTER;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist >= 11 && dist <= 12) {
                nextLit.add(`${x},${y}`);
              }
            }
          }
        }
        setLitLEDs(nextLit);
        setSignalLEDs(nextSignal);
        flash = !flash;
      }, 500);
    }
  };

  // Clean animation loop on unmount
  useEffect(() => {
    return () => stopAnimation();
  }, []);

  // Generate 25x25 grid DOM
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const disabled = isOutsideCircle(x, y);
      const key = `${x},${y}`;
      const isLit = litLEDs.has(key);
      const isSignal = signalLEDs.has(key);

      cells.push(
        <div
          key={key}
          className={`glyph-led ${disabled ? 'disabled' : ''} ${isLit ? 'lit' : ''} ${isSignal ? 'signal' : ''}`}
          onClick={() => handleLedClick(x, y)}
          title={disabled ? undefined : `LED (${x}, ${y})`}
        />
      );
    }
  }

  return (
    <div className="glass-card glyph-panel">
      <div className="glyph-title-row">
        <span>GLYPH_INTERFACE.BIN</span>
        <span>PRESET: {activePreset.toUpperCase()}</span>
      </div>

      <div className="glyph-grid">
        {cells}
      </div>

      <div className="glyph-controls">
        <button
          className={`btn btn-outline ${activePreset === 'g-logo' ? 'active' : ''}`}
          style={{ padding: '6px 10px', fontSize: '10px' }}
          onClick={() => triggerPreset('g-logo')}
        >
          G-LOGO
        </button>
        <button
          className={`btn btn-outline ${activePreset === 'ripple' ? 'active' : ''}`}
          style={{ padding: '6px 10px', fontSize: '10px' }}
          onClick={() => triggerPreset('ripple')}
        >
          RIPPLE
        </button>
        <button
          className={`btn btn-outline ${activePreset === 'progress' ? 'active' : ''}`}
          style={{ padding: '6px 10px', fontSize: '10px' }}
          onClick={() => triggerPreset('progress')}
        >
          LOADER
        </button>
        <button
          className={`btn btn-outline ${activePreset === 'signal' ? 'active' : ''}`}
          style={{ padding: '6px 10px', fontSize: '10px' }}
          onClick={() => triggerPreset('signal')}
        >
          SIGNAL
        </button>
        <button
          className="btn btn-outline"
          style={{ padding: '6px 10px', fontSize: '10px', color: 'var(--accent-text)', borderColor: 'var(--line-2)' }}
          onClick={clearGrid}
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}
