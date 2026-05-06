import { useEffect, useState } from 'react';
import { ActivityManager } from './components/ActivityManager';
import { TimerDisplay } from './components/TimerDisplay';
import './App.css';

const API_URL = 'https://timetracker-e87sw.ondigitalocean.app/categories';

export default function App() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(() => localStorage.getItem('activeId') || "");
  const [seconds, setSeconds] = useState(() => Number(localStorage.getItem('seconds')) || 0);
  const [isActive, setIsActive] = useState(() => localStorage.getItem('isActive') === 'true');

  // API-anrop
  const fetchItems = async () => {
    const res = await fetch(API_URL);
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  // Timer-effekt
  useEffect(() => {
    let interval: any;
    if (isActive) interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Spara till localStorage
  useEffect(() => {
    localStorage.setItem('seconds', seconds.toString());
    localStorage.setItem('isActive', isActive.toString());
    localStorage.setItem('activeId', selectedActivity);
  }, [seconds, isActive, selectedActivity]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Handlers för API
  const handleAdd = async (name: string) => {
    await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchItems();
  };

  const handleUpdate = async (id: any, name: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchItems();
  };

  const handleDelete = async (id: any) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div className="app-container">
      <h1>Time Tracker</h1>

      <ActivityManager items={items} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />

      <div className="tracker-section">
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          disabled={isActive}
        >
          <option value="">Choose activity</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>

        <TimerDisplay seconds={seconds} formatTime={formatTime} />

        <button
          className={isActive ? "stop-btn" : "start-btn"}
          onClick={() => {
            if (isActive) {
              setIsActive(false);
              setSeconds(0);
              setSelectedActivity("");
            } else {
              if (!selectedActivity) return alert("Choose activity!");
              setIsActive(true);
            }
          }}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
}