'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Utility Functions and Hooks (simulating external libraries) ---

// Simulate a unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulate a basic toast system
const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning'; id: string } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout>();

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type, id: generateId() });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000); // Toast disappears after 3 seconds
  }, []);

  return { toast, showToast };
};

// Simulate Form Hook for simple inputs
const useForm = (initialValues: { [key: string]: string }) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return { values, handleChange, resetForm };
};

// --- Mock Data ---

const mockTodayMeal = {
  id: 'meal-1',
  name: 'Avocado Toast with Poached Egg',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  calories: 320,
  protein: 15,
  carbs: 25,
  fats: 18,
  prepStatus: 'Ready' as 'Ready' | 'Eaten' | 'Pending',
};

const mockPlannedMeals = [
  { id: 'pmeal-1', name: 'Overnight Oats with Berries', image: 'https://images.unsplash.com/photo-1627931557161-1250328b97e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'pmeal-2', name: 'Greek Yogurt with Granola', image: 'https://images.unsplash.com/photo-1625938885627-2c96c466472d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const mockBreakfastIdeas = [
  {
    id: 'idea-1',
    name: 'Green Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1550565227-bad2ff4fd799?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dietary: 'Vegan',
  },
  {
    id: 'idea-2',
    name: 'Scrambled Tofu',
    image: 'https://images.unsplash.com/photo-1596707335905-24d1933e8b0a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dietary: 'Vegan',
  },
  {
    id: 'idea-3',
    name: 'Protein Pancakes',
    image: 'https://images.unsplash.com/photo-1601007802181-42171176b6b7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dietary: 'High-Protein',
  },
  {
    id: 'idea-4',
    name: 'Fruit Salad with Mint',
    image: 'https://images.unsplash.com/photo-1563227809-ce12b8032746?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dietary: 'Gluten-Free',
  },
  {
    id: 'idea-5',
    name: 'Chia Seed Pudding',
    image: 'https://images.unsplash.com/photo-1627885472859-9f7a7f4b1c8f?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dietary: 'Vegan',
  },
];

const mockNutritionalData = [
  { day: 'Mon', calories: 1800 },
  { day: 'Tue', calories: 2000 },
  { day: 'Wed', calories: 1900 },
  { day: 'Thu', calories: 2100 },
  { day: 'Fri', calories: 1850 },
  { day: 'Sat', calories: 2200 },
  { day: 'Sun', calories: 1950 },
];

const mockInventory = [
  { id: 'inv-1', name: 'Oats', stock: 'High' },
  { id: 'inv-2', name: 'Berries', stock: 'Medium' },
  { id: 'inv-3', name: 'Eggs', stock: 'Low' },
  { id: 'inv-4', name: 'Avocado', stock: 'Medium' },
  { id: 'inv-5', name: 'Protein Powder', stock: 'High' },
  { id: 'inv-6', name: 'Yogurt', stock: 'Medium' },
];

// --- Styles (simulating Chakra UI theme and spacing) ---

const styles = {
  // Global
  pageBackground: {
    minHeight: '100vh',
    backgroundColor: '#F7FAFC', // Light background
    color: '#2D3748', // Dark grey for text
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem',
    width: '100%',
  },
  // Typography
  heading1: { fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#2C5282' },
  heading2: { fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.2rem', color: '#2C5282' },
  heading3: { fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.8rem', color: '#4A5568' },
  textMuted: { color: '#718096', fontSize: '0.9rem' },
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05), 0 0px 4px rgba(0, 0, 0, 0.03)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 0px 8px rgba(0, 0, 0, 0.05)',
  },
  // Buttons
  button: {
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  primaryButton: {
    backgroundColor: '#4299E1', // Blue
    color: 'white',
    ':hover': { backgroundColor: '#3182CE' },
    ':active': { transform: 'scale(0.98)' },
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0', // Light grey
    color: '#2D3748',
    ':hover': { backgroundColor: '#CBD5E0' },
    ':active': { transform: 'scale(0.98)' },
  },
  outlineButton: {
    backgroundColor: 'transparent',
    color: '#4299E1',
    border: '1px solid #4299E1',
    ':hover': { backgroundColor: '#EBF8FF' },
    ':active': { transform: 'scale(0.98)' },
  },
  dangerButton: {
    backgroundColor: '#E53E3E', // Red
    color: 'white',
    ':hover': { backgroundColor: '#C53030' },
    ':active': { transform: 'scale(0.98)' },
  },
  // Input
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #CBD5E0',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    ':focus': {
      outline: 'none',
      borderColor: '#4299E1',
      boxShadow: '0 0 0 1px #4299E1',
    },
  },
  // Layout
  flexRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  flexCol: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  gridTwoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  // Toast
  toastContainer: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 1000,
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
  },
  toastBase: {
    padding: '0.75rem 1.25rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'white',
  },
  toastSuccess: { backgroundColor: '#48BB78' }, // Green
  toastError: { backgroundColor: '#E53E3E' }, // Red
  toastInfo: { backgroundColor: '#4299E1' }, // Blue
  toastWarning: { backgroundColor: '#ECC94B' }, // Yellow
  // Custom status styles
  statusReadyBg: { backgroundColor: '#C6F6D5' },
  statusReadyColor: { color: '#2F855A' },
  statusPendingBg: { backgroundColor: '#FEFCBF' },
  statusPendingColor: { color: '#975A16' },
  statusEatenBg: { backgroundColor: '#D6BCFA' }, // Light Purple
  statusEatenColor: { color: '#6B46C1' }, // Dark Purple
};

// --- Components ---

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'secondary', children, style, ...props }) => {
  const [isActive, setIsActive] = useState(false);
  const buttonStyle = {
    ...styles.button,
    ...(variant === 'primary' ? styles.primaryButton : {}),
    ...(variant === 'secondary' ? styles.secondaryButton : {}),
    ...(variant === 'outline' ? styles.outlineButton : {}),
    ...(variant === 'danger' ? styles.dangerButton : {}),
    ...(isActive ? { transform: 'scale(0.98)' } : {}),
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)} // Reset if mouse leaves while pressed
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ style, ...props }) => {
  return <input style={{ ...styles.input, ...style }} {...props} />;
};

interface ToastMessageProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: string;
  isVisible: boolean;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ message, type, isVisible }) => {
  const typeStyle =
    type === 'success'
      ? styles.toastSuccess
      : type === 'error'
        ? styles.toastError
        : type === 'warning'
          ? styles.toastWarning
          : styles.toastInfo;

  return (
    <div
      aria-live="polite"
      style={{
        ...styles.toastContainer,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
      }}
    >
      <div style={{ ...styles.toastBase, ...typeStyle }}>
        {/* Simple icon representation */}
        <span style={{ fontSize: '1.2rem' }}>
          {type === 'success' && '✔️'}
          {type === 'error' && '❌'}
          {type === 'info' && '💡'}
          {type === 'warning' && '⚠️'}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

// --- Main Dashboard Sections ---

interface TodayBreakfastCardProps {
  meal: typeof mockTodayMeal;
  onMarkAsEaten: () => void;
}

const TodayBreakfastCard: React.FC<TodayBreakfastCardProps> = ({ meal, onMarkAsEaten }) => {
  const statusStyle =
    meal.prepStatus === 'Ready'
      ? { backgroundColor: styles.statusReadyBg.backgroundColor, color: styles.statusReadyColor.color }
      : meal.prepStatus === 'Eaten'
        ? { backgroundColor: styles.statusEatenBg.backgroundColor, color: styles.statusEatenColor.color }
        : { backgroundColor: styles.statusPendingBg.backgroundColor, color: styles.statusPendingColor.color };

  return (
    <Card style={{ padding: 0 }}>
      <img
        src={meal.image}
        alt={meal.name}
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
      />
      <div style={{ padding: '1.5rem' }}>
        <h3 style={styles.heading3}>{meal.name}</h3>
        <p style={{ ...styles.textMuted, marginBottom: '1rem' }}>Today's Planned Meal</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{meal.calories} kcal</div>
            <div style={styles.textMuted}>Calories</div>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{meal.protein}g</div>
            <div style={styles.textMuted}>Protein</div>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{meal.carbs}g</div>
            <div style={styles.textMuted}>Carbs</div>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{meal.fats}g</div>
            <div style={styles.textMuted}>Fats</div>
          </div>
        </div>
        <div style={{ ...styles.flexRow, marginBottom: '1rem' }}>
          <span style={{ fontWeight: 600 }}>Prep Status:</span>
          <span
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              ...statusStyle,
            }}
          >
            {meal.prepStatus}
          </span>
        </div>
        <Button onClick={onMarkAsEaten} variant="primary" disabled={meal.prepStatus === 'Eaten'}>
          {meal.prepStatus === 'Eaten' ? 'Eaten!' : 'Mark as Eaten'}
        </Button>
      </div>
    </Card>
  );
};

interface BreakfastPlannerProps {
  showToast: ReturnType<typeof useToast>['showToast'];
  plannedMeals: typeof mockPlannedMeals;
  setPlannedMeals: React.Dispatch<React.SetStateAction<typeof mockPlannedMeals>>;
}

const BreakfastPlanner: React.FC<BreakfastPlannerProps> = ({ showToast, plannedMeals, setPlannedMeals }) => {
  const { values, handleChange, resetForm } = useForm({ mealName: '' });
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editedMealName, setEditedMealName] = useState('');

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (values.mealName.trim()) {
      setPlannedMeals((prev) => [
        ...prev,
        {
          id: generateId(),
          name: values.mealName,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Default image
        },
      ]);
      showToast(`${values.mealName} added to planner!`, 'success');
      resetForm();
    }
  };

  const handleRemoveMeal = (id: string, name: string) => {
    setPlannedMeals((prev) => prev.filter((meal) => meal.id !== id));
    showToast(`${name} removed.`, 'info');
  };

  const handleEditClick = (meal: { id: string; name: string }) => {
    setEditingMealId(meal.id);
    setEditedMealName(meal.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editedMealName.trim()) {
      setPlannedMeals((prev) => prev.map((meal) => (meal.id === id ? { ...meal, name: editedMealName } : meal)));
      showToast(`Meal updated to "${editedMealName}"`, 'success');
      setEditingMealId(null);
      setEditedMealName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMealId(null);
    setEditedMealName('');
  };

  return (
    <Card>
      <h2 style={styles.heading3}>Breakfast Planner</h2>
      <form onSubmit={handleAddMeal} style={{ ...styles.flexRow, marginBottom: '1rem' }}>
        <Input
          type="text"
          name="mealName"
          placeholder="Quick Add Meal (e.g., Smoothie)"
          value={values.mealName}
          onChange={handleChange}
          style={{ flexGrow: 1 }}
          aria-label="Add new breakfast meal"
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
      <div style={{ ...styles.flexCol, gap: '0.8rem' }}>
        {plannedMeals.length === 0 ? (
          <p style={styles.textMuted}>No meals planned yet. Add some!</p>
        ) : (
          plannedMeals.map((meal) => (
            <div
              key={meal.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.8rem',
                backgroundColor: '#F7FAFC',
                borderRadius: '0.75rem',
                border: '1px solid #EDF2F7',
                transition: 'all 0.2s ease-in-out',
                gap: '1rem',
              }}
            >
              {editingMealId === meal.id ? (
                <Input
                  type="text"
                  value={editedMealName}
                  onChange={(e) => setEditedMealName(e.target.value)}
                  style={{ flexGrow: 1, padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                />
              ) : (
                <span style={{ fontWeight: 500, flexGrow: 1 }}>{meal.name}</span>
              )}
              <div style={styles.flexRow}>
                {editingMealId === meal.id ? (
                  <>
                    <Button variant="primary" onClick={() => handleSaveEdit(meal.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => handleEditClick(meal)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveMeal(meal.id, meal.name)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

interface BreakfastIdeasProps {
  showToast: ReturnType<typeof useToast>['showToast'];
  onAddIdeaToPlanner: (idea: typeof mockBreakfastIdeas[0]) => void;
}

const BreakfastIdeas: React.FC<BreakfastIdeasProps> = ({ showToast, onAddIdeaToPlanner }) => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Vegan', 'High-Protein', 'Gluten-Free'];

  const filteredIdeas = mockBreakfastIdeas.filter((idea) => filter === 'All' || idea.dietary === filter);

  return (
    <Card>
      <h2 style={styles.heading3}>Breakfast Ideas</h2>
      <div style={{ ...styles.flexRow, marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            onClick={() => setFilter(f)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            {f}
          </Button>
        ))}
      </div>
      <div style={styles.gridTwoCol}>
        {filteredIdeas.length === 0 ? (
          <p style={styles.textMuted}>No ideas matching this filter.</p>
        ) : (
          filteredIdeas.map((idea) => (
            <Card
              key={idea.id}
              style={{
                padding: 0,
                width: '100%',
                margin: 0,
                cursor: 'pointer',
              }}
              onClick={() => onAddIdeaToPlanner(idea)}
            >
              <img
                src={idea.image}
                alt={idea.name}
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
              />
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 600 }}>{idea.name}</div>
                <div style={{ ...styles.textMuted, fontSize: '0.8rem' }}>{idea.dietary}</div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

// Simplified Bar Chart for Nutritional Trends
const NutritionalTrends: React.FC = () => {
  const maxCalories = Math.max(...mockNutritionalData.map((d) => d.calories));

  return (
    <Card>
      <h2 style={styles.heading3}>Nutritional Trends (Last 7 Days)</h2>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.5rem',
          height: '200px',
          padding: '0.5rem 0',
        }}
      >
        {mockNutritionalData.map((data) => (
          <div
            key={data.day}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: '1',
              position: 'relative',
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                backgroundColor: '#63B3ED', // Light blue bar
                width: '80%',
                height: `${(data.calories / maxCalories) * 90}%`, // 90% max height to leave space for labels
                borderRadius: '0.25rem 0.25rem 0 0',
                transition: 'height 0.5s ease-out',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '0.2rem',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
              title={`${data.calories} kcal`}
            >
              <span style={{ transform: 'translateY(-100%)' }}>{data.calories}</span>
            </div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 500, color: '#4A5568' }}>{data.day}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const BreakfastComponentInventory: React.FC = () => {
  return (
    <Card>
      <h2 style={styles.heading3}>Breakfast Component Inventory</h2>
      <div style={{ ...styles.flexCol, gap: '0.6rem' }}>
        {mockInventory.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.6rem 0',
              borderBottom: '1px solid #EDF2F7',
            }}
          >
            <span style={{ fontWeight: 500 }}>{item.name}</span>
            <span
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: item.stock === 'High' ? '#C6F6D5' : item.stock === 'Medium' ? '#FEFCBF' : '#FED7D7',
                color: item.stock === 'High' ? '#2F855A' : item.stock === 'Medium' ? '#975A16' : '#C53030',
              }}
            >
              {item.stock}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// --- Main App Component ---

export default function GeneratedUI() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast, showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [todayMeal, setTodayMeal] = useState(mockTodayMeal);
  const [plannedMeals, setPlannedMeals] = useState(mockPlannedMeals);

  useEffect(() => {
    // Simulate initial load animation
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100); // Small delay to trigger animation
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
    showToast(`Viewing ${formatDate(newDate)}`, 'info');
  };

  const handleMarkTodayMealAsEaten = useCallback(() => {
    setTodayMeal((prev) => ({ ...prev, prepStatus: 'Eaten' }));
    showToast(`${todayMeal.name} marked as eaten!`, 'success');
  }, [showToast, todayMeal.name]);

  const addMealIdeaToPlanner = useCallback(
    (idea: typeof mockBreakfastIdeas[0]) => {
      setPlannedMeals((prev) => [
        ...prev,
        { id: generateId(), name: idea.name, image: idea.image },
      ]);
      showToast(`"${idea.name}" added to your planner!`, 'success');
    },
    [showToast, setPlannedMeals]
  );

  return (
    <div style={styles.pageBackground}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #EDF2F7',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h1 style={styles.heading1}>My Breakfast Chart</h1>
        <div style={{ ...styles.flexRow, gap: '1.5rem' }}>
          <div style={styles.flexRow}>
            <Button variant="secondary" onClick={() => handleDateChange(-1)} aria-label="Previous day">
              {'<'}
            </Button>
            <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{formatDate(currentDate)}</span>
            <Button variant="secondary" onClick={() => handleDateChange(1)} aria-label="Next day">
              {'>'}
            </Button>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#CBD5E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            tabIndex={0}
            role="button"
            aria-label="User profile"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            JS
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          ...styles.container,
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
          paddingTop: '2rem',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          opacity: isMounted ? 1 : 0,
          transform: isMounted ? 'translateY(0)' : 'translateY(20px)',
          '@media (min-width: 768px)': {
            gridTemplateColumns: '2fr 3fr', // Responsive two-column
          },
        }}
      >
        {/* Left Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'translateX(0)' : 'translateX(-20px)',
          }}
        >
          <TodayBreakfastCard meal={todayMeal} onMarkAsEaten={handleMarkTodayMealAsEaten} />
          <BreakfastPlanner showToast={showToast} plannedMeals={plannedMeals} setPlannedMeals={setPlannedMeals} />
        </div>

        {/* Right Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'translateX(0)' : 'translateX(20px)',
            transitionDelay: '0.1s', // Slight delay for right column
          }}
        >
          <BreakfastIdeas showToast={showToast} onAddIdeaToPlanner={addMealIdeaToPlanner} />
          <NutritionalTrends />
          <BreakfastComponentInventory />
        </div>
      </main>

      {/* Toast Messages */}
      {toast && <ToastMessage {...toast} isVisible={!!toast} />}
    </div>
  );
}