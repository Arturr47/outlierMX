export default function SkeletonCard() {
  return (
    <div className="skel-match-card">
      <div className="skel-topline">
        <div className="skel" style={{ width: 96, height: 10 }} />
        <div className="skel" style={{ width: 72, height: 10 }} />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 210, flexShrink: 0, padding: 16, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div className="skel" style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skel" style={{ width: '70%', height: 11, marginBottom: 5 }} />
              <div className="skel" style={{ width: '50%', height: 9 }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="skel" style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skel" style={{ width: '65%', height: 11, marginBottom: 5 }} />
              <div className="skel" style={{ width: '45%', height: 9 }} />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 16, display: 'flex', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: '1 0 130px' }}>
              <div className="skel" style={{ width: '55%', height: 9, marginBottom: 10 }} />
              <div className="skel" style={{ width: '100%', height: 42, borderRadius: 9, marginBottom: 8 }} />
              <div className="skel" style={{ width: '100%', height: 42, borderRadius: 9 }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.14)',
      }}>
        <div className="skel" style={{ width: 88, height: 10 }} />
        <div className="skel" style={{ width: 60, height: 10 }} />
      </div>
    </div>
  );
}
