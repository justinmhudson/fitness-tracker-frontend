import { useEffect, useState } from 'react';
import NavBar from './components/NavBar.jsx';
import Cardio from './components/Cardio.jsx';
import Weights from './components/Weights.jsx';
import Other from './components/Other.jsx';
import { getWorkouts, searchWorkouts, createWorkout, deleteWorkout, updateWorkout  } from './api.js';

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Cardio');

  // Load workouts once when the app first mounts
  useEffect(() => {
    getWorkouts()
      .then(setWorkouts)
      .catch(() => setError('Could not reach the server. Is your backend running?'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(workout) {
    try {
      const saved = await createWorkout(workout);
      setWorkouts((prev) => [saved, ...prev]);
    } catch {
      setError('Failed to save workout. Try again.');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch {
      setError('Failed to delete workout. Try again.');
    }
  }

  async function handleUpdate(id, updates) {
  try {
    const updated = await updateWorkout(id, updates);
    setWorkouts((prev) => prev.map((w) => (w._id === id ? updated : w)));
  } catch {
    setError('Failed to update workout. Try again.');
  }
}

  return (
    <div className="app">
      <header>
        <h1>Fitness Tracker</h1>
      </header>

      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {error && <p className="error-banner">{error}</p>}

      {loading ? (
        <p className="loading-state">Loading…</p>
      ) : activeTab === 'Cardio' ? (
        <Cardio workouts={workouts} onAdd={handleAdd} />
      ) : activeTab === 'Other' ? (
        <Other workouts={workouts} onAdd={handleAdd} />
      ) : (
        <Weights workouts={workouts} onAdd={handleAdd} onUpdate={handleUpdate} activeTab={activeTab} />
      )}
    </div>
  );
}
