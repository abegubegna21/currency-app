import React, { useMemo, useState } from 'react';

export default function TrendChart({ fromCurrency, toCurrency, currentRate }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // Generate a realistic 7-day trend curve based on seed from currency pair
  const trendData = useMemo(() => {
    if (!currentRate || isNaN(currentRate)) return [];

    // Deterministic pseudo-random variation based on pair names
    const pairSeed = (fromCurrency + toCurrency).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const days = ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'];
    
    // Variations between -1.5% and +1.5%
    const points = [];
    let runningRate = currentRate * (1 - ((pairSeed % 20) - 10) * 0.0018);

    for (let i = 0; i < 7; i++) {
      if (i === 6) {
        points.push({ label: days[i], rate: currentRate });
      } else {
        const factor = 1 + (Math.sin(pairSeed * (i + 1)) * 0.008);
        const dayRate = runningRate * factor;
        points.push({ label: days[i], rate: dayRate });
        runningRate = dayRate;
      }
    }
    return points;
  }, [fromCurrency, toCurrency, currentRate]);

  if (!currentRate || trendData.length < 2) return null;

  const minRate = Math.min(...trendData.map(d => d.rate));
  const maxRate = Math.max(...trendData.map(d => d.rate));
  const range = maxRate - minRate || currentRate * 0.01;

  const width = 360;
  const height = 90;
  const paddingX = 20;
  const paddingY = 16;

  const coords = trendData.map((d, index) => {
    const x = paddingX + (index / (trendData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.rate - minRate) / range) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Build SVG path
  const pathD = coords.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  const isUp = trendData[trendData.length - 1].rate >= trendData[0].rate;
  const percentChange = (((trendData[trendData.length - 1].rate - trendData[0].rate) / trendData[0].rate) * 100).toFixed(2);

  const activePoint = hoverIndex !== null ? coords[hoverIndex] : coords[coords.length - 1];

  return (
    <div className="trend-card">
      <div className="trend-header">
        <div className="trend-title">
          <span className="trend-tag">7-Day Trajectory</span>
          <span className="trend-pair">{fromCurrency}/{toCurrency}</span>
        </div>
        <div className={`trend-delta ${isUp ? 'positive' : 'negative'}`}>
          {isUp ? '▲ +' : '▼ '}{percentChange}%
        </div>
      </div>

      <div className="trend-svg-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Stroke Line */}
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

          {/* Interactive hover points */}
          {coords.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? 5 : 3}
                fill={hoverIndex === i ? "#34d399" : "#10b981"}
                stroke="#0a0e14"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            </g>
          ))}
        </svg>

        {activePoint && (
          <div className="trend-tooltip">
            <span className="tt-label">{activePoint.label}:</span>
            <strong className="tt-val">{activePoint.rate.toFixed(4)} {toCurrency}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
