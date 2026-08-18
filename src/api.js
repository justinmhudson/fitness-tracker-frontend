// All calls to the Express backend live here, so components don't need
// to know URLs or fetch details — they just import these functions.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/workouts';

export async function getWorkouts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch workouts');
  return res.json();
}

export async function createWorkout(workout) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
  if (!res.ok) throw new Error('Failed to create workout');
  return res.json();
}

export async function deleteWorkout(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete workout');
  return res.json();
}

export async function updateWorkout(id, updates) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update workout');
  return res.json();
}
