'use client';
// @ts-nocheck
import React from 'react';
import { Navbar, Sidebar, Badge, Avatar, Progress, Card, Button, Input, Divider, Table, Stat } from '@/components/ui';

// --- Block: NavbarBlock ---

const NavbarBlock = () => {
  return (
    <Navbar
      brand="🚀 ProjectPilot"
      brandIcon="🚀"
      items={[]}
      links={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Projects', href: '/projects' },
        { label: 'Tasks', href: '/tasks' },
        { label: 'Reports', href: '/reports' },
      ]}
      actions={[
        {
          label: '➕ Project',
          variant: 'primary',
          onClick: () => console.log('New project clicked'),
        },
      ]}
    />
  );
};



// --- Block: SidebarBlock ---

const SidebarBlock = () => {
  const sidebarGroups = [
    {
      label: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: "🏠",
          active: true
        },
        {
          id: "my-tasks",
          label: "My Tasks",
          icon: "✅"
        },
        {
          id: "calendar",
          label: "Calendar",
          icon: "📅"
        }
      ]
    },
    {
      label: "Projects",
      items: [
        {
          id: "all-projects",
          label: "All Projects",
          icon: "🗂️"
        },
        {
          id: "project-alpha",
          label: "Project Alpha",
          icon: "💡"
        },
        {
          id: "beta-initiative",
          label: "Beta Initiative",
          icon: "📈"
        },
        {
          id: "q3-launch",
          label: "Q3 Launch",
          icon: "🚀"
        }
      ]
    },
    {
      label: "Management",
      items: [
        {
          id: "team",
          label: "Team",
          icon: "👥"
        },
        {
          id: "reports",
          label: "Reports",
          icon: "📊"
        },
        {
          id: "settings",
          label: "Settings",
          icon: "⚙️"
        }
      ]
    }
  ];

  return (
    <div className="h-full">
      <Sidebar
        title="Main Menu"
        groups={sidebarGroups}
        footer="© ProjectPilot 2023"
      />
    </div>
  );
};



// --- Block: MainContentBlock ---

const MainContentBlock = () => {
  const projectColumns = [
    { key: 'name', header: 'Project Name' },
    { key: 'status', header: 'Status' },
    { key: 'progress', header: 'Progress' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'manager', header: 'Manager' },
  ];

  const projectData = [
    {
      name: 'Mobile App Redesign',
      status: <Badge variant="info">In Progress</Badge>,
      progress: <Progress value={65} color="blue" label="65%" showValue />,
      dueDate: '2023-11-15',
      manager: <Avatar name="Jane Doe" size="sm" />,
    },
    {
      name: 'Website Launch',
      status: <Badge variant="success">Completed</Badge>,
      progress: <Progress value={100} color="emerald" label="100%" showValue />,
      dueDate: '2023-09-30',
      manager: <Avatar name="John Smith" size="sm" />,
    },
    {
      name: 'Q4 Marketing Campaign',
      status: <Badge variant="warning">On Hold</Badge>,
      progress: <Progress value={20} color="amber" label="20%" showValue />,
      dueDate: '2023-12-01',
      manager: <Avatar name="Sarah Lee" size="sm" />,
    },
    {
      name: 'Internal Tools Development',
      status: <Badge variant="default">Planned</Badge>,
      progress: <Progress value={5} color="purple" label="5%" showValue />,
      dueDate: '2024-01-10',
      manager: <Avatar name="Michael Chen" size="sm" />,
    },
    {
      name: 'Client Onboarding Flow',
      status: <Badge variant="error">Delayed</Badge>,
      progress: <Progress value={40} color="red" label="40%" showValue />,
      dueDate: '2023-10-25',
      manager: <Avatar name="Emily White" size="sm" />,
    },
  ];

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, backdropFilter: 'blur(12px)' }}>
      <Card
        title="🎯 Project Overview"
        subtitle="Current status of your active projects."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Stat
            label="Active Projects"
            value="7"
            trend={{ value: "+2", positive: true }}
            icon="📂"
            subtitle="since last month"
          />
          <Stat
            label="Overdue Tasks"
            value="3"
            trend={{ value: "↑1", positive: false }}
            icon="🚨"
            subtitle="requiring attention"
          />
          <Stat
            label="Team Members"
            value="12"
            trend={{ value: "0", positive: undefined }}
            icon="👥"
            subtitle="across all projects"
          />
        </div>
        <Divider spacing="lg" />
        <div className="mt-6 overflow-x-auto">
          <Table
            columns={projectColumns}
            data={projectData}
            striped
            hoverable
            emptyMessage="No projects found."
          />
        </div>
      </Card>
    </div>
  );
};



export default function GeneratedUI() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 15% 10%, rgba(16,185,129,0.09) 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(59,130,246,0.07) 0%, transparent 40%), #09090b',
        color: '#eceff2',
        display: 'flex',
      }}
    >
      <div style={{ flexShrink: 0, width: '220px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <SidebarBlock />
      </div>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ flexShrink: 0 }}>
          <NavbarBlock />
        </div>
        <main style={{ flexGrow: 1, padding: '2rem' }}>
          <MainContentBlock />
        </main>
      </div>
    </div>
  );
}