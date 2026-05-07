import { useEffect, useState } from 'react';

// COMPONENTS
import { ActivityManager } from './components/ActivityManager';
import { TimerDisplay } from './components/TimerDisplay';
import { CategoryChoice } from './components/CategoryChoice';
import { ButtonActions } from './components/ButtonActions';
import { Statistics } from './components/Statistics';
import { SessionHistory } from './components/SessionHistory';

// SERVICES
import { apiService } from './services/ApiService';
import './App.css';

export default function App() {
  // STATE
  const [items, setItems] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Localstate for the active timer
  const [selectedActivity, setSelectedActivity] = useState(() => localStorage.getItem('activeId') || "");
  const [seconds, setSeconds] = useState(() => Number(localStorage.getItem('seconds')) || 0);
  const [isActive, setIsActive] = useState(() => localStorage.getItem('isActive') === 'true');

  // DATA FETCHING
  const fetchData = async () => {
    try {
      const [categories, sessions] = await Promise.all([
        apiService.getCategories(),
        apiService.getAllSessions()
      ]);
      setItems(categories);
      setSessions(sessions);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // FETCH CATEGORIES AND SESSIONS ON APP LOAD
  useEffect(() => {
    fetchData();
  }, []);

  // INCRESE SECONDS EVERY 1000 MS IF TIMER IS ACTIVE
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // SAFETY FEATURE: WONT RESET TIMER OR SELECTED ACTIVITY ON PAGE REFRESH
  useEffect(() => {
    localStorage.setItem('seconds', seconds.toString());
    localStorage.setItem('isActive', isActive.toString());
    localStorage.setItem('activeId', selectedActivity);
  }, [seconds, isActive, selectedActivity]);

  // HANDLERS

  //Start the timer for the selected activity
  const handleStart = async () => {
    if (!selectedActivity) {
      alert("Please select a category first!");
      return; // Exit function if validation fails
    }
    setIsActive(true);
  };

  // STOP THE TIMER AND SAVE THE SESSION TO THE DATABASE
  const handleStop = async () => {
    setIsActive(false);
    // FIND THE SELECTED ACTIVITY OBJECT TO GET ITS NAME FOR THE SESSION RECORD
    const activity = items.find(i => (i._id === selectedActivity || i.id === selectedActivity));
    const now = new Date();
    const start = new Date(now.getTime() - seconds * 1000);

    try {
      // SAVE NEW SESSION TO DATABASE
      await apiService.createSession({
        categoryId: selectedActivity,
        categoryName: activity?.name || "Unknown",
        startTime: start.toISOString(),
        endTime: now.toISOString()
      });

      // RESET TIMER AND SELECTED ACTIVITY
      setIsActive(false);
      setSeconds(0);
      setSelectedActivity("");

      // REFRESH DATA TO UPDATE UI AND STATISTICS IMMEDIATELY
      fetchData();
    } catch (err) {
      alert("Could not save the session.");
    }
  };

  // CHANGE THE CATEGORY OF A PAST SESSION
  const handleSessionUpdate = async (sessionId: string, newCategoryId: string) => {
    try {
      // Find the new category name based on ID
      const category = items.find(category => (category._id === newCategoryId || category.id === newCategoryId));
      const categoryName = category ? category.name : "Unknown";

      await apiService.updateSession(sessionId, newCategoryId, categoryName);

      // UI and Statistics update immediately
      await fetchData();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Could not update the session category.");
    }
  };

  if (loading) return <div>Loading tracker...</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Time Tracker</h1>
      </header>

      <main className="grid-layout">
        {/* Category Management and Active Timer */}
        <section className="controls">
          <ActivityManager
            items={items}
            onAdd={async (name: string) => {
              await apiService.createCategory(name);
              fetchData(); // Refresh list after adding new category
            }}
            onUpdate={async (id: string, name: string) => {
              await apiService.updateCategory(id, name);
              fetchData(); // Refresh list after renaming an existing category
            }}
            onDelete={async (id: string) => {
              await apiService.deleteCategory(id);
              fetchData(); // Refresh list after deleting a category
            }}
          />

          <div className="timer-card">
            <CategoryChoice
              items={items}
              selectedId={selectedActivity}
              onSelect={setSelectedActivity}
              disabled={isActive} // Prevent changing category while timer is running
            />
            <TimerDisplay
              seconds={seconds}
              formatTime={(s) => {
                // Formats seconds into HH:MM:SS
                const h = Math.floor(s / 3600);
                const m = Math.floor((s % 3600) / 60);
                const sec = s % 60;
                return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
              }}
            />
            <ButtonActions
              isActive={isActive}
              onStart={handleStart}
              onStop={handleStop}
            />
          </div>
        </section>

        {/* Statistics */}
        <section className="analytics">
          <Statistics sessions={sessions} categories={items} />
        </section>

        {/*Full History 30 latest days */}
        <section className="history-full">
          <SessionHistory
            sessions={sessions}
            categories={items}
            onUpdateSession={handleSessionUpdate}
          />
        </section>
      </main>
    </div>
  );
}

//Källa för input validering https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html