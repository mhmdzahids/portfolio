import { useState } from 'react';
import './SmartTriage.css';
import DotMatrixIcon from './DotMatrixIcon';

export default function SmartTriage({ onClose }) {
  // Active role tab: 'admin' | 'nurse' | 'doctor'
  const [activeTab, setActiveTab] = useState('admin');

  // Unified patient records (simulating our database)
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Sarah Jenkins',
      age: 29,
      gender: 'Female',
      mrn: 'MRN-88219',
      checkInTime: '10:15 AM',
      status: 'diagnosed',
      vitals: { temp: 38.2, hr: 105, rr: 19, bp: 122, spo2: 97, avpu: 'A' },
      triageResult: { 
        score: 5, 
        risk: 'high', 
        reason: 'CRITICAL STATE DETECTED: HIGH FEVER (38.2°C) AND TACHYCARDIA (105 BPM). MEOWS THRESHOLD EXCEEDED.' 
      },
      diagnosis: {
        disease: 'Maternal Sepsis secondary to UTI',
        notes: 'Flagged as HIGH RISK by MEOWS alert. Initiated immediate IV fluids and started empiric antibiotic therapy. Order blood cultures.',
        prescription: 'Ceftriaxone 2g IV q24h, IV Normal Saline 1L',
        doctorName: 'Dr. Evelyn Carter',
        timestamp: '10:45 AM'
      }
    },
    {
      id: 2,
      name: 'Emily Taylor',
      age: 32,
      gender: 'Female',
      mrn: 'MRN-90142',
      checkInTime: '10:30 AM',
      status: 'triaged',
      vitals: { temp: 37.6, hr: 88, rr: 22, bp: 142, spo2: 96, avpu: 'A' },
      triageResult: { 
        score: 4, 
        risk: 'medium', 
        reason: 'MODERATE RISK DETECTED: RESPIRATORY RATE OF 22 BR/MIN AND ELEVATED SYSTOLIC BP (142 MMHG). ESCALATED FOR CLINICAL REVIEW.' 
      },
      diagnosis: null
    },
    {
      id: 3,
      name: 'Chloe Smith',
      age: 27,
      gender: 'Female',
      mrn: 'MRN-64210',
      checkInTime: '10:42 AM',
      status: 'registered',
      vitals: null,
      triageResult: null,
      diagnosis: null
    }
  ]);

  // Admin Portal States
  const [adminName, setAdminName] = useState('');
  const [adminAge, setAdminAge] = useState('');
  const [adminGender, setAdminGender] = useState('Female');
  const [adminMRN, setAdminMRN] = useState('');
  const [adminSuccess, setAdminSuccess] = useState(false);

  // Nurse Triage States
  const [selectedNursePatientId, setSelectedNursePatientId] = useState(null);
  const [nurseTemp, setNurseTemp] = useState('');
  const [nurseHR, setNurseHR] = useState('');
  const [nurseRR, setNurseRR] = useState('');
  const [nurseBP, setNurseBP] = useState('');
  const [nurseSpO2, setNurseSpO2] = useState('');
  const [nurseAVPU, setNurseAVPU] = useState('A');
  const [currentTriageOutput, setCurrentTriageOutput] = useState(null);
  const [nurseSuccess, setNurseSuccess] = useState(false);

  // Doctor Diagnostics States
  const [selectedDocPatientId, setSelectedDocPatientId] = useState(null);
  const [docDiagnosis, setDocDiagnosis] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [docPrescription, setDocPrescription] = useState('');
  const [docSuccess, setDocSuccess] = useState(false);

  // Admin Registration Submit
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    if (!adminName || !adminAge || !adminMRN) return;

    const newPatient = {
      id: Date.now(),
      name: adminName,
      age: parseInt(adminAge),
      gender: adminGender,
      mrn: adminMRN,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'registered',
      vitals: null,
      triageResult: null,
      diagnosis: null
    };

    setPatients(prev => [...prev, newPatient]);
    setAdminName('');
    setAdminAge('');
    setAdminMRN('');
    setAdminSuccess(true);
    setTimeout(() => setAdminSuccess(false), 4000);
  };

  // MEOWS Algorithm logic
  const calculateMEOWS = (vitals) => {
    const { temp, hr, rr, bp, spo2, avpu } = vitals;
    let score = 0;
    const triggers = [];

    // 1. Respiratory Rate
    if (rr < 10) {
      score += 3;
      triggers.push({ param: 'Respiratory Rate', value: `${rr} breaths/min`, alert: 'red', points: 3 });
    } else if (rr >= 10 && rr <= 20) {
      // Normal
    } else if (rr >= 21 && rr <= 25) {
      score += 2;
      triggers.push({ param: 'Respiratory Rate', value: `${rr} breaths/min`, alert: 'yellow', points: 2 });
    } else {
      score += 3;
      triggers.push({ param: 'Respiratory Rate', value: `${rr} breaths/min`, alert: 'red', points: 3 });
    }

    // 2. Heart Rate
    if (hr < 40) {
      score += 3;
      triggers.push({ param: 'Heart Rate', value: `${hr} bpm`, alert: 'red', points: 3 });
    } else if (hr >= 40 && hr <= 49) {
      score += 2;
      triggers.push({ param: 'Heart Rate', value: `${hr} bpm`, alert: 'yellow', points: 2 });
    } else if (hr >= 50 && hr <= 99) {
      // Normal
    } else if (hr >= 100 && hr <= 119) {
      score += 2;
      triggers.push({ param: 'Heart Rate', value: `${hr} bpm`, alert: 'yellow', points: 2 });
    } else {
      score += 3;
      triggers.push({ param: 'Heart Rate', value: `${hr} bpm`, alert: 'red', points: 3 });
    }

    // 3. Systolic BP
    if (bp < 90) {
      score += 3;
      triggers.push({ param: 'Systolic BP', value: `${bp} mmHg`, alert: 'red', points: 3 });
    } else if (bp >= 90 && bp <= 99) {
      score += 2;
      triggers.push({ param: 'Systolic BP', value: `${bp} mmHg`, alert: 'yellow', points: 2 });
    } else if (bp >= 100 && bp <= 139) {
      // Normal
    } else if (bp >= 140 && bp <= 149) {
      score += 2;
      triggers.push({ param: 'Systolic BP', value: `${bp} mmHg`, alert: 'yellow', points: 2 });
    } else {
      score += 3;
      triggers.push({ param: 'Systolic BP', value: `${bp} mmHg`, alert: 'red', points: 3 });
    }

    // 4. Temperature
    if (temp < 35.0) {
      score += 3;
      triggers.push({ param: 'Temperature', value: `${temp}°C`, alert: 'red', points: 3 });
    } else if (temp >= 35.0 && temp <= 35.9) {
      score += 2;
      triggers.push({ param: 'Temperature', value: `${temp}°C`, alert: 'yellow', points: 2 });
    } else if (temp >= 36.0 && temp <= 37.4) {
      // Normal
    } else if (temp >= 37.5 && temp <= 37.9) {
      score += 2;
      triggers.push({ param: 'Temperature', value: `${temp}°C`, alert: 'yellow', points: 2 });
    } else {
      score += 3;
      triggers.push({ param: 'Temperature', value: `${temp}°C`, alert: 'red', points: 3 });
    }

    // 5. Oxygen Saturation (SpO2)
    if (spo2 < 92) {
      score += 3;
      triggers.push({ param: 'Oxygen Saturation', value: `${spo2}%`, alert: 'red', points: 3 });
    } else if (spo2 >= 92 && spo2 <= 94) {
      score += 2;
      triggers.push({ param: 'Oxygen Saturation', value: `${spo2}%`, alert: 'yellow', points: 2 });
    } else {
      // Normal
    }

    // 6. AVPU Consciousness Level
    if (avpu !== 'A') {
      const severity = avpu === 'Voice' || avpu === 'V' ? 'yellow' : 'red';
      const pts = severity === 'yellow' ? 2 : 3;
      score += pts;
      triggers.push({ param: 'Consciousness Level', value: avpu, alert: severity, points: pts });
    }

    // Determine overall risk
    let risk = 'low';
    let reason = 'AI DIAGNOSIS: ALL VITAL PARAMETERS WITHIN EXPECTED BOUNDS. MONITOR PATIENT AT REGULAR INTERVALS.';

    const hasRed = triggers.some(t => t.alert === 'red');
    const yellowCount = triggers.filter(t => t.alert === 'yellow').length;

    if (hasRed || score >= 4) {
      risk = 'high';
      const criticalParams = triggers.filter(t => t.alert === 'red').map(t => t.param.toUpperCase()).join(', ');
      reason = `ALERT [HIGH RISK]: PATIENT HAS CRITICAL DEVIATION IN ${criticalParams || 'MULTIPLE PARAMETERS'} (TOTAL MEOWS SCORE: ${score}). ESCALATE IMMEDIATELY. CONTEXT SENT TO DOCTOR PORTAL.`;
    } else if (yellowCount >= 2 || score >= 2) {
      risk = 'medium';
      const abnormalParams = triggers.map(t => t.param.toUpperCase()).join(', ');
      reason = `ALERT [MEDIUM RISK]: ELEVATED SCORES DETECTED IN ${abnormalParams} (TOTAL MEOWS SCORE: ${score}). RECOMMEND CLINICAL RE-EVALUATION WITHIN 30 MINUTES.`;
    } else if (score === 1 || yellowCount === 1) {
      risk = 'low';
      reason = `STABLE [LOW RISK]: MINIMAL PARAMETER DEVIATION (TOTAL MEOWS SCORE: ${score}). CONTINUE PATIENT OBSERVATION AS ROUTINE.`;
    }

    return { score, risk, reason, triggers };
  };

  // Nurse Calculate Triage
  const handleCalculateTriage = () => {
    if (!nurseTemp || !nurseHR || !nurseRR || !nurseBP || !nurseSpO2) return;

    const vitals = {
      temp: parseFloat(nurseTemp),
      hr: parseInt(nurseHR),
      rr: parseInt(nurseRR),
      bp: parseInt(nurseBP),
      spo2: parseInt(nurseSpO2),
      avpu: nurseAVPU
    };

    const result = calculateMEOWS(vitals);
    setCurrentTriageOutput({ vitals, result });
  };

  // Nurse Dispatch to FastAPI & Doctor Portal
  const handleDispatchTriage = () => {
    if (!selectedNursePatientId || !currentTriageOutput) return;

    setPatients(prev => prev.map(p => {
      if (p.id === selectedNursePatientId) {
        return {
          ...p,
          status: 'triaged',
          vitals: currentTriageOutput.vitals,
          triageResult: {
            score: currentTriageOutput.result.score,
            risk: currentTriageOutput.result.risk,
            reason: currentTriageOutput.result.reason
          }
        };
      }
      return p;
    }));

    // Reset nurse states
    setSelectedNursePatientId(null);
    setNurseTemp('');
    setNurseHR('');
    setNurseRR('');
    setNurseBP('');
    setNurseSpO2('');
    setNurseAVPU('A');
    setCurrentTriageOutput(null);
    setNurseSuccess(true);
    setTimeout(() => setNurseSuccess(false), 4000);
  };

  // Doctor Submit Diagnosis
  const handleDoctorDiagnose = (e) => {
    e.preventDefault();
    if (!selectedDocPatientId || !docDiagnosis || !docNotes) return;

    setPatients(prev => prev.map(p => {
      if (p.id === selectedDocPatientId) {
        return {
          ...p,
          status: 'diagnosed',
          diagnosis: {
            disease: docDiagnosis,
            notes: docNotes,
            prescription: docPrescription || 'None prescribed',
            doctorName: 'Dr. Evelyn Carter',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return p;
    }));

    setDocDiagnosis('');
    setDocNotes('');
    setDocPrescription('');
    setSelectedDocPatientId(null);
    setDocSuccess(true);
    setTimeout(() => setDocSuccess(false), 4000);
  };

  // Select patient in Nurse View
  const handleSelectNursePatient = (patient) => {
    setSelectedNursePatientId(patient.id);
    setCurrentTriageOutput(null);
    if (patient.vitals) {
      setNurseTemp(patient.vitals.temp.toString());
      setNurseHR(patient.vitals.hr.toString());
      setNurseRR(patient.vitals.rr.toString());
      setNurseBP(patient.vitals.bp.toString());
      setNurseSpO2(patient.vitals.spo2.toString());
      setNurseAVPU(patient.vitals.avpu);
    } else {
      setNurseTemp('');
      setNurseHR('');
      setNurseRR('');
      setNurseBP('');
      setNurseSpO2('');
      setNurseAVPU('A');
    }
  };

  const selectedNursePatient = patients.find(p => p.id === selectedNursePatientId);
  const selectedDocPatient = patients.find(p => p.id === selectedDocPatientId);

  return (
    <div className="smart-triage-overlay">
      <div className="smart-triage-container">
        
        {/* Header */}
        <header className="triage-header">
          <div className="triage-title-group">
            <div>
              <span className="triage-system-title">[SMART-TRIAGE // CLINICAL PORTAL]</span>
              <div className="tech-badges-row">
                <span className="tech-micro-badge">REACT</span>
                <span className="tech-micro-badge">FASTAPI</span>
                <span className="tech-micro-badge">SUPABASE</span>
                <span className="tech-micro-badge">BOOTSTRAP CSS</span>
              </div>
            </div>
          </div>
          <button className="btn-close-triage" onClick={onClose}>
            SHUTDOWN_SIGNAL [✕]
          </button>
        </header>

        {/* Info Quote */}
        <div className="triage-intro">
          <p className="triage-desc">
            "A distributed healthcare environment where patients are registered via Supabase Auth/DB (Admin), physiological parameters are calculated using FastAPI logic (Nurse), and diagnostics are logged securely for medical reviews (Doctor)."
          </p>
        </div>

        {/* Integration flow chart */}
        <div style={{ padding: '16px 24px 0' }}>
          <div className="integration-flow-indicator">
            <div className="integration-node">
              <span className="node-title">ADMIN INTERFACE</span>
              <span className="node-subtitle">Supabase Patient Auth</span>
            </div>
            <span className="integration-arrow">➔</span>
            <div className="integration-node">
              <span className="node-title">NURSE ASSESSMENT</span>
              <span className="node-subtitle">FastAPI MEOWS Engine</span>
            </div>
            <span className="integration-arrow">➔</span>
            <div className="integration-node">
              <span className="node-title">DOCTOR DECISION</span>
              <span className="node-subtitle">Supabase Diagnostic Records</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="triage-tabs">
          <button 
            className={`triage-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            [01] ADMIN_PORTAL
          </button>
          <button 
            className={`triage-tab-btn ${activeTab === 'nurse' ? 'active' : ''}`}
            onClick={() => setActiveTab('nurse')}
          >
            [02] NURSE_TRIAGE
          </button>
          <button 
            className={`triage-tab-btn ${activeTab === 'doctor' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctor')}
          >
            [03] DOCTOR_DIAGNOSTICS
          </button>
        </div>

        {/* Main Body */}
        <div className="triage-body">
          
          {/* TAB 1: ADMIN PORTAL */}
          {activeTab === 'admin' && (
            <div className="triage-admin-grid">
              
              {/* Form Card */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 className="mono-text" style={{ fontSize: '12px', marginBottom: '16px', color: 'var(--display)' }}>
                  PATIENT_REGISTRATION.EXE
                </h3>
                
                <form onSubmit={handleRegisterPatient}>
                  <div className="input-group">
                    <label className="input-label">FULL NAME</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="E.G. JANE DOE" 
                      value={adminName} 
                      onChange={e => setAdminName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="input-group">
                      <label className="input-label">AGE</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        placeholder="E.G. 30" 
                        value={adminAge} 
                        onChange={e => setAdminAge(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">GENDER</label>
                      <select 
                        className="select-field" 
                        value={adminGender} 
                        onChange={e => setAdminGender(e.target.value)}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">MEDICAL RECORD NUMBER (MRN)</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="E.G. MRN-77312" 
                      value={adminMRN} 
                      onChange={e => setAdminMRN(e.target.value)} 
                      required 
                    />
                  </div>

                  {adminSuccess && (
                    <div className="input-error-msg" style={{ color: 'var(--success)', marginBottom: '16px' }}>
                      [SUCCESS: PATIENT WRITTEN TO SUPABASE 'patients_table']
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    SAVE_TO_CLOUD
                    <DotMatrixIcon name="arrowRight" size="14px" style={{ color: 'inherit' }} />
                  </button>
                </form>
              </div>

              {/* Patient List (All) */}
              <div>
                <h3 className="mono-text" style={{ fontSize: '12px', marginBottom: '16px', color: 'var(--secondary)' }}>
                  ACTIVE_PATIENTS_DATABASE.CSV
                </h3>
                
                <div className="patient-list-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>MRN</th>
                        <th>NAME</th>
                        <th>CHECK-IN</th>
                        <th className="num">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map(p => (
                        <tr key={p.id}>
                          <td>{p.mrn}</td>
                          <td>{p.name} ({p.age}F)</td>
                          <td>{p.checkInTime}</td>
                          <td className="num">
                            <span className={`patient-status-badge ${p.status}`}>
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: NURSE TRIAGE */}
          {activeTab === 'nurse' && (
            <div className="triage-nurse-grid">
              
              {/* Select Patient & Input Vitals */}
              <div>
                <h3 className="mono-text" style={{ fontSize: '12px', marginBottom: '16px', color: 'var(--secondary)' }}>
                  SELECT_AWAITING_PATIENT
                </h3>
                
                <div className="patient-list-container" style={{ marginBottom: '24px' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>MRN</th>
                        <th>NAME</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.filter(p => p.status === 'registered' || p.status === 'triaged').map(p => (
                        <tr 
                          key={p.id} 
                          className={`clickable-row ${selectedNursePatientId === p.id ? 'selected' : ''}`}
                          onClick={() => handleSelectNursePatient(p)}
                        >
                          <td>{p.mrn}</td>
                          <td>{p.name}</td>
                          <td>
                            <span className={`patient-status-badge ${p.status}`}>
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {patients.filter(p => p.status === 'registered' || p.status === 'triaged').length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', color: 'var(--muted)' }}>
                            NO PATIENTS AWAITING ASSESSMENT.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedNursePatient ? (
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <h4 className="mono-text" style={{ fontSize: '11px', marginBottom: '12px', color: 'var(--display)' }}>
                      INPUT_VITALS // {selectedNursePatient.name.toUpperCase()}
                    </h4>
                    
                    <div className="vitals-form-grid">
                      <div className="input-group">
                        <label className="input-label">TEMP (°C)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="input-field" 
                          placeholder="36.5" 
                          value={nurseTemp} 
                          onChange={e => setNurseTemp(e.target.value)} 
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">HEART RATE (BPM)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="75" 
                          value={nurseHR} 
                          onChange={e => setNurseHR(e.target.value)} 
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">RESP RATE (B/MIN)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="16" 
                          value={nurseRR} 
                          onChange={e => setNurseRR(e.target.value)} 
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">SYSTOLIC BP (MMHG)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="120" 
                          value={nurseBP} 
                          onChange={e => setNurseBP(e.target.value)} 
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">SPO2 (%)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="98" 
                          value={nurseSpO2} 
                          onChange={e => setNurseSpO2(e.target.value)} 
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">CONSCIOUSNESS</label>
                        <select 
                          className="select-field" 
                          value={nurseAVPU} 
                          onChange={e => setNurseAVPU(e.target.value)}
                        >
                          <option value="A">Alert (A)</option>
                          <option value="V">Voice Response (V)</option>
                          <option value="P">Pain Response (P)</option>
                          <option value="U">Unresponsive (U)</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                      onClick={handleCalculateTriage}
                      disabled={!nurseTemp || !nurseHR || !nurseRR || !nurseBP || !nurseSpO2}
                    >
                      RUN_FASTAPI_MEOWS_CALCULATOR
                    </button>
                  </div>
                ) : (
                  <div className="no-selection-message">
                    [SELECT A PATIENT FROM THE TABLE ABOVE TO ASSESS]
                  </div>
                )}
              </div>

              {/* Calculated Triage Output */}
              <div>
                <h3 className="mono-text" style={{ fontSize: '12px', marginBottom: '16px', color: 'var(--secondary)' }}>
                  FASTAPI_MEOWS_AI_ANALYSIS
                </h3>

                {currentTriageOutput ? (
                  <div className="triage-report-card">
                    <div className="triage-result-header">
                      <div>
                        <span className="triage-risk-title">MEOWS TIER CLASSIFICATION:</span>
                        <div style={{ marginTop: '4px' }}>
                          <span className={`triage-risk-badge ${currentTriageOutput.result.risk}`}>
                            {currentTriageOutput.result.risk} risk
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="triage-risk-title" style={{ display: 'block' }}>TOTAL SCORE</span>
                        <span className="score-display">{currentTriageOutput.result.score}</span>
                      </div>
                    </div>

                    <div className="parameter-grid">
                      {currentTriageOutput.result.triggers.map((trigger, i) => (
                        <div key={i} className={`parameter-row trigger-${trigger.alert}`}>
                          <span className="parameter-label">{trigger.param}</span>
                          <span className="parameter-value">{trigger.value}</span>
                          <span className="parameter-score">+{trigger.points} PTS ({trigger.alert.toUpperCase()})</span>
                        </div>
                      ))}
                      {currentTriageOutput.result.triggers.length === 0 && (
                        <div className="parameter-row" style={{ justifyContent: 'center', color: 'var(--success)' }}>
                          [ALL PHYSIOLOGICAL CRITERIA NORMAL]
                        </div>
                      )}
                    </div>

                    <div className="ai-reasoning-box">
                      <div className="ai-reasoning-title">
                        <span className="state-dot running" style={{ width: '6px', height: '6px', margin: 0 }}></span>
                        <span>AI_DECISION_ENGINE_EXPLANATION</span>
                      </div>
                      <p className="ai-reasoning-text">
                        {currentTriageOutput.result.reason}
                      </p>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={handleDispatchTriage}
                      >
                        DISPATCH_TO_DOCTORS_QUEUE
                        <DotMatrixIcon name="arrowRight" size="14px" style={{ color: 'inherit' }} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-selection-message">
                    [AWAITING VITALS COMPUTATION...]
                  </div>
                )}

                {nurseSuccess && (
                  <div className="input-error-msg" style={{ color: 'var(--success)', marginTop: '16px', textAlign: 'center' }}>
                    [VITALS DISPATCHED SUCCESSFULLY TO FASTAPI '/api/triage']
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: DOCTOR DIAGNOSTICS */}
          {activeTab === 'doctor' && (
            <div className="doctor-view-layout">
              
              {/* Select Patient in Queue */}
              <div>
                <h3 className="mono-text" style={{ fontSize: '12px', marginBottom: '16px', color: 'var(--secondary)' }}>
                  DOCTOR_ESCORT_QUEUE
                </h3>

                <div className="patient-list-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>MRN</th>
                        <th>NAME</th>
                        <th>RISK</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.filter(p => p.status === 'triaged' || p.status === 'diagnosed').map(p => (
                        <tr 
                          key={p.id} 
                          className={`clickable-row ${selectedDocPatientId === p.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedDocPatientId(p.id);
                            setDocDiagnosis(p.diagnosis ? p.diagnosis.disease : '');
                            setDocNotes(p.diagnosis ? p.diagnosis.notes : '');
                            setDocPrescription(p.diagnosis ? p.diagnosis.prescription : '');
                          }}
                        >
                          <td>{p.mrn}</td>
                          <td>{p.name}</td>
                          <td>
                            {p.triageResult ? (
                              <span className={`patient-status-badge ${p.triageResult.risk}`}>
                                {p.triageResult.risk.toUpperCase()}
                              </span>
                            ) : '-'}
                          </td>
                          <td>
                            <span className={`patient-status-badge ${p.status}`}>
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {patients.filter(p => p.status === 'triaged' || p.status === 'diagnosed').length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: 'var(--muted)' }}>
                            NO TRIAGED PATIENTS IN QUEUE.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {docSuccess && (
                  <div className="input-error-msg" style={{ color: 'var(--success)', marginTop: '16px' }}>
                    [DIAGNOSIS UPLOADED AND LOGGED IN SUPABASE 'diagnoses' TABLE]
                  </div>
                )}
              </div>

              {/* Diagnose Details / Form */}
              <div>
                {selectedDocPatient ? (
                  <div className="doctor-patient-detail">
                    <h3 className="mono-text" style={{ fontSize: '12px', marginBottom: '16px', color: 'var(--display)' }}>
                      PATIENT_CLINICAL_SUMMARY
                    </h3>

                    {/* Patient Info */}
                    <div className="detail-section-title">PATIENT ID CARD</div>
                    <div className="info-grid-2">
                      <div className="info-item">
                        <span className="info-label">Name</span>
                        <span className="info-value">{selectedDocPatient.name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">MRN</span>
                        <span className="info-value">{selectedDocPatient.mrn}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Age/Gender</span>
                        <span className="info-value">{selectedDocPatient.age} yrs / {selectedDocPatient.gender}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Registered At</span>
                        <span className="info-value">{selectedDocPatient.checkInTime}</span>
                      </div>
                    </div>

                    {/* Vitals Info */}
                    <div className="detail-section-title">PHYSIOLOGICAL PARAMETERS</div>
                    {selectedDocPatient.vitals ? (
                      <div className="info-grid-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="info-item">
                          <span className="info-label">Temperature</span>
                          <span className="info-value">{selectedDocPatient.vitals.temp}°C</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Heart Rate</span>
                          <span className="info-value">{selectedDocPatient.vitals.hr} bpm</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Resp Rate</span>
                          <span className="info-value">{selectedDocPatient.vitals.rr} breaths</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">BP (Systolic)</span>
                          <span className="info-value">{selectedDocPatient.vitals.bp} mmHg</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Oxygen (SpO2)</span>
                          <span className="info-value">{selectedDocPatient.vitals.spo2}%</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">AVPU State</span>
                          <span className="info-value">{selectedDocPatient.vitals.avpu}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontStyle: 'italic', fontSize: '12px', color: 'var(--secondary)' }}>
                        Vitals not recorded.
                      </div>
                    )}

                    {/* MEOWS AI Output */}
                    <div className="detail-section-title">MEOWS INTEGRATED CLASSIFICATION</div>
                    {selectedDocPatient.triageResult ? (
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', background: 'var(--surface)', padding: '10px', borderRadius: '4px', borderLeft: `3px solid var(--${selectedDocPatient.triageResult.risk === 'high' ? 'error' : selectedDocPatient.triageResult.risk === 'medium' ? 'warning' : 'success'})` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: `var(--${selectedDocPatient.triageResult.risk === 'high' ? 'error' : selectedDocPatient.triageResult.risk === 'medium' ? 'warning' : 'success'})` }}>
                            {selectedDocPatient.triageResult.risk} RISK
                          </span>
                          <span>MEOWS SCORE: <strong style={{ fontFamily: 'var(--f-display)', fontSize: '15px' }}>{selectedDocPatient.triageResult.score}</strong></span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '11px', lineHeight: '1.4' }}>
                          {selectedDocPatient.triageResult.reason}
                        </p>
                      </div>
                    ) : (
                      <div style={{ fontStyle: 'italic', fontSize: '12px', color: 'var(--secondary)' }}>
                        Triage result not computed.
                      </div>
                    )}

                    {/* Diagnosis Form / Read-only view */}
                    <div className="detail-section-title">CLINICAL ASSESSMENT & DISPOSITION</div>
                    {selectedDocPatient.status === 'diagnosed' ? (
                      <div className="glass-card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--line)' }}>
                        <div className="info-item" style={{ marginBottom: '8px' }}>
                          <span className="info-label">Doctor Diagnosis</span>
                          <span className="info-value" style={{ fontSize: '14px', color: 'var(--display)' }}>
                            {selectedDocPatient.diagnosis.disease}
                          </span>
                        </div>
                        <div className="info-item" style={{ marginBottom: '8px' }}>
                          <span className="info-label">Prescription</span>
                          <span className="info-value" style={{ fontFamily: 'var(--f-mono)' }}>
                            {selectedDocPatient.diagnosis.prescription}
                          </span>
                        </div>
                        <div className="info-item" style={{ marginBottom: '8px' }}>
                          <span className="info-label">Assessment Notes</span>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--secondary)', lineHeight: '1.4' }}>
                            {selectedDocPatient.diagnosis.notes}
                          </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '8px', marginTop: '12px' }}>
                          <span>REVIEWED BY: {selectedDocPatient.diagnosis.doctorName.toUpperCase()}</span>
                          <span>TIME: {selectedDocPatient.diagnosis.timestamp}</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleDoctorDiagnose}>
                        <div className="input-group">
                          <label className="input-label">DIAGNOSIS (DISEASE/CONDITION)</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="E.G. SUSPECTED SEPSIS, PRE-ECLAMPSIA" 
                            value={docDiagnosis}
                            onChange={e => setDocDiagnosis(e.target.value)}
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label className="input-label">PRESCRIPTION / DISPOSITION PLAN</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="E.G. CEFAZOLIN IV, LABETALOL 100MG PO" 
                            value={docPrescription}
                            onChange={e => setDocPrescription(e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label className="input-label">CLINICAL ASSESSMENT NOTES</label>
                          <textarea 
                            className="input-field" 
                            rows="3"
                            placeholder="ENTER DETAILED CLINICAL NOTES AND ASSESSMENT DETAILS..." 
                            value={docNotes}
                            onChange={e => setDocNotes(e.target.value)}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                          SUBMIT_ASSESSMENT
                          <DotMatrixIcon name="arrowRight" size="14px" style={{ color: 'inherit' }} />
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="no-selection-message">
                    [SELECT A TRIAGED PATIENT FROM THE QUEUE TO DIAGNOSE]
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
