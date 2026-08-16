import { useState } from 'react';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

const EMPTY_FORM = {
  category: 'Cardio',
  exercise: EXERCISES_BY_CATEGORY['Cardio'][0],
  distance: '',
  duration: '30',
  isFail: false,
};

export default function Cardio({ workouts, onAdd, onDelete }) {

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.category || !form.exercise || !form.distance || !form.duration) return;

    setSubmitting(true);
    try {
      await onAdd({
        category: form.category,
        exercise: form.exercise,
        distance: form.distance,
        duration: form.duration,
        isFail: form.isFail,
      });
      setForm((prev) => ({
        ...prev,
        distance: '',
        isFail: false,
      }));
    } finally {
      setSubmitting(false);
    }
  }

  const latestCardio = workouts
    .filter((w) => w.exercise === form.exercise && w.duration === 30 && !w.isFail)
    .reduce((latest, w) => (
      !latest || new Date(w.date) > new Date(latest.date) ? w : latest
    ), null);

  const newGoal = latestCardio ? latestCardio.distance + 0.01 : null;

  let content;
  if (workouts.length === 0) {
    content = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (latestCardio == null) {
    content = <p className="empty-state">No {form.exercise.toLowerCase()} exercises logged yet. Add your first one above.</p>;
  } else {
    content = (
      <div>
        <h3>Current {form.exercise} Pace — {Math.ceil((newGoal * 2) * 10) / 10} mph</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>05:00</td>
                <td>{Math.ceil((newGoal / 6) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>10:00</td>
                <td>{Math.ceil((newGoal / 6 * 2) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>15:00</td>
                <td>{Math.ceil((newGoal / 6 * 3) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>20:00</td>
                <td>{Math.ceil((newGoal / 6 * 4) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>25:00</td>
                <td>{Math.ceil((newGoal / 6 * 5) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>30:00</td>
                <td>{Math.ceil((newGoal) * 100) / 100} mi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

return (
    <div>
      <form className="workout-form" onSubmit={handleSubmit}>
        <div className="field-row field-row--triple">
          <select name="exercise" value={form.exercise} onChange={handleChange} required>
            {EXERCISES_BY_CATEGORY[form.category].map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
          <input
            name="distance"
            type="number"
            min="0"
            step="0.01"
            placeholder="Distance (mi)"
            value={form.distance}
            onChange={handleChange}
          />
          <label className="checkbox-field">
            <input
              name="isFail"
              type="checkbox"
              checked={form.isFail}
              onChange={(e) => setForm((prev) => ({ ...prev, isFail: e.target.checked }))}
            />
            Failed Attempt?
          </label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Log workout'}
        </button>
      </form>
      <>
        {content}
      </>
    </div>
  );
}
