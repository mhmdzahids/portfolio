export default function SegmentedBar({ value, max = 100, limit = 85, label }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const totalBlocks = 10;
  const activeBlocksCount = Math.round((percentage / 100) * totalBlocks);
  const isOverLimit = percentage >= limit;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        {label && <span className="mono-text" style={{ fontSize: '11px', color: 'var(--secondary)' }}>{label}</span>}
        <span className="display-text" style={{ fontSize: '20px' }}>
          {Math.round(percentage)}
          <span style={{ fontSize: '12px', marginLeft: '2px', fontFamily: 'var(--f-mono)', letterSpacing: 'normal' }}>%</span>
        </span>
      </div>
      <div className="seg-bar">
        {Array.from({ length: totalBlocks }).map((_, index) => {
          const isActive = index < activeBlocksCount;
          return (
            <div
              key={index}
              className={`seg-block ${isActive ? (isOverLimit ? 'limit' : 'filled') : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}
