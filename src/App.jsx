import { useEffect, useState } from 'react';
import NavBar from './components/NavBar.jsx';
import WorkoutForm from './components/WorkoutForm.jsx';
import WorkoutList from './components/WorkoutList.jsx';
import Homepage from './components/Homepage.jsx';
import { getWorkouts, createWorkout, deleteWorkout } from './api.js';

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="app">
      <header>
        <h1>Fitness Tracker</h1>
      </header>

      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'Home' && <WorkoutForm onAdd={handleAdd} />}

      {error && <p className="error-banner">{error}</p>}

      {loading ? (
        <p className="loading-state">Loading homepage…</p>
      ) : activeTab === 'Home' ? (
        <Homepage workouts={workouts} onDelete={handleDelete} />
      ) : (
        <WorkoutList workouts={workouts} onDelete={handleDelete} />
      )}
    </div>
  );
}
