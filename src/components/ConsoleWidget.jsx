import { useState, useRef, useEffect } from 'react';

const BOOT_TEXT = [
  'NOTHING OS [v2.5.0-ZAHID]',
  'SYSTEM STATUS: RUNNING (100% SECURE)',
  'DATETIME: ' + new Date().toISOString().replace('T', ' ').substring(0, 19),
  'TYPE "help" FOR A LIST OF AVAILABLE COMMANDS.',
  ''
];

const COMMANDS = {
  help: [
    'AVAILABLE COMMANDS:',
    '  about     - Display portfolio overview & introduction',
    '  projects  - List highlight portfolio projects',
    '  skills    - List core programming and tools competencies',
    '  contact   - Display communication options',
    '  clear     - Clear the console logs'
  ],
  about: [
    'ABOUT MUHAMMAD ZAHID SETIANSYAH:',
    '  Informatics student specializing in Unity game development and interactive systems.',
    '  Experienced in building VR simulations and integrating IoT hardware (ESP32) into real-time gameplay.',
    '  Alumnus of the INTI International University exchange program (Malaysia) and Dean\'s Honor Roll recipient.',
    '  Currently developing an original low-poly arcade game (MBG Driver) as a personal project.'
  ],
  projects: [
    'PROJECT HIGHLIGHTS:',
    '  1. MBG DRIVER    - Low-poly arcade delivery game (70% Stages Complete)',
    '  2. ATTN GUARD    - Android passive behavioral sensing wellbeing system (In Progress)',
    '  3. MEDSCAN VR    - Hospital Triage VR simulation with ESP32 & MQTT',
    '  4. SMART TRIAGE - Clinical support system calculating MEOWS scores using AI',
    '  5. RISE SCHOOL   - Administrative system managing school student/teacher workflows'
  ],
  skills: [
    'TECHNICAL SKILLS:',
    '  GAME DEV  : Unity (VR, XR Interaction Toolkit), C# Scripting, Blender',
    '  SYSTEMS   : IoT ESP32, MQTT/Serial, Web (HTML/CSS/JS, PHP, Bootstrap)',
    '  DATA/ML   : Python, Java, SQL, Apache Spark, Scikit-learn',
    '  VERSION   : Git, GitHub, Unity Version Control'
  ],
  contact: [
    'CONTACT INFO:',
    '  EMAIL     - mhmdzahids@gmail.com',
    '  LINKEDIN  - linkedin.com/in/muhammad-zahid-setiansyah',
    '  LOCATION  - Kabupaten Bekasi, West Java'
  ]
};

export default function ConsoleWidget() {
  const [history, setHistory] = useState(BOOT_TEXT);
  const [inputValue, setInputValue] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = inputValue.trim().toLowerCase();
      const newHistory = [...history, `guest@portfolio:~$ ${inputValue}`];

      if (command === 'clear') {
        setHistory([]);
      } else if (command === '') {
        setHistory(newHistory);
      } else if (COMMANDS[command]) {
        setHistory([...newHistory, ...COMMANDS[command], '']);
      } else {
        setHistory([
          ...newHistory,
          `command not found: "${command}". Type "help" for a list of commands.`,
          ''
        ]);
      }

      setInputValue('');
    }
  };

  return (
    <div className="console-panel">
      <div className="console-header">
        <span>CONSOLE.EXE</span>
        <span className="state-dot running" style={{ width: '6px', height: '6px', marginRight: 0 }}></span>
      </div>
      <div className="console-body" ref={bodyRef}>
        {history.map((line, idx) => (
          <div key={idx} className="console-line">
            {line}
          </div>
        ))}
        <div className="console-input-row">
          <span className="console-prompt">guest@portfolio:~$</span>
          <input
            type="text"
            className="console-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type 'help'..."
            aria-label="Console command prompt"
          />
        </div>
      </div>
    </div>
  );
}
