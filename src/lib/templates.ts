// ============================================
// PRELOADED TEMPLATES
// Instant-loading, prebuilt UI templates
// No API calls needed — templates render immediately
// ============================================

import { GenerationResult } from '@/types';

export interface Template {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'dashboard' | 'admin' | 'saas' | 'marketing';
    tags: string[];
    result: GenerationResult;
}

const ts = () => new Date().toISOString();

export const TEMPLATES: Template[] = [
    // ─────────────────────────────────────────────
    // 1. ANALYTICS DASHBOARD
    // ─────────────────────────────────────────────
    {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        description: 'Revenue metrics, charts, user data table, and traffic breakdown',
        icon: 'BarChart3',
        category: 'dashboard',
        tags: ['charts', 'kpi', 'table', 'navbar'],
        result: {
            userPrompt: 'Analytics Dashboard',
            version: 1,
            timestamp: ts(),
            plan: {
                layout: 'dashboard',
                components: [
                    {
                        type: 'Navbar', props: {
                            brand: '📊 DataSense AI', items: [
                                { label: 'Overview', href: '#', active: true },
                                { label: 'Reports', href: '#' },
                                { label: 'Users', href: '#' },
                                { label: 'Settings', href: '#' },
                            ], actions: [{ label: '✨ New Report', variant: 'primary' }],
                        }
                    },
                    {
                        type: 'Card', props: { title: '💰 Total Revenue', subtitle: 'Last 30 days performance' },
                        children: [
                            { type: 'Stat', props: { label: 'Revenue', value: '$1,284,590', trend: { value: '+12.5%', positive: true }, icon: '💰', subtitle: 'vs previous month' } },
                            { type: 'Progress', props: { value: 78, label: 'Monthly Target', color: 'emerald' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '👥 Active Users', subtitle: 'Real-time user activity' },
                        children: [
                            { type: 'Stat', props: { label: 'Users Online', value: 3842, trend: { value: '+8.2%', positive: true }, icon: '👥' } },
                            { type: 'Chart', props: { type: 'line', title: 'User Growth (7 days)', data: [{ label: 'Mon', value: 3200 }, { label: 'Tue', value: 3400 }, { label: 'Wed', value: 3100 }, { label: 'Thu', value: 3600 }, { label: 'Fri', value: 3800 }, { label: 'Sat', value: 3500 }, { label: 'Sun', value: 3842 }], height: 180 } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📈 Revenue by Channel', subtitle: 'Monthly breakdown' },
                        children: [
                            { type: 'Chart', props: { type: 'bar', title: 'Monthly Revenue', data: [{ label: 'Jan', value: 42000 }, { label: 'Feb', value: 38000 }, { label: 'Mar', value: 55000 }, { label: 'Apr', value: 47000 }, { label: 'May', value: 61000 }, { label: 'Jun', value: 58000 }], height: 220 } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '🌐 Traffic Sources', subtitle: 'Where your visitors come from' },
                        children: [
                            { type: 'Chart', props: { type: 'pie', title: 'Traffic Distribution', data: [{ label: 'Organic', value: 42 }, { label: 'Direct', value: 28 }, { label: 'Social', value: 18 }, { label: 'Referral', value: 12 }] } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '🏆 Top Customers', subtitle: 'Highest value accounts' },
                        children: [
                            {
                                type: 'Table', props: {
                                    columns: [{ key: 'name', header: 'Customer' }, { key: 'email', header: 'Email' }, { key: 'plan', header: 'Plan' }, { key: 'revenue', header: 'Revenue' }, { key: 'status', header: 'Status' }],
                                    data: [
                                        { name: 'Sarah Chen', email: 'sarah@acme.co', plan: 'Enterprise', revenue: '$12,400', status: '✅ Active' },
                                        { name: 'James Wilson', email: 'james@startup.io', plan: 'Pro', revenue: '$8,200', status: '✅ Active' },
                                        { name: 'Maria Garcia', email: 'maria@corp.com', plan: 'Enterprise', revenue: '$15,900', status: '✅ Active' },
                                        { name: 'Alex Kim', email: 'alex@tech.dev', plan: 'Starter', revenue: '$2,100', status: '⏸ Paused' },
                                        { name: 'Emily Park', email: 'emily@global.io', plan: 'Pro', revenue: '$6,800', status: '✅ Active' },
                                    ], striped: true,
                                }
                            },
                        ]
                    },
                ],
                reasoning: 'Dashboard layout with Navbar, KPI Stat cards, line/bar/pie Charts, Progress bar, and a customer Table.',
            },
            generation: {
                code: `import React from 'react';
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
}`,
                componentList: ['Navbar', 'Card', 'Stat', 'Chart', 'Progress', 'Table'],
            },
            explanation: {
                explanation: 'A comprehensive analytics dashboard featuring KPI metrics with trend indicators, interactive charts (line, bar, pie), progress tracking, and a detailed customer data table.',
                componentChoices: [
                    { component: 'Navbar', reason: 'Top navigation for dashboard sections' },
                    { component: 'Stat', reason: 'Large KPI values with trends' },
                    { component: 'Chart', reason: 'Data visualization (line, bar, pie)' },
                    { component: 'Table', reason: 'Tabular customer data display' },
                ],
                layoutReason: 'Dashboard layout with responsive grid for flexible card arrangement',
            },
        },
    },

    // ─────────────────────────────────────────────
    // 2. CRM INTERFACE
    // ─────────────────────────────────────────────
    {
        id: 'crm-interface',
        name: 'CRM Dashboard',
        description: 'Contact management with pipeline stats, activity feed, and team overview',
        icon: 'Briefcase',
        category: 'saas',
        tags: ['crm', 'contacts', 'pipeline', 'stats'],
        result: {
            userPrompt: 'CRM Dashboard',
            version: 1,
            timestamp: ts(),
            plan: {
                layout: 'dashboard',
                components: [
                    {
                        type: 'Navbar', props: {
                            brand: '💼 SalesForge', items: [
                                { label: 'Pipeline', href: '#', active: true },
                                { label: 'Contacts', href: '#' },
                                { label: 'Deals', href: '#' },
                                { label: 'Reports', href: '#' },
                            ], actions: [{ label: '+ New Deal', variant: 'primary' }],
                        }
                    },
                    {
                        type: 'Card', props: { title: '🎯 Pipeline Overview', subtitle: 'Current quarter performance' },
                        children: [
                            { type: 'Stat', props: { label: 'Total Pipeline', value: '$4.2M', trend: { value: '+18%', positive: true }, icon: '🎯' } },
                            { type: 'Progress', props: { value: 65, label: 'Quarterly Goal', color: 'blue' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '🤝 Won Deals', subtitle: 'Closed this month' },
                        children: [
                            { type: 'Stat', props: { label: 'Deals Closed', value: 47, trend: { value: '+23%', positive: true }, icon: '🤝', subtitle: 'vs last month' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📞 Open Activities', subtitle: 'Pending follow-ups' },
                        children: [
                            { type: 'Stat', props: { label: 'Activities', value: 128, trend: { value: '-5%', positive: false }, icon: '📞' } },
                            { type: 'Alert', props: { variant: 'warning', title: 'Action Required', children: '12 follow-ups are overdue. Review your pipeline.' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '👥 Top Contacts', subtitle: 'Most engaged leads' },
                        children: [
                            {
                                type: 'Table', props: {
                                    columns: [{ key: 'name', header: 'Contact' }, { key: 'company', header: 'Company' }, { key: 'deal', header: 'Deal Value' }, { key: 'stage', header: 'Stage' }, { key: 'score', header: 'Score' }],
                                    data: [
                                        { name: 'Michael Brown', company: 'TechCorp', deal: '$180,000', stage: 'Negotiation', score: '🔥 95' },
                                        { name: 'Lisa Wang', company: 'DataFlow', deal: '$120,000', stage: 'Proposal', score: '🔥 88' },
                                        { name: 'David Lee', company: 'CloudBase', deal: '$95,000', stage: 'Discovery', score: '⚡ 72' },
                                        { name: 'Anna Smith', company: 'Vertix AI', deal: '$210,000', stage: 'Closed Won', score: '🔥 99' },
                                    ], striped: true,
                                }
                            },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📊 Deal Stage Breakdown', subtitle: 'Pipeline by stage' },
                        children: [
                            { type: 'Chart', props: { type: 'bar', title: 'Pipeline Stages', data: [{ label: 'Lead', value: 45 }, { label: 'Qualified', value: 32 }, { label: 'Proposal', value: 18 }, { label: 'Negotiation', value: 12 }, { label: 'Closed', value: 47 }], height: 200 } },
                        ]
                    },
                ],
                reasoning: 'CRM dashboard with pipeline KPIs, deal stages chart, contacts table, and activity alerts.',
            },
            generation: {
                code: `import React from 'react';
import { Navbar, Card, Stat, Chart, Progress, Table, Alert } from '@/components/ui';

export default function GeneratedUI() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar brand="💼 SalesForge" items={[{ label: 'Pipeline', href: '#', active: true }, { label: 'Contacts', href: '#' }, { label: 'Deals', href: '#' }, { label: 'Reports', href: '#' }]} actions={[{ label: '+ New Deal', variant: 'primary' }]} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', padding: '24px' }}>
        <Card title="🎯 Pipeline Overview" subtitle="Current quarter performance">
          <Stat label="Total Pipeline" value="$4.2M" trend={{ value: '+18%', positive: true }} icon="🎯" />
          <div style={{ marginTop: 16 }}><Progress value={65} label="Quarterly Goal" color="blue" /></div>
        </Card>
        <Card title="🤝 Won Deals" subtitle="Closed this month">
          <Stat label="Deals Closed" value={47} trend={{ value: '+23%', positive: true }} icon="🤝" subtitle="vs last month" />
        </Card>
        <Card title="📞 Open Activities" subtitle="Pending follow-ups">
          <Stat label="Activities" value={128} trend={{ value: '-5%', positive: false }} icon="📞" />
          <div style={{ marginTop: 12 }}><Alert variant="warning" title="Action Required">12 follow-ups are overdue. Review your pipeline.</Alert></div>
        </Card>
        <Card title="👥 Top Contacts" subtitle="Most engaged leads">
          <Table columns={[{ key: 'name', header: 'Contact' }, { key: 'company', header: 'Company' }, { key: 'deal', header: 'Deal Value' }, { key: 'stage', header: 'Stage' }, { key: 'score', header: 'Score' }]} data={[{ name: 'Michael Brown', company: 'TechCorp', deal: '$180,000', stage: 'Negotiation', score: '🔥 95' }, { name: 'Lisa Wang', company: 'DataFlow', deal: '$120,000', stage: 'Proposal', score: '🔥 88' }, { name: 'David Lee', company: 'CloudBase', deal: '$95,000', stage: 'Discovery', score: '⚡ 72' }, { name: 'Anna Smith', company: 'Vertix AI', deal: '$210,000', stage: 'Closed Won', score: '🔥 99' }]} striped={true} />
        </Card>
        <Card title="📊 Deal Stage Breakdown" subtitle="Pipeline by stage">
          <Chart type="bar" title="Pipeline Stages" data={[{ label: 'Lead', value: 45 }, { label: 'Qualified', value: 32 }, { label: 'Proposal', value: 18 }, { label: 'Negotiation', value: 12 }, { label: 'Closed', value: 47 }]} height={200} />
        </Card>
      </div>
    </div>
  );
}`,
                componentList: ['Navbar', 'Card', 'Stat', 'Chart', 'Progress', 'Table', 'Alert'],
            },
            explanation: {
                explanation: 'A CRM dashboard with pipeline metrics, deal tracking, contact management, and activity alerts.',
                componentChoices: [{ component: 'Stat', reason: 'Pipeline KPIs' }, { component: 'Alert', reason: 'Overdue follow-up warning' }, { component: 'Table', reason: 'Contact list' }],
                layoutReason: 'Dashboard grid layout for at-a-glance CRM overview',
            },
        },
    },

    // ─────────────────────────────────────────────
    // 3. E-COMMERCE ADMIN
    // ─────────────────────────────────────────────
    {
        id: 'ecommerce-admin',
        name: 'E-Commerce Admin',
        description: 'Order management, product stats, revenue charts, and inventory alerts',
        icon: 'ShoppingCart',
        category: 'admin',
        tags: ['ecommerce', 'orders', 'products', 'inventory'],
        result: {
            userPrompt: 'E-Commerce Admin Panel',
            version: 1,
            timestamp: ts(),
            plan: {
                layout: 'sidebar-layout',
                components: [
                    {
                        type: 'Sidebar', props: {
                            title: '🛒 ShopAdmin', width: 'md',
                            groups: [
                                { label: 'Main', items: [{ id: 'dash', label: 'Dashboard', icon: '📊', active: true }, { id: 'orders', label: 'Orders', icon: '📦' }, { id: 'products', label: 'Products', icon: '🏷️' }, { id: 'customers', label: 'Customers', icon: '👥' }] },
                                { label: 'Settings', items: [{ id: 'store', label: 'Store Settings', icon: '⚙️' }, { id: 'payments', label: 'Payments', icon: '💳' }, { id: 'shipping', label: 'Shipping', icon: '🚚' }] },
                            ],
                        }
                    },
                    {
                        type: 'Card', props: { title: '💰 Revenue Today', subtitle: 'Real-time sales data' },
                        children: [
                            { type: 'Stat', props: { label: 'Today\'s Revenue', value: '$24,580', trend: { value: '+15.3%', positive: true }, icon: '💰' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📦 Orders', subtitle: 'Pending fulfillment' },
                        children: [
                            { type: 'Stat', props: { label: 'Pending Orders', value: 34, trend: { value: '+8', positive: true }, icon: '📦' } },
                            { type: 'Progress', props: { value: 82, label: 'Fulfillment Rate', color: 'blue' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📈 Weekly Sales', subtitle: 'Last 7 days trend' },
                        children: [
                            { type: 'Chart', props: { type: 'line', title: 'Daily Sales', data: [{ label: 'Mon', value: 18500 }, { label: 'Tue', value: 22000 }, { label: 'Wed', value: 19800 }, { label: 'Thu', value: 24500 }, { label: 'Fri', value: 28000 }, { label: 'Sat', value: 31000 }, { label: 'Sun', value: 24580 }], height: 200 } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '🏷️ Top Products', subtitle: 'Best sellers this month' },
                        children: [
                            {
                                type: 'Table', props: {
                                    columns: [{ key: 'product', header: 'Product' }, { key: 'sales', header: 'Sales' }, { key: 'revenue', header: 'Revenue' }, { key: 'stock', header: 'Stock' }],
                                    data: [
                                        { product: 'Wireless Headphones Pro', sales: '1,247', revenue: '$124,700', stock: '✅ In Stock' },
                                        { product: 'Smart Watch Ultra', sales: '892', revenue: '$178,400', stock: '⚠️ Low Stock' },
                                        { product: 'USB-C Hub 7-in-1', sales: '2,103', revenue: '$84,120', stock: '✅ In Stock' },
                                        { product: 'Mechanical Keyboard', sales: '634', revenue: '$82,420', stock: '❌ Out of Stock' },
                                    ], striped: true,
                                }
                            },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '⚠️ Inventory Alerts' },
                        children: [
                            { type: 'Alert', props: { variant: 'error', title: 'Out of Stock', children: 'Mechanical Keyboard — 0 units remaining. Reorder now.' } },
                            { type: 'Alert', props: { variant: 'warning', title: 'Low Stock', children: 'Smart Watch Ultra — Only 12 units left.' } },
                            { type: 'Alert', props: { variant: 'success', title: 'Restocked', children: 'Wireless Headphones Pro — 500 units received today.' } },
                        ]
                    },
                ],
                reasoning: 'Sidebar layout for e-commerce admin with navigation, KPIs, sales chart, product table, and inventory alerts.',
            },
            generation: {
                code: `import React from 'react';
import { Sidebar, Card, Stat, Chart, Progress, Table, Alert } from '@/components/ui';

export default function GeneratedUI() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar title="🛒 ShopAdmin" groups={[
        { label: 'Main', items: [{ id: 'dash', label: 'Dashboard', icon: '📊', active: true }, { id: 'orders', label: 'Orders', icon: '📦' }, { id: 'products', label: 'Products', icon: '🏷️' }, { id: 'customers', label: 'Customers', icon: '👥' }] },
        { label: 'Settings', items: [{ id: 'store', label: 'Store Settings', icon: '⚙️' }, { id: 'payments', label: 'Payments', icon: '💳' }, { id: 'shipping', label: 'Shipping', icon: '🚚' }] },
      ]} />
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <Card title="💰 Revenue Today" subtitle="Real-time sales data">
            <Stat label="Today's Revenue" value="$24,580" trend={{ value: '+15.3%', positive: true }} icon="💰" />
          </Card>
          <Card title="📦 Orders" subtitle="Pending fulfillment">
            <Stat label="Pending Orders" value={34} trend={{ value: '+8', positive: true }} icon="📦" />
            <div style={{ marginTop: 16 }}><Progress value={82} label="Fulfillment Rate" color="blue" /></div>
          </Card>
          <Card title="📈 Weekly Sales" subtitle="Last 7 days trend">
            <Chart type="line" title="Daily Sales" data={[{ label: 'Mon', value: 18500 }, { label: 'Tue', value: 22000 }, { label: 'Wed', value: 19800 }, { label: 'Thu', value: 24500 }, { label: 'Fri', value: 28000 }, { label: 'Sat', value: 31000 }, { label: 'Sun', value: 24580 }]} height={200} />
          </Card>
          <Card title="🏷️ Top Products" subtitle="Best sellers this month">
            <Table columns={[{ key: 'product', header: 'Product' }, { key: 'sales', header: 'Sales' }, { key: 'revenue', header: 'Revenue' }, { key: 'stock', header: 'Stock' }]} data={[{ product: 'Wireless Headphones Pro', sales: '1,247', revenue: '$124,700', stock: '✅ In Stock' }, { product: 'Smart Watch Ultra', sales: '892', revenue: '$178,400', stock: '⚠️ Low Stock' }, { product: 'USB-C Hub 7-in-1', sales: '2,103', revenue: '$84,120', stock: '✅ In Stock' }, { product: 'Mechanical Keyboard', sales: '634', revenue: '$82,420', stock: '❌ Out of Stock' }]} striped={true} />
          </Card>
          <Card title="⚠️ Inventory Alerts">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Alert variant="error" title="Out of Stock">Mechanical Keyboard — 0 units remaining. Reorder now.</Alert>
              <Alert variant="warning" title="Low Stock">Smart Watch Ultra — Only 12 units left.</Alert>
              <Alert variant="success" title="Restocked">Wireless Headphones Pro — 500 units received today.</Alert>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}`,
                componentList: ['Sidebar', 'Card', 'Stat', 'Chart', 'Progress', 'Table', 'Alert'],
            },
            explanation: {
                explanation: 'An e-commerce admin panel with sidebar navigation, sales KPIs, weekly trend chart, product inventory table, and stock alerts.',
                componentChoices: [{ component: 'Sidebar', reason: 'Admin navigation' }, { component: 'Alert', reason: 'Stock warnings' }],
                layoutReason: 'Sidebar layout typical for admin panels',
            },
        },
    },

    // ─────────────────────────────────────────────
    // 4. PROJECT MANAGEMENT
    // ─────────────────────────────────────────────
    {
        id: 'project-manager',
        name: 'Project Manager',
        description: 'Sprint tracker with task progress, team avatars, and timeline chart',
        icon: 'ClipboardList',
        category: 'saas',
        tags: ['project', 'tasks', 'team', 'progress'],
        result: {
            userPrompt: 'Project Management Dashboard',
            version: 1,
            timestamp: ts(),
            plan: {
                layout: 'dashboard',
                components: [
                    {
                        type: 'Navbar', props: {
                            brand: '📋 ProjectFlow', items: [
                                { label: 'Board', href: '#', active: true },
                                { label: 'Timeline', href: '#' },
                                { label: 'Team', href: '#' },
                                { label: 'Reports', href: '#' },
                            ], actions: [{ label: '+ New Task', variant: 'primary' }],
                        }
                    },
                    {
                        type: 'Card', props: { title: '🚀 Sprint Progress', subtitle: 'Sprint 24 — 8 days remaining' },
                        children: [
                            { type: 'Progress', props: { value: 68, label: 'Sprint Completion', color: 'emerald', size: 'lg' } },
                            { type: 'Divider', props: { spacing: 'sm' } },
                            { type: 'Stat', props: { label: 'Tasks Completed', value: '34 / 50', icon: '✅', trend: { value: '+12 this week', positive: true } } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '⏱️ Time Tracking', subtitle: 'Hours logged this week' },
                        children: [
                            { type: 'Stat', props: { label: 'Hours Logged', value: '142h', trend: { value: '+18h', positive: true }, icon: '⏱️', subtitle: 'vs last week' } },
                            { type: 'Chart', props: { type: 'bar', title: 'Daily Hours', data: [{ label: 'Mon', value: 28 }, { label: 'Tue', value: 32 }, { label: 'Wed', value: 26 }, { label: 'Thu', value: 30 }, { label: 'Fri', value: 26 }], height: 160 } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📊 Task Status', subtitle: 'Overall project health' },
                        children: [
                            { type: 'Chart', props: { type: 'pie', data: [{ label: 'Completed', value: 34 }, { label: 'In Progress', value: 12 }, { label: 'Review', value: 4 }, { label: 'Blocked', value: 2 }] } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📝 Recent Tasks', subtitle: 'Latest updates' },
                        children: [
                            {
                                type: 'Table', props: {
                                    columns: [{ key: 'task', header: 'Task' }, { key: 'assignee', header: 'Assignee' }, { key: 'priority', header: 'Priority' }, { key: 'status', header: 'Status' }],
                                    data: [
                                        { task: 'Implement user auth', assignee: 'Sarah C.', priority: '🔴 High', status: '✅ Done' },
                                        { task: 'Design landing page', assignee: 'Mike R.', priority: '🟡 Medium', status: '🔄 In Progress' },
                                        { task: 'API rate limiting', assignee: 'Alex K.', priority: '🔴 High', status: '🔄 In Progress' },
                                        { task: 'Write unit tests', assignee: 'Emily P.', priority: '🟢 Low', status: '⏳ To Do' },
                                        { task: 'Database migration', assignee: 'David L.', priority: '🟡 Medium', status: '🚫 Blocked' },
                                    ], striped: true,
                                }
                            },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '⚡ Quick Actions' },
                        children: [
                            { type: 'Alert', props: { variant: 'info', title: 'Sprint Review', children: 'Sprint review meeting scheduled for Friday 3:00 PM.' } },
                            { type: 'Toggle', props: { label: 'Auto-assign new tasks', checked: true } },
                            { type: 'Toggle', props: { label: 'Email notifications', checked: false } },
                        ]
                    },
                ],
                reasoning: 'Project management dashboard with sprint progress, time tracking, task status pie chart, recent tasks table, and quick action toggles.',
            },
            generation: {
                code: `import React from 'react';
import { Navbar, Card, Stat, Chart, Progress, Table, Alert, Toggle, Divider } from '@/components/ui';

export default function GeneratedUI() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar brand="📋 ProjectFlow" items={[{ label: 'Board', href: '#', active: true }, { label: 'Timeline', href: '#' }, { label: 'Team', href: '#' }, { label: 'Reports', href: '#' }]} actions={[{ label: '+ New Task', variant: 'primary' }]} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, padding: 24 }}>
        <Card title="🚀 Sprint Progress" subtitle="Sprint 24 — 8 days remaining">
          <Progress value={68} label="Sprint Completion" color="emerald" size="lg" />
          <Divider spacing="sm" />
          <Stat label="Tasks Completed" value="34 / 50" icon="✅" trend={{ value: '+12 this week', positive: true }} />
        </Card>
        <Card title="⏱️ Time Tracking" subtitle="Hours logged this week">
          <Stat label="Hours Logged" value="142h" trend={{ value: '+18h', positive: true }} icon="⏱️" subtitle="vs last week" />
          <Chart type="bar" title="Daily Hours" data={[{ label: 'Mon', value: 28 }, { label: 'Tue', value: 32 }, { label: 'Wed', value: 26 }, { label: 'Thu', value: 30 }, { label: 'Fri', value: 26 }]} height={160} />
        </Card>
        <Card title="📊 Task Status" subtitle="Overall project health">
          <Chart type="pie" data={[{ label: 'Completed', value: 34 }, { label: 'In Progress', value: 12 }, { label: 'Review', value: 4 }, { label: 'Blocked', value: 2 }]} />
        </Card>
        <Card title="📝 Recent Tasks" subtitle="Latest updates">
          <Table columns={[{ key: 'task', header: 'Task' }, { key: 'assignee', header: 'Assignee' }, { key: 'priority', header: 'Priority' }, { key: 'status', header: 'Status' }]} data={[{ task: 'Implement user auth', assignee: 'Sarah C.', priority: '🔴 High', status: '✅ Done' }, { task: 'Design landing page', assignee: 'Mike R.', priority: '🟡 Medium', status: '🔄 In Progress' }, { task: 'API rate limiting', assignee: 'Alex K.', priority: '🔴 High', status: '🔄 In Progress' }, { task: 'Write unit tests', assignee: 'Emily P.', priority: '🟢 Low', status: '⏳ To Do' }, { task: 'Database migration', assignee: 'David L.', priority: '🟡 Medium', status: '🚫 Blocked' }]} striped={true} />
        </Card>
        <Card title="⚡ Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Alert variant="info" title="Sprint Review">Sprint review meeting scheduled for Friday 3:00 PM.</Alert>
            <Toggle label="Auto-assign new tasks" checked={true} />
            <Toggle label="Email notifications" checked={false} />
          </div>
        </Card>
      </div>
    </div>
  );
}`,
                componentList: ['Navbar', 'Card', 'Stat', 'Chart', 'Progress', 'Table', 'Alert', 'Toggle', 'Divider'],
            },
            explanation: {
                explanation: 'A project management dashboard with sprint tracking, time logs, task status visualization, and configurable settings.',
                componentChoices: [{ component: 'Progress', reason: 'Sprint completion tracking' }, { component: 'Toggle', reason: 'Quick settings' }],
                layoutReason: 'Dashboard layout for project overview',
            },
        },
    },

    // ─────────────────────────────────────────────
    // 5. FINANCE TRACKER
    // ─────────────────────────────────────────────
    {
        id: 'finance-tracker',
        name: 'Finance Tracker',
        description: 'Budget management, expense breakdown, investment portfolio, and transaction log',
        icon: 'TrendingUp',
        category: 'dashboard',
        tags: ['finance', 'budget', 'expenses', 'investments'],
        result: {
            userPrompt: 'Finance Tracker Dashboard',
            version: 1,
            timestamp: ts(),
            plan: {
                layout: 'dashboard',
                components: [
                    {
                        type: 'Navbar', props: {
                            brand: '📈 FinTrack', items: [
                                { label: 'Dashboard', href: '#', active: true },
                                { label: 'Transactions', href: '#' },
                                { label: 'Budget', href: '#' },
                                { label: 'Goals', href: '#' },
                            ], actions: [{ label: '+ Add Transaction', variant: 'primary' }],
                        }
                    },
                    {
                        type: 'Card', props: { title: '💳 Total Balance', subtitle: 'All accounts combined' },
                        children: [
                            { type: 'Stat', props: { label: 'Balance', value: '$87,435.20', trend: { value: '+$3,240', positive: true }, icon: '💳', subtitle: 'this month' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📤 Monthly Spending', subtitle: 'February 2026' },
                        children: [
                            { type: 'Stat', props: { label: 'Spent', value: '$4,820', trend: { value: '-12%', positive: true }, icon: '📤', subtitle: 'vs last month' } },
                            { type: 'Progress', props: { value: 64, label: 'Budget Used', color: 'amber' } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📊 Expense Breakdown', subtitle: 'By category this month' },
                        children: [
                            { type: 'Chart', props: { type: 'pie', data: [{ label: 'Housing', value: 1800 }, { label: 'Food', value: 850 }, { label: 'Transport', value: 420 }, { label: 'Entertainment', value: 350 }, { label: 'Utilities', value: 280 }, { label: 'Other', value: 1120 }] } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '📈 Portfolio Performance', subtitle: '6-month trend' },
                        children: [
                            { type: 'Chart', props: { type: 'line', title: 'Portfolio Value', data: [{ label: 'Sep', value: 72000 }, { label: 'Oct', value: 75500 }, { label: 'Nov', value: 73200 }, { label: 'Dec', value: 78400 }, { label: 'Jan', value: 82100 }, { label: 'Feb', value: 87435 }], height: 200 } },
                        ]
                    },
                    {
                        type: 'Card', props: { title: '💸 Recent Transactions', subtitle: 'Last 5 transactions' },
                        children: [
                            {
                                type: 'Table', props: {
                                    columns: [{ key: 'desc', header: 'Description' }, { key: 'category', header: 'Category' }, { key: 'amount', header: 'Amount' }, { key: 'date', header: 'Date' }],
                                    data: [
                                        { desc: 'Grocery Store', category: '🛒 Food', amount: '-$142.50', date: 'Feb 21' },
                                        { desc: 'Salary Deposit', category: '💰 Income', amount: '+$5,500.00', date: 'Feb 20' },
                                        { desc: 'Netflix', category: '🎬 Entertainment', amount: '-$15.99', date: 'Feb 19' },
                                        { desc: 'Gas Station', category: '⛽ Transport', amount: '-$48.20', date: 'Feb 18' },
                                        { desc: 'Freelance Payment', category: '💼 Income', amount: '+$1,200.00', date: 'Feb 17' },
                                    ], striped: true,
                                }
                            },
                        ]
                    },
                ],
                reasoning: 'Finance dashboard with balance KPI, spending tracker, expense pie chart, portfolio line chart, and transaction table.',
            },
            generation: {
                code: `import React from 'react';
import { Navbar, Card, Stat, Chart, Progress, Table } from '@/components/ui';

export default function GeneratedUI() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar brand="📈 FinTrack" items={[{ label: 'Dashboard', href: '#', active: true }, { label: 'Transactions', href: '#' }, { label: 'Budget', href: '#' }, { label: 'Goals', href: '#' }]} actions={[{ label: '+ Add Transaction', variant: 'primary' }]} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, padding: 24 }}>
        <Card title="💳 Total Balance" subtitle="All accounts combined">
          <Stat label="Balance" value="$87,435.20" trend={{ value: '+$3,240', positive: true }} icon="💳" subtitle="this month" />
        </Card>
        <Card title="📤 Monthly Spending" subtitle="February 2026">
          <Stat label="Spent" value="$4,820" trend={{ value: '-12%', positive: true }} icon="📤" subtitle="vs last month" />
          <div style={{ marginTop: 16 }}><Progress value={64} label="Budget Used" color="amber" /></div>
        </Card>
        <Card title="📊 Expense Breakdown" subtitle="By category this month">
          <Chart type="pie" data={[{ label: 'Housing', value: 1800 }, { label: 'Food', value: 850 }, { label: 'Transport', value: 420 }, { label: 'Entertainment', value: 350 }, { label: 'Utilities', value: 280 }, { label: 'Other', value: 1120 }]} />
        </Card>
        <Card title="📈 Portfolio Performance" subtitle="6-month trend">
          <Chart type="line" title="Portfolio Value" data={[{ label: 'Sep', value: 72000 }, { label: 'Oct', value: 75500 }, { label: 'Nov', value: 73200 }, { label: 'Dec', value: 78400 }, { label: 'Jan', value: 82100 }, { label: 'Feb', value: 87435 }]} height={200} />
        </Card>
        <Card title="💸 Recent Transactions" subtitle="Last 5 transactions">
          <Table columns={[{ key: 'desc', header: 'Description' }, { key: 'category', header: 'Category' }, { key: 'amount', header: 'Amount' }, { key: 'date', header: 'Date' }]} data={[{ desc: 'Grocery Store', category: '🛒 Food', amount: '-$142.50', date: 'Feb 21' }, { desc: 'Salary Deposit', category: '💰 Income', amount: '+$5,500.00', date: 'Feb 20' }, { desc: 'Netflix', category: '🎬 Entertainment', amount: '-$15.99', date: 'Feb 19' }, { desc: 'Gas Station', category: '⛽ Transport', amount: '-$48.20', date: 'Feb 18' }, { desc: 'Freelance Payment', category: '💼 Income', amount: '+$1,200.00', date: 'Feb 17' }]} striped={true} />
        </Card>
      </div>
    </div>
  );
}`,
                componentList: ['Navbar', 'Card', 'Stat', 'Chart', 'Progress', 'Table'],
            },
            explanation: {
                explanation: 'A personal finance dashboard with balance tracking, budget management, expense analysis, and transaction history.',
                componentChoices: [{ component: 'Progress', reason: 'Budget utilization' }, { component: 'Chart', reason: 'Expense and portfolio visualization' }],
                layoutReason: 'Dashboard grid for financial overview',
            },
        },
    },
];

export function getTemplateById(id: string): Template | undefined {
    return TEMPLATES.find(t => t.id === id);
}
