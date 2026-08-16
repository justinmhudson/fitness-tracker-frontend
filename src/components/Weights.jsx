import { useState, useEffect } from 'react';
import { EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

export default function Weights({ workouts, onAdd, activeTab }) {

  const [form, setForm] = useState({
    category: activeTab,
    exercise: EXERCISES_BY_CATEGORY[activeTab][0],
    sets: '',
    reps: '',
    weight: '',
    isFail: false,
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
    const { name, value, type, checked } = e.target;   
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        isFail: form.isFail,
      });
      setForm((prev) => ({
        ...prev,
        sets: '',
        reps: '',
        weight: '',
        isFail: false,
      }));
    } finally {
      setSubmitting(false);
    }
  }

  // For each Upper Body exercise, find the single most recent logged entry.
  const recentForExercise = workouts
    .filter((w) => w.exercise === form.exercise)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  let content;
  if (workouts.length === 0) {
    content = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (recentForExercise.length === 0) {
    content = <p className="empty-state">No {activeTab.toLowerCase()} exercises logged yet. Add your first one above.</p>;
  } else {
    content = (
      <div>
        <h3 className="last-line">Last Five {form.exercise} Attempts</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Sets</th>
                <th>Reps</th>
              </tr>
            </thead>
            <tbody>
              {recentForExercise.map((w) => (
                <tr key={w._id} className={w.isFail ? 'row--failed' : ''}>
                  <td>{new Date(w.date).toLocaleDateString()}</td>
                  <td>{w.weight} lbs</td>
                  <td>{w.sets}</td>
                  <td>{w.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <div className="field-row field-row--triple">
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
        <label className="checkbox-field">
          <input
            name="isFail"
            type="checkbox"
            checked={form.isFail}
            onChange={handleChange}
          />
          Failed?
        </label>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Log Workout'}
      </button>
    </form>
    {content}
    </>
  );
}