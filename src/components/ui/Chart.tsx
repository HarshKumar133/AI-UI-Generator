import React from 'react';
import styles from '@/styles/components/chart.module.css';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  title?: string;
  type: 'bar' | 'line' | 'pie';
  data: ChartDataPoint[];
  height?: number;
}

const CHART_COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f43f5e',
  '#84cc16',
];

const BarChart: React.FC<{ data: ChartDataPoint[]; height: number }> = ({ data, height }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={styles.barChart} style={{ height }}>
      {data.map((point, i) => {
        const barColor = point.color || CHART_COLORS[i % CHART_COLORS.length];
        const pct = Math.max((point.value / maxValue) * 100, 4); // min 4% so bar is visible
        return (
          <div key={i} className={styles.barGroup}>
            <span className={styles.barValue}>{point.value.toLocaleString()}</span>
            <div
              className={styles.bar}
              style={{
                height: `${pct}%`,
                backgroundColor: barColor,
                boxShadow: `0 0 12px ${barColor}30`,
                minHeight: 12,
              }}
            />
            <span className={styles.barLabel}>{point.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const LineChart: React.FC<{ data: ChartDataPoint[]; height: number }> = ({ data, height }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = 8;
  const svgWidth = 400;
  const svgHeight = height;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 3;

  const points = data.map((d, i) => ({
    x: padding + (i / Math.max(data.length - 1, 1)) * chartWidth,
    y: padding + chartHeight - (d.value / maxValue) * chartHeight,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`;

  // Unique ID per instance to avoid SVG gradient collisions
  const gradId = React.useId();

  return (
    <div className={styles.lineChart}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.lineSvg}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} />
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="#0f1214" strokeWidth="2.5" />
        ))}
      </svg>
      <div className={styles.lineLabels}>
        {data.map((d, i) => (
          <span key={i} className={styles.lineLabel}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

const PieChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;

  const slices = data.map((point, i) => {
    const startAngle = (cumulative / total) * 360;
    const sliceAngle = (point.value / total) * 360;
    cumulative += point.value;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((startAngle + sliceAngle - 90) * Math.PI) / 180;
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const color = point.color || CHART_COLORS[i % CHART_COLORS.length];

    const x1 = 90 + 75 * Math.cos(startRad);
    const y1 = 90 + 75 * Math.sin(startRad);
    const x2 = 90 + 75 * Math.cos(endRad);
    const y2 = 90 + 75 * Math.sin(endRad);

    return (
      <path
        key={i}
        d={`M 90 90 L ${x1} ${y1} A 75 75 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
        fill={color}
        stroke="rgba(9,9,11,0.4)"
        strokeWidth="1"
        className={styles.pieSlice}
      />
    );
  });

  return (
    <div className={styles.pieChart}>
      <svg viewBox="0 0 180 180" className={styles.pieSvg}>{slices}</svg>
      <div className={styles.legend}>
        {data.map((point, i) => (
          <div key={i} className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: point.color || CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className={styles.legendLabel}>{point.label}</span>
            <span className={styles.legendValue}>{point.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Chart: React.FC<ChartProps> = ({ title, type, data, height = 200 }) => {
  return (
    <div className={styles.chartWrapper}>
      {title && <div className={styles.chartTitle}>{title}</div>}
      <div className={styles.chartContainer}>
        {type === 'bar' && <BarChart data={data} height={height} />}
        {type === 'line' && <LineChart data={data} height={height} />}
        {type === 'pie' && <PieChart data={data} />}
      </div>
    </div>
  );
};