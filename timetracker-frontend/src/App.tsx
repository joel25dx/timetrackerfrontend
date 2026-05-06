import { useEffect, useState } from 'react';

// Components
import { ActivityManager } from './components/ActivityManager';
import { TimerDisplay } from './components/TimerDisplay';
import { CategoryChoice } from './components/CategoryChoice';
import { ButtonActions } from './components/ButtonActions';

// Services
import { apiService } from './services/ApiService';
import './App.css';

export default function App() {
  // STATE 
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(() => localStorage.getItem('activeId') || "");
  const [seconds, setSeconds] = useState(() => Number(localStorage.getItem('seconds')) || 0);
  const [isActive, setIsActive] = useState(() => localStorage.getItem('isActive') === 'true');

  // API FETCHING
  const fetchItems = async () => {
    try {
      const data = await apiService.getCategories();
      setItems(data);
    } catch (err) {
      console.error("Could not fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // TIMER LOGIC
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Safety feature, wont reset timer or selected activity on page refresh
  useEffect(() => {
    localStorage.setItem('seconds', seconds.toString());
    localStorage.setItem('isActive', isActive.toString());
    localStorage.setItem('activeId', selectedActivity);
  }, [seconds, isActive, selectedActivity]);

  // Converts total seconds into a MM:SS string format
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // HANDLERS

  // Create a new category
  const handleAdd = async (name: string) => {
    await apiService.createCategory(name);
    fetchItems();
  };

  // Update an existing category's name
  const handleUpdate = async (id: any, name: string) => {
    await apiService.updateCategory(id, name);
    fetchItems();
  };

  // Delete a category
  const handleDelete = async (id: any) => {
    await apiService.deleteCategory(id);
    fetchItems();
  };

  // Start the timer for the selected activity
  const handleStart = () => {
    if (!selectedActivity) return alert("Please select an activity first!");
    setIsActive(true);
  };


  // Stop the timer and save the session to the database
  const handleStop = async () => {
    const activity = items.find(i => i.id === selectedActivity);
    const now = new Date();
    const start = new Date(now.getTime() - seconds * 1000);

    try {
      await apiService.createSession({
        categoryId: selectedActivity,
        categoryName: activity?.name || "Unknown",
        startTime: start.toISOString(),
        endTime: now.toISOString()
      });

      console.log(`✅ Session saved: ${activity?.name}, Duration: ${formatTime(seconds)}`);

      setIsActive(false);
      setSeconds(0);
      setSelectedActivity("");
    } catch (err) {
      alert("Failed to save the session to the database.");
    }
  };

  if (loading) return <div className="loading">Loading tracker...</div>;

  return (
    <div className="app-container">
      <h1>Time Tracker</h1>

      {/* Categories CRUD */}
      <ActivityManager
        items={items}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <div className="tracker-section">
        {/* Activity Selection */}
        <CategoryChoice
          items={items}
          selectedId={selectedActivity}
          onSelect={setSelectedActivity}
          disabled={isActive}
        />

        {/* Clock Display */}
        <TimerDisplay
          seconds={seconds}
          formatTime={formatTime}
        />

        {/* Start/Stop Logic */}
        <ButtonActions
          isActive={isActive}
          onStart={handleStart}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}