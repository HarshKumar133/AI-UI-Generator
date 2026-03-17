import React from 'react';
import { Navbar, Card, Stat, Chart, Progress, Table, Badge } from '@/components/ui';

export default function GeneratedUI() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fffdf9' }}>
      <Navbar brand="📊 DataSense AI" items={[{ label: 'Overview', href: '#', active: true }, { label: 'Reports', href: '#' }, { label: 'Users', href: '#' }, { label: 'Settings', href: '#' }]} actions={[{ label: '✨ New Report', variant: 'primary' }]} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', padding: '24px' }}>
        <Card title="💰 Total Revenue" subtitle="Last 30 days performance">
          <Stat label="Revenue" value="$1,284,590" trend={{ value: '+12.5%', positive: true }} icon="💰" subtitle="vs previous month" />
          <div style={{ marginTop: 16 }}><Progress value={78} label="Monthly Target" color="emerald" /></div>
        </Card>
        <Card title="👥 Active Users" subtitle="Real-time user activity">
          <Stat label="Users Online" value={3842} trend={{ value: '+8.2%', positive: true }} icon="👥" />
          <Chart type="line" title="User Growth (7 days)" data={[{ label: 'Mon', value: 3200 }, { label: 'Tue', value: 3400 }, { label: 'Wed', value: 3100 }, { label: 'Thu', value: 3600 }, { label: 'Fri', value: 3800 }, { label: 'Sat', value: 3500 }, { label: 'Sun', value: 3842 }]} height={180} />
        </Card>
        <Card title="📈 Revenue by Channel" subtitle="Monthly breakdown">
          <Chart type="bar" title="Monthly Revenue" data={[{ label: 'Jan', value: 42000 }, { label: 'Feb', value: 38000 }, { label: 'Mar', value: 55000 }, { label: 'Apr', value: 47000 }, { label: 'May', value: 61000 }, { label: 'Jun', value: 58000 }]} height={220} />
        </Card>
        <Card title="🌐 Traffic Sources" subtitle="Where your visitors come from">
          <Chart type="pie" title="Traffic Distribution" data={[{ label: 'Organic', value: 42 }, { label: 'Direct', value: 28 }, { label: 'Social', value: 18 }, { label: 'Referral', value: 12 }]} />
        </Card>
        <Card title="🏆 Top Customers" subtitle="Highest value accounts" padding="none">
          <Table columns={[{ key: 'name', header: 'Customer' }, { key: 'email', header: 'Email' }, { key: 'plan', header: 'Plan' }, { key: 'revenue', header: 'Revenue' }, { key: 'status', header: 'Status' }]} data={[{ name: 'Sarah Chen', email: 'sarah@acme.co', plan: 'Enterprise', revenue: '$12,400', status: '✅ Active' }, { name: 'James Wilson', email: 'james@startup.io', plan: 'Pro', revenue: '$8,200', status: '✅ Active' }, { name: 'Maria Garcia', email: 'maria@corp.com', plan: 'Enterprise', revenue: '$15,900', status: '✅ Active' }, { name: 'Alex Kim', email: 'alex@tech.dev', plan: 'Starter', revenue: '$2,100', status: '⏸ Paused' }, { name: 'Emily Park', email: 'emily@global.io', plan: 'Pro', revenue: '$6,800', status: '✅ Active' }]} striped={true} />
        </Card>
      </div>
    </div>
  );
}