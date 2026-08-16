import { useState, useEffect } from 'react';
import { EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

export default function Weights({ workouts, onAdd, onDelete, activeTab }) {

  const [form, setForm] = useState({
    category: activeTab,
    exercise: EXERCISES_BY_CATEGORY[activeTab][0],
    sets: '',
    reps: '',
    weight: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      category: activeTab,
      exercise: EXERCISES_BY_CATEGORY[activeTab][0],
    }));
  }, [activeTab]);

  function handleChange(e) {
    const { name, value } = e.target;   
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.category || !form.exercise || !form.sets || !form.reps || !form.weight) return;

    setSubmitting(true);
    try {
      await onAdd({
        category: form.category,
        exercise: form.exercise,
        sets: form.sets,
        reps: form.reps,
        weight: form.weight,
      });
      setForm((prev) => ({
        ...prev,
        sets: '',
        reps: '',
        weight: '',
      }));
    } finally {
      setSubmitting(false);
    }
  }

  // For each Upper Body exercise, find the single most recent logged entry.
  const latestByExercise = EXERCISES_BY_CATEGORY[activeTab]
    .map((exerciseName) =>
      workouts
        .filter((w) => w.exercise === exerciseName)
        .reduce((latest, w) => (
          !latest || new Date(w.date) > new Date(latest.date) ? w : latest
        ), null)
    )
    .filter((entry) => entry != null);

  let content;
  if (workouts.length === 0) {
    content = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (latestByExercise.length === 0) {
    content = <p className="empty-state">No {activeTab.toLowerCase()} exercises logged yet. Add your first one above.</p>;
  } else {
    content = (
      <div>
        {latestByExercise.map((w) => (
          <p key={w._id}>
            Most Recent {w.exercise}: {w.sets} × {w.reps} — {w.weight} lbs
          </p>
        ))}
      </div>
    );
  }

  return (
    <>
      <form className="workout-form" onSubmit={handleSubmit}>
      <div className="field-row field-row--double">
        <select name="exercise" value={form.exercise} onChange={handleChange} required>
          {EXERCISES_BY_CATEGORY[form.category].map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </select>
        <input
          name="weight"
          type="number"
          min="0"
          placeholder="Weight (lbs)"
          value={form.weight}
          onChange={handleChange}
        />
      </div>
      <div className="field-row field-row--double">
        <input
          name="sets"
          type="number"
          min="0"
          placeholder="Sets"
          value={form.sets}
          onChange={handleChange}
        />
        <input
          name="reps"
          type="number"
          min="0"
          placeholder="Reps"
          value={form.reps}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Log workout'}
      </button>
    </form>
    {content}
    </>
  );
}