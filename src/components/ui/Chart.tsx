import React from 'react';
import styles from '@/styles/components/chart.module.css';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  title?: string;
  type: 'bar' | 'pie';
  data: ChartDataPoint[];
}

const CHART_COLORS = [
  '#7c6ef0',
  '#4ade80',
  '#fbbf24',
  '#f87171',
  '#60a5fa',
  '#c084fc',
  '#fb923c',
  '#34d399',
];

const BarChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={styles.barChart}>
      {data.map((point, i) => (
        <div key={i} className={styles.barGroup}>
          <span className={styles.barValue}>{point.value}</span>
          <div
            className={styles.bar}
            style={{
              height: `${(point.value / maxValue) * 100}%`,
              backgroundColor: point.color || CHART_COLORS[i % CHART_COLORS.length],
            }}
          />
          <span className={styles.barLabel}>{point.label}</span>
        </div>
      ))}
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

    const x1 = 90 + 80 * Math.cos(startRad);
    const y1 = 90 + 80 * Math.sin(startRad);
    const x2 = 90 + 80 * Math.cos(endRad);
    const y2 = 90 + 80 * Math.sin(endRad);

    return (
      <path
        key={i}
        d={`M 90 90 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
        fill={point.color || CHART_COLORS[i % CHART_COLORS.length]}
      />
    );
  });

  return (
    <div className={styles.pieChart}>
      <svg viewBox="0 0 180 180">{slices}</svg>
      <div className={styles.legend}>
        {data.map((point, i) => (
          <div key={i} className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: point.color || CHART_COLORS[i % CHART_COLORS.length] }}
            />
            {point.label}: {point.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Chart: React.FC<ChartProps> = ({ title, type, data }) => {
  return (
    <div className={styles.chartWrapper}>
      {title && <div className={styles.chartTitle}>{title}</div>}
      <div className={styles.chartContainer}>
        {type === 'bar' && <BarChart data={data} />}
        {type === 'pie' && <PieChart data={data} />}
      </div>
    </div>
  );
};