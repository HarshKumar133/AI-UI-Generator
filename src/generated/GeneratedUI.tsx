'use client';
// @ts-nocheck
import React from 'react';

type KPI = {
  label: string;
  value: string;
  trend: string;
  subtitle: string;
  icon: string;
  trendDirection: 'up' | 'down';
};

type RevenuePoint = {
  month: string;
  revenue: number;
  reports: number;
};

type RegionPoint = {
  label: string;
  value: number;
  growth: string;
  color: string;
};

type ReportRow = {
  id: string;
  team: string;
  owner: string;
  score: string;
  generatedAt: string;
  status: 'Published' | 'Reviewing' | 'Draft';
};

const kpis: KPI[] = [
  {
    label: 'Monthly Revenue',
    value: '$284,920',
    trend: '+18.4%',
    subtitle: 'vs previous month',
    icon: '💰',
    trendDirection: 'up',
  },
  {
    label: 'Reports Generated',
    value: '12,486',
    trend: '+11.2%',
    subtitle: 'last 30 days',
    icon: '📄',
    trendDirection: 'up',
  },
  {
    label: 'Active Analysts',
    value: '348',
    trend: '+6.8%',
    subtitle: 'currently online',
    icon: '👥',
    trendDirection: 'up',
  },
  {
    label: 'Avg. Delivery Time',
    value: '2h 48m',
    trend: '-9.1%',
    subtitle: 'faster than last month',
    icon: '⚡',
    trendDirection: 'down',
  },
];

const revenueSeries: RevenuePoint[] = [
  { month: 'Aug', revenue: 186000, reports: 1420 },
  { month: 'Sep', revenue: 198000, reports: 1560 },
  { month: 'Oct', revenue: 214000, reports: 1710 },
  { month: 'Nov', revenue: 225000, reports: 1788 },
  { month: 'Dec', revenue: 251000, reports: 1940 },
  { month: 'Jan', revenue: 272000, reports: 2084 },
  { month: 'Feb', revenue: 284920, reports: 2230 },
];

const regionMix: RegionPoint[] = [
  { label: 'North America', value: 38, growth: '+16%', color: '#d44f2f' },
  { label: 'Europe', value: 27, growth: '+12%', color: '#f07a60' },
  { label: 'Asia Pacific', value: 21, growth: '+19%', color: '#f4ab96' },
  { label: 'LATAM', value: 9, growth: '+7%', color: '#b84326' },
  { label: 'MEA', value: 5, growth: '+4%', color: '#8d2f1b' },
];

const recentReports: ReportRow[] = [
  { id: 'RPT-1287', team: 'Revenue Ops', owner: 'A. Johnson', score: '98.2', generatedAt: 'Mar 18, 09:21', status: 'Published' },
  { id: 'RPT-1286', team: 'Growth Team', owner: 'M. Patel', score: '95.7', generatedAt: 'Mar 18, 08:42', status: 'Published' },
  { id: 'RPT-1285', team: 'Support Ops', owner: 'K. Silva', score: '91.4', generatedAt: 'Mar 18, 08:17', status: 'Reviewing' },
  { id: 'RPT-1284', team: 'Product Insights', owner: 'L. Chen', score: '93.1', generatedAt: 'Mar 17, 18:54', status: 'Published' },
  { id: 'RPT-1283', team: 'Executive Briefs', owner: 'D. Miller', score: '89.6', generatedAt: 'Mar 17, 17:26', status: 'Draft' },
  { id: 'RPT-1282', team: 'Sales Enablement', owner: 'R. Gupta', score: '96.2', generatedAt: 'Mar 17, 15:14', status: 'Reviewing' },
];

function StatusPill({ status }: { status: ReportRow['status'] }) {
  const className = status === 'Published' ? 'statusPublished' : status === 'Reviewing' ? 'statusReviewing' : 'statusDraft';
  return <span className={`statusPill ${className}`}>{status}</span>;
}

function MetricCard({ item }: { item: KPI }) {
  return (
    <article className="metricCard">
      <div className="metricHeader">
        <span className="metricIcon" aria-hidden>{item.icon}</span>
        <span className={`metricTrend ${item.trendDirection === 'up' ? 'trendUp' : 'trendDown'}`}>
          {item.trendDirection === 'up' ? '↗' : '↘'} {item.trend}
        </span>
      </div>
      <div className="metricLabel">{item.label}</div>
      <div className="metricValue">{item.value}</div>
      <div className="metricSub">{item.subtitle}</div>
    </article>
  );
}

function RevenueChart() {
  const maxRevenue = Math.max(...revenueSeries.map((d) => d.revenue));
  const points = revenueSeries.map((point, index) => {
    const x = 24 + (index / (revenueSeries.length - 1)) * 672;
    const y = 228 - (point.revenue / maxRevenue) * 156;
    return { ...point, x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} 236 L ${points[0].x} 236 Z`;

  return (
    <div className="chartWrap">
      <svg viewBox="0 0 720 260" role="img" aria-label="Monthly revenue trend chart">
        <defs>
          <linearGradient id="revenueArea" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 79, 47, 0.35)" />
            <stop offset="100%" stopColor="rgba(212, 79, 47, 0.03)" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((line) => {
          const y = 70 + line * 42;
          return <line key={line} x1="20" y1={y} x2="700" y2={y} stroke="rgba(30, 23, 18, 0.08)" strokeDasharray="6 8" />;
        })}

        <path d={areaPath} fill="url(#revenueArea)" />
        <path d={linePath} fill="none" stroke="#d44f2f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r="6" fill="#fff" stroke="#d44f2f" strokeWidth="3" />
            <text x={point.x} y="252" textAnchor="middle" className="chartLabel">
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RegionBreakdown() {
  const donutStops = regionMix.reduce(
    (acc, region) => {
      const start = acc.offset;
      const end = start + region.value;
      return {
        offset: end,
        stops: [...acc.stops, `${region.color} ${start}% ${end}%`],
      };
    },
    { offset: 0, stops: [] as string[] },
  ).stops;

  return (
    <div className="regionPanelBody">
      <div
        className="donut"
        style={{
          background: `conic-gradient(${donutStops.join(', ')})`,
        }}
      >
        <div className="donutHole">
          <div className="donutValue">284K</div>
          <div className="donutLabel">Monthly ARR</div>
        </div>
      </div>

      <div className="regionLegend">
        {regionMix.map((region) => (
          <div key={region.label} className="regionItem">
            <span className="regionDot" style={{ background: region.color }} />
            <div className="regionName">{region.label}</div>
            <div className="regionPercent">{region.value}%</div>
            <div className="regionGrowth">{region.growth}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThroughputPanel() {
  const maxReports = Math.max(...revenueSeries.map((d) => d.reports));

  return (
    <div className="throughputGrid">
      {revenueSeries.map((item) => (
        <div key={item.month} className="throughputBarWrap">
          <div
            className="throughputBar"
            style={{ height: `${Math.max(12, (item.reports / maxReports) * 100)}%` }}
          />
          <span className="throughputMonth">{item.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function GeneratedUI() {
  return (
    <div className="reportingDashboardRoot">
      <style>{`
        .reportingDashboardRoot {
          min-height: 100vh;
          color: #1f1a16;
          font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
          background:
            radial-gradient(ellipse at 12% 8%, rgba(212, 79, 47, 0.12) 0%, transparent 44%),
            radial-gradient(ellipse at 88% 92%, rgba(240, 122, 96, 0.1) 0%, transparent 42%),
            #fffaf4;
        }
        .dashboardShell {
          max-width: 1220px;
          margin: 0 auto;
          padding: 22px clamp(14px, 3vw, 34px) 42px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .topNav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(31, 26, 22, 0.1);
          box-shadow: 0 12px 32px rgba(65, 43, 24, 0.08);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 14px;
          z-index: 10;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          letter-spacing: -0.02em;
          font-size: 0.95rem;
        }
        .brandBadge {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #d44f2f 0%, #f07a60 100%);
          color: white;
          font-size: 0.85rem;
          box-shadow: 0 8px 16px rgba(212, 79, 47, 0.25);
        }
        .navTabs {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .navTab {
          font-size: 0.74rem;
          font-weight: 600;
          color: #6a5f56;
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 6px 12px;
          background: transparent;
        }
        .navTabActive {
          color: #d44f2f;
          background: rgba(212, 79, 47, 0.1);
          border-color: rgba(212, 79, 47, 0.24);
        }
        .navActions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ghostBtn, .primaryBtn {
          border: 1px solid rgba(31, 26, 22, 0.12);
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 7px 12px;
          background: rgba(255, 255, 255, 0.9);
          color: #3f352e;
        }
        .primaryBtn {
          border-color: rgba(212, 79, 47, 0.26);
          background: linear-gradient(135deg, rgba(212, 79, 47, 0.14) 0%, rgba(240, 122, 96, 0.12) 100%);
          color: #a64026;
        }

        .heroPanel {
          padding: clamp(16px, 2.5vw, 24px);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(31, 26, 22, 0.1);
          box-shadow: 0 18px 44px rgba(65, 43, 24, 0.1);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
        }
        .heroTitle {
          margin: 0;
          font-size: clamp(1.35rem, 2.5vw, 2.05rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          background: linear-gradient(135deg, #2a241f 0%, #d44f2f 70%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .heroSub {
          margin: 10px 0 0;
          color: #6a5f56;
          font-size: 0.86rem;
          line-height: 1.55;
          max-width: 620px;
        }
        .heroStats {
          display: grid;
          grid-template-columns: repeat(2, minmax(110px, 1fr));
          gap: 10px;
          width: min(320px, 100%);
        }
        .heroStatCard {
          border-radius: 14px;
          border: 1px solid rgba(31, 26, 22, 0.1);
          background: rgba(255, 255, 255, 0.9);
          padding: 10px 12px;
        }
        .heroStatValue {
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: -0.02em;
        }
        .heroStatLabel {
          margin-top: 4px;
          font-size: 0.68rem;
          color: #7b7067;
        }

        .kpiGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .metricCard {
          border-radius: 18px;
          border: 1px solid rgba(31, 26, 22, 0.1);
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 10px 28px rgba(65, 43, 24, 0.08);
          padding: 14px;
        }
        .metricHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .metricIcon {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: rgba(212, 79, 47, 0.1);
        }
        .metricTrend {
          font-size: 0.68rem;
          font-weight: 700;
          border-radius: 999px;
          padding: 4px 8px;
        }
        .trendUp {
          background: rgba(48, 154, 99, 0.12);
          color: #1f7f4e;
        }
        .trendDown {
          background: rgba(212, 79, 47, 0.12);
          color: #a53b22;
        }
        .metricLabel {
          margin-top: 11px;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #8c8076;
          font-weight: 700;
        }
        .metricValue {
          margin-top: 8px;
          font-size: 1.52rem;
          letter-spacing: -0.03em;
          font-weight: 800;
          line-height: 1.05;
        }
        .metricSub {
          margin-top: 6px;
          font-size: 0.72rem;
          color: #6a5f56;
        }

        .analyticsGrid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 14px;
        }
        .panel {
          border-radius: 20px;
          border: 1px solid rgba(31, 26, 22, 0.1);
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 14px 34px rgba(65, 43, 24, 0.09);
          padding: 14px;
        }
        .panelHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .panelTitle {
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .panelSub {
          font-size: 0.72rem;
          color: #7d7167;
          margin-top: 3px;
        }
        .chip {
          border: 1px solid rgba(31, 26, 22, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          color: #6a5f56;
          font-size: 0.66rem;
          font-weight: 700;
          padding: 5px 9px;
        }
        .chartWrap {
          width: 100%;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(31, 26, 22, 0.08);
          background: linear-gradient(180deg, rgba(255, 248, 241, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%);
        }
        .chartLabel {
          fill: #7d7167;
          font-size: 12px;
          font-weight: 700;
        }

        .regionPanelBody {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .donut {
          width: min(240px, 100%);
          aspect-ratio: 1;
          border-radius: 50%;
          margin: 2px auto 0;
          display: grid;
          place-items: center;
          box-shadow: 0 14px 30px rgba(65, 43, 24, 0.12);
        }
        .donutHole {
          width: 66%;
          height: 66%;
          border-radius: 50%;
          background: #fffdfb;
          border: 1px solid rgba(31, 26, 22, 0.08);
          display: grid;
          place-items: center;
          text-align: center;
          padding: 8px;
        }
        .donutValue {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .donutLabel {
          font-size: 0.66rem;
          color: #7d7167;
          margin-top: 2px;
        }
        .regionLegend {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .regionItem {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          align-items: center;
          gap: 9px;
          border-radius: 12px;
          border: 1px solid rgba(31, 26, 22, 0.08);
          background: rgba(255, 255, 255, 0.82);
          padding: 8px 9px;
        }
        .regionDot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
        }
        .regionName {
          font-size: 0.72rem;
          color: #4f463f;
          font-weight: 600;
        }
        .regionPercent {
          font-size: 0.71rem;
          color: #2b241e;
          font-weight: 800;
        }
        .regionGrowth {
          font-size: 0.68rem;
          color: #2a8a56;
          font-weight: 700;
        }

        .throughputGrid {
          height: 210px;
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
          align-items: end;
          padding: 4px 0;
        }
        .throughputBarWrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          height: 100%;
          justify-content: flex-end;
        }
        .throughputBar {
          width: 100%;
          border-radius: 10px;
          background: linear-gradient(180deg, #f08f73 0%, #d44f2f 100%);
          min-height: 14px;
          box-shadow: 0 8px 14px rgba(212, 79, 47, 0.2);
        }
        .throughputMonth {
          font-size: 0.66rem;
          color: #7d7167;
          font-weight: 700;
        }

        .tablePanel {
          border-radius: 20px;
          border: 1px solid rgba(31, 26, 22, 0.1);
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 14px 34px rgba(65, 43, 24, 0.09);
          overflow: hidden;
        }
        .tableHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(31, 26, 22, 0.08);
          background: rgba(255, 250, 245, 0.95);
        }
        .tableTitle {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .tableWrap {
          overflow-x: auto;
        }
        .reportTable {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }
        .reportTable th {
          text-align: left;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #8c8076;
          font-weight: 800;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(31, 26, 22, 0.08);
        }
        .reportTable td {
          font-size: 0.78rem;
          color: #362f29;
          font-weight: 600;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(31, 26, 22, 0.07);
        }
        .reportTable tbody tr:hover {
          background: rgba(212, 79, 47, 0.04);
        }
        .statusPill {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
        }
        .statusPublished {
          color: #1f7f4e;
          border-color: rgba(48, 154, 99, 0.25);
          background: rgba(48, 154, 99, 0.1);
        }
        .statusReviewing {
          color: #8c5f18;
          border-color: rgba(222, 167, 70, 0.35);
          background: rgba(222, 167, 70, 0.14);
        }
        .statusDraft {
          color: #7a7070;
          border-color: rgba(122, 112, 112, 0.25);
          background: rgba(122, 112, 112, 0.1);
        }

        @media (max-width: 1100px) {
          .topNav {
            flex-wrap: wrap;
            row-gap: 10px;
          }
          .kpiGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .analyticsGrid {
            grid-template-columns: 1fr;
          }
          .heroPanel {
            flex-direction: column;
          }
          .heroStats {
            width: 100%;
          }
        }
        @media (max-width: 700px) {
          .dashboardShell {
            padding-top: 14px;
          }
          .topNav {
            top: 8px;
          }
          .navTabs {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 2px;
          }
          .kpiGrid {
            grid-template-columns: 1fr;
          }
          .heroTitle {
            font-size: 1.35rem;
          }
          .heroSub {
            font-size: 0.8rem;
          }
        }
      `}</style>

      <div className="dashboardShell">
        <header className="topNav">
          <div className="brand">
            <span className="brandBadge">📊</span>
            SimplyUI Reports
          </div>

          <div className="navTabs">
            <span className="navTab navTabActive">Overview</span>
            <span className="navTab">Revenue</span>
            <span className="navTab">Segments</span>
            <span className="navTab">Automation</span>
            <span className="navTab">Exports</span>
          </div>

          <div className="navActions">
            <button className="ghostBtn">⚙️ Filters</button>
            <button className="primaryBtn">⬇️ Export</button>
          </div>
        </header>

        <section className="heroPanel">
          <div>
            <h1 className="heroTitle">Reporting Dashboard</h1>
            <p className="heroSub">
              Real-time reporting across revenue, team throughput, and quality confidence.
              Built with your brand palette to match the landing experience.
            </p>
          </div>

          <div className="heroStats">
            <div className="heroStatCard">
              <div className="heroStatValue">99.2%</div>
              <div className="heroStatLabel">SLA Accuracy</div>
            </div>
            <div className="heroStatCard">
              <div className="heroStatValue">+18.4%</div>
              <div className="heroStatLabel">Growth Rate</div>
            </div>
            <div className="heroStatCard">
              <div className="heroStatValue">2,230</div>
              <div className="heroStatLabel">Reports / Month</div>
            </div>
            <div className="heroStatCard">
              <div className="heroStatValue">4.8 / 5</div>
              <div className="heroStatLabel">Stakeholder Score</div>
            </div>
          </div>
        </section>

        <section className="kpiGrid">
          {kpis.map((item) => <MetricCard key={item.label} item={item} />)}
        </section>

        <section className="analyticsGrid">
          <article className="panel">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">📈 Monthly Revenue Trend</div>
                <div className="panelSub">Aug 2025 → Feb 2026</div>
              </div>
              <span className="chip">Live</span>
            </div>
            <RevenueChart />
          </article>

          <article className="panel">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">🌍 Regional Distribution</div>
                <div className="panelSub">Revenue share by geography</div>
              </div>
              <span className="chip">Quarterly</span>
            </div>
            <RegionBreakdown />
          </article>
        </section>

        <section className="analyticsGrid">
          <article className="panel">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">⚡ Throughput Velocity</div>
                <div className="panelSub">Reports generated per month</div>
              </div>
              <span className="chip">7 Months</span>
            </div>
            <ThroughputPanel />
          </article>

          <article className="panel">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">🧠 AI Insights</div>
                <div className="panelSub">What changed this cycle</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Revenue quality increased after switching to segment-aware prompts.',
                'Executive reports are generated 22 minutes faster on average.',
                'Review queue reduced by 31% with automatic anomaly flagging.',
                'Enterprise teams are driving most of the ARR expansion.',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 12,
                    border: '1px solid rgba(31, 26, 22, 0.09)',
                    background: 'rgba(255,255,255,0.86)',
                    padding: '10px 12px',
                    fontSize: '0.78rem',
                    lineHeight: 1.45,
                    color: '#4f463f',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="tablePanel">
          <div className="tableHeader">
            <div className="tableTitle">📋 Recent Reports</div>
            <span className="chip">{recentReports.length} items</span>
          </div>
          <div className="tableWrap">
            <table className="reportTable">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Team</th>
                  <th>Owner</th>
                  <th>Quality Score</th>
                  <th>Generated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.team}</td>
                    <td>{row.owner}</td>
                    <td>{row.score}</td>
                    <td>{row.generatedAt}</td>
                    <td><StatusPill status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
