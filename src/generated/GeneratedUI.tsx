import React from 'react';
import { Sidebar, Navbar, Input, Avatar, Stat, Card, Chart, Badge, Table } from '@/components/ui';


const GeneratedUI = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 15% 10%, rgba(16,185,129,0.09) 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(59,130,246,0.07) 0%, transparent 40%), #09090b',
        color: '#eceff2',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <MainSidebarBlock />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar */}
        <TopNavbarBlock />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8"
              style={{
                background: 'linear-gradient(to right, #6EE7B7, #3B82F6, #9333EA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dashboard Overview
            </h1>

            {/* Account Summary Stats */}
            <section className="mb-8">
              <AccountSummaryStatsBlock />
            </section>

            {/* Spending Overview Chart and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SpendingOverviewChartBlock />
              </div>
              <div className="lg:col-span-1">
                <RecentTransactionsTableBlock />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GeneratedUI;

// --- Block: MainSidebarBlock ---

const MainSidebarBlock = () => {
  const sidebarGroups = [
    {
      label: "Accounts",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: "📊",
          active: true,
        },
        {
          id: "checking",
          label: "Checking",
          icon: "💳",
        },
        {
          id: "savings",
          label: "Savings",
          icon: "💰",
        },
        {
          id: "credit-card",
          label: "Credit Card",
          icon: "💳",
        },
      ],
    },
    {
      label: "Services",
      items: [
        {
          id: "transfers",
          label: "Transfers",
          icon: "💸",
        },
        {
          id: "payments",
          label: "Bill Pay",
          icon: "🧾",
        },
        {
          id: "statements",
          label: "Statements",
          icon: "📄",
        },
        {
          id: "investments",
          label: "Investments",
          icon: "📈",
        },
      ],
    },
    {
      label: "Support",
      items: [
        {
          id: "contact",
          label: "Contact Us",
          icon: "📞",
        },
        {
          id: "faq",
          label: "FAQ",
          icon: "❓",
        },
      ],
    },
  ];

  const sidebarFooter = {
    id: "settings",
    label: "Settings",
    icon: "⚙️",
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <Sidebar
        title="🏦 Apex Bank"
        groups={sidebarGroups}
        footer={sidebarFooter}
        width={280} // Example width, Sidebar component handles responsiveness internally
      // The Sidebar component itself is responsible for applying premium design mandates like glassmorphism if it's a fixed part of the layout.
      // For this block, we are primarily passing the data structure.
      />
    </div>
  );
};



// --- Block: TopNavbarBlock ---

const TopNavbarBlock = () => {
  return (
    <Navbar
      brand=""
      brandIcon="🚀"
      items={[
        { label: 'Help & Support', href: '#help' },
        { label: 'Notifications', href: '#notifications', icon: '🔔' },
      ]}
      actions={[
        <Input
          key="search-input"
          type="search"
          placeholder="Search documentation, users..."
          size="sm"
          aria-label="Search"
          style={{ minWidth: '180px', flexGrow: 1 }}
        />,
        <Avatar
          key="user-avatar"
          name="Olivia Rhye"
          src="https://images.unsplash.com/photo-1534528736946-cdbd625719a6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          size="md"
          status="online"
          style={{ cursor: 'pointer' }}
        />,
      ]}
      links={[]} // No specific `links` prop mentioned, so passing an empty array or omitting it.
    />
  );
};



// --- Block: AccountSummaryStatsBlock ---

const AccountSummaryStatsBlock = () => {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        backdropFilter: 'blur(12px)',
        padding: '2rem',
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Responsive grid for stats
      }}
      aria-label="Account Summary Statistics"
    >
      <div
        style={{
          transition: 'transform 0.2s ease-in-out',
          cursor: 'pointer',
          padding: '1rem', // Internal padding for individual stat box
          borderRadius: 12,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Stat
          label="Total Balance"
          value="$12,345.67"
          trend="+1.2%"
          icon="💸"
          subtitle="Combined Accounts"
        />
      </div>

      <div
        style={{
          transition: 'transform 0.2s ease-in-out',
          cursor: 'pointer',
          padding: '1rem',
          borderRadius: 12,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Stat
          label="Monthly Spending"
          value="$890.50"
          trend="-5.3%"
          icon="🛍️"
          subtitle="This Month"
        />
      </div>

      <div
        style={{
          transition: 'transform 0.2s ease-in-out',
          cursor: 'pointer',
          padding: '1rem',
          borderRadius: 12,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Stat
          label="Available Credit"
          value="$4,500.00"
          trend="+0.0%"
          icon="💳"
          subtitle="On Credit Card"
        />
      </div>

      <div
        style={{
          transition: 'transform 0.2s ease-in-out',
          cursor: 'pointer',
          padding: '1rem',
          borderRadius: 12,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Stat
          label="Upcoming Bills"
          value="$320.00"
          trend="3 in 7 days"
          icon="🗓️"
          subtitle="Next Week"
        />
      </div>
    </div>
  );
};



// --- Block: SpendingOverviewChartBlock ---

const SpendingOverviewChartBlock = () => {
  const chartData = [
    { label: '🛒 Groceries', value: 320, color: '#f59e0b' },
    { label: '🍽️ Dining Out', value: 180, color: '#ef4444' },
    { label: '💡 Utilities', value: 150, color: '#3b82f6' },
    { label: '⛽ Transport', value: 110, color: '#10b981' },
    { label: '🎭 Entertainment', value: 90, color: '#6366f1' },
    { label: '📚 Education', value: 75, color: '#a855f7' },
    { label: '💖 Wellness', value: 60, color: '#ec4899' },
  ];

  return (
    <Card
      title="📊 Spending Categories"
      subtitle="Breakdown for current month (Oct 2023)"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        backdropFilter: 'blur(12px)',
      }}
      hoverable
    >
      <div className="p-4">
        <Chart
          type="pie"
          title="Monthly Spending Distribution"
          height={280}
          data={chartData}
        />
      </div>
    </Card>
  );
};



// --- Block: RecentTransactionsTableBlock ---

const RecentTransactionsTableBlock: React.FC = () => {
  const transactionColumns = [
    { key: 'date', header: 'Date' },
    { key: 'description', header: 'Description' },
    { key: 'category', header: 'Category' },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status' },
  ];

  const transactionData = [
    {
      date: '2023-10-26',
      description: 'Amazon Purchase',
      category: 'Shopping',
      amount: <span className="font-semibold text-red-500">-$45.99</span>,
      status: <Badge variant="success">Completed</Badge>,
    },
    {
      date: '2023-10-25',
      description: 'Coffee Shop',
      category: 'Dining Out',
      amount: <span className="font-semibold text-red-500">-$5.75</span>,
      status: <Badge variant="success">Completed</Badge>,
    },
    {
      date: '2023-10-25',
      description: 'Monthly Salary',
      category: 'Income',
      amount: <span className="font-semibold text-emerald-500">+$3,500.00</span>,
      status: <Badge variant="success">Completed</Badge>,
    },
    {
      date: '2023-10-24',
      description: 'Gym Membership',
      category: 'Health',
      amount: <span className="font-semibold text-red-500">-$50.00</span>,
      status: <Badge variant="success">Completed</Badge>,
    },
    {
      date: '2023-10-23',
      description: 'Transfer to Savings',
      category: 'Savings',
      amount: <span className="font-semibold text-red-500">-$200.00</span>,
      status: <Badge variant="success">Completed</Badge>,
    },
    {
      date: '2023-10-22',
      description: 'Grocery Shopping',
      category: 'Groceries',
      amount: <span className="font-semibold text-red-500">-$120.45</span>,
      status: <Badge variant="success">Completed</Badge>,
    },
    {
      date: '2023-10-21',
      description: 'Online Subscription',
      category: 'Entertainment',
      amount: <span className="font-semibold text-red-500">-$14.99</span>,
      status: <Badge variant="success">Completed</Badge>,
    },
    {
      date: '2023-10-20',
      description: 'Utility Bill',
      category: 'Bills',
      amount: <span className="font-semibold text-red-500">-$85.00</span>,
      status: <Badge variant="warning">Pending</Badge>,
    },
  ];

  return (
    <Card
      title="⏱️ Recent Transactions"
      subtitle="Last 8 activities across all accounts"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        backdropFilter: 'blur(12px)',
      }}
      className="transition-all duration-300 ease-in-out hover:shadow-lg"
    >
      <Table columns={transactionColumns} data={transactionData} striped hoverable compact />
    </Card>
  );
};
