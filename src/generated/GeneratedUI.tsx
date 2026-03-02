'use client';
import React from 'react';
import { Navbar, Card, Input, Divider, Table, Button, Toggle, Badge, Alert, Select } from '@/components/ui';

interface Task {
  id: string;
  text: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  completed: boolean;
}

export default function GeneratedUI() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: '1', text: 'Finish project proposal', priority: 'High', due: 'Today', completed: false },
    { id: '2', text: 'Review team pull requests', priority: 'Medium', due: 'Tomorrow', completed: false },
    { id: '3', text: 'Update documentation', priority: 'Low', due: 'Fri, Jan 26', completed: false },
    { id: '4', text: 'Schedule Q1 budget review', priority: 'High', due: 'Mon, Jan 29', completed: true },
    { id: '5', text: 'Prepare for client meeting', priority: 'Medium', due: 'Next Week', completed: false },
    { id: '6', text: 'Send monthly report to stakeholders', priority: 'High', due: 'Jan 31', completed: false },
    { id: '7', text: 'Brainstorm new feature ideas', priority: 'Low', due: 'Feb 5', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [h, setH] = React.useState(false); // For hover micro-animation

  // Calculator state
  const [num1, setNum1] = React.useState('');
  const [num2, setNum2] = React.useState('');
  const [operation, setOperation] = React.useState('+');
  const [result, setResult] = React.useState('');

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      const newId = String(tasks.length ? Math.max(...tasks.map(t => parseInt(t.id))) + 1 : 1);
      setTasks([...tasks, { id: newId, text: newTaskText.trim(), priority: 'Medium', due: 'Soon', completed: false }]);
      setNewTaskText('');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCalculate = () => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
      setResult('Error: Invalid numbers');
      return;
    }

    let calculatedResult;
    switch (operation) {
      case '+':
        calculatedResult = n1 + n2;
        break;
      case '-':
        calculatedResult = n1 - n2;
        break;
      case '*':
        calculatedResult = n1 * n2;
        break;
      case '/':
        calculatedResult = n2 !== 0 ? n1 / n2 : 'Error: Divide by zero';
        break;
      default:
        calculatedResult = 'Error: No operation';
    }
    setResult(String(calculatedResult));
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return <Badge variant="error" size="sm" dot>High</Badge>;
      case 'Medium': return <Badge variant="warning" size="sm" dot>Medium</Badge>;
      case 'Low': return <Badge variant="success" size="sm" dot>Low</Badge>;
      default: return <Badge variant="info" size="sm">Medium</Badge>;
    }
  };

  const getStatusBadge = (completed: boolean) => {
    return completed ? <Badge variant="success">Done</Badge> : <Badge variant="info">Pending</Badge>;
  };

  const remainingTasksToday = tasks.filter(t => !t.completed && t.due === 'Today').length;

  const tableColumns = [
    {
      key: 'task',
      header: 'Task',
      render: (row: Task) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Toggle checked={row.completed} onChange={() => handleToggleComplete(row.id)} />
          <span style={{ textDecoration: row.completed ? 'line-through' : 'none', opacity: row.completed ? 0.6 : 1, transition: 'opacity 0.2s', fontSize: '0.9rem' }}>
            {row.text}
          </span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (row: Task) => getPriorityBadge(row.priority),
    },
    {
      key: 'due',
      header: 'Due Date',
      render: (row: Task) => <span style={{ color: '#a0aab4', fontSize: '0.85rem' }}>{row.due}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Task) => getStatusBadge(row.completed),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Task) => (
        <Button variant="danger" size="sm" onClick={() => handleDeleteTask(row.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 15% 10%, rgba(16,185,129,0.09) 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(59,130,246,0.07) 0%, transparent 40%), #09090b', color: '#eceff2', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2rem 2rem 2rem', overflowY: 'auto' }}>
      <Navbar
        brand="✅ TaskFlow"
        items={[]}
        actions={[{ label: 'Sign Out', variant: 'ghost' }]}
        style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}
      />
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%', zIndex: 0 }} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', marginTop: '2.5rem', gap: '1.5rem', zIndex: 1 }}>
        <Card
          onMouseEnter={() => setH(true)}
          onMouseLeave={() => setH(false)}
          style={{ transform: h ? 'translateY(-5px) scale(1.005)' : 'none', transition: 'all 280ms cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: h ? '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(16,185,129,0.12)' : '0 2px 12px rgba(0,0,0,0.2)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, backdropFilter: 'blur(12px)', padding: '24px' }}
          title={
            <h2 style={{ background: 'linear-gradient(135deg, #f0f2f5 20%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              📝 My Tasks
            </h2>
          }
          subtitle={<p style={{ fontSize: '1.1rem', color: '#a0aab4', lineHeight: 1.65, marginTop: '8px' }}>{remainingTasksToday} tasks remaining today</p>}
        >
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <Input
              label=""
              placeholder="Add a new task and press Enter..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleAddTask}
              size="lg"
              fullWidth
              style={{ flex: 1 }}
            />
          </div>
          {tasks.length === 0 ? (
            <Alert variant="info" title="No Tasks Yet!" style={{ marginTop: '24px' }}>
              Looks like you're all caught up! ✨ Add a new task above to get started.
            </Alert>
          ) : (
            <>
              <Divider label={<span style={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Today's Focus</span>} spacing="lg" />
              <Table
                columns={tableColumns}
                data={tasks}
                striped
                hoverable
                emptyMessage="No tasks yet. Add one above!"
              />
            </>
          )}
        </Card>

        {/* Calculator Card */}
        <Card
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, backdropFilter: 'blur(12px)', padding: '24px' }}
          title={
            <h2 style={{ background: 'linear-gradient(135deg, #f0f2f5 20%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              🧮 Simple Calculator
            </h2>
          }
          subtitle={<p style={{ fontSize: '1.1rem', color: '#a0aab4', lineHeight: 1.65, marginTop: '8px' }}>Perform basic arithmetic operations.</p>}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
            <Input
              label="Number 1"
              type="number"
              placeholder="Enter first number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              fullWidth
            />
            <Select
              label="Operation"
              options={[
                { value: '+', label: '+' },
                { value: '-', label: '-' },
                { value: '*', label: '×' },
                { value: '/', label: '÷' },
              ]}
              value={operation}
              onChange={(e) => setOperation(e.target.value as string)}
              style={{ minWidth: '80px' }}
            />
            <Input
              label="Number 2"
              type="number"
              placeholder="Enter second number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              fullWidth
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Button onClick={handleCalculate} fullWidth>
              Calculate
            </Button>
          </div>
          <Input
            label="Result"
            value={result}
            readOnly
            disabled
            placeholder="Calculation result"
            fullWidth
            style={{ opacity: 0.8 }}
          />
        </Card>
      </main>
    </div>
  );
}