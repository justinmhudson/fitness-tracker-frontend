import { useState } from 'react';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

const EMPTY_FORM = {
  category: 'Cardio',
  exercise: EXERCISES_BY_CATEGORY['Cardio'][0],
  distance: '',
  duration: '30',
  level: '',
  isFail: false,
};

export default function Cardio({ workouts, onAdd }) {

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        level: form.exercise === 'Stair Master' ? form.level : undefined,
      });
      setForm((prev) => ({
        ...prev,
        distance: '',
        level: '',
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
  
  let table;
  if (workouts.length === 0) {
    table = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (latestCardio == null) {
    table = <p className="empty-state">No {form.exercise.toLowerCase()} exercises logged yet. Add your first one above.</p>;
  } else {
    const newGoal = latestCardio.exercise === 'Stair Master' ? latestCardio.distance + 1 : latestCardio.distance + 0.01;
    table = (
      <div>
        <h3>Last {latestCardio.exercise} Attempt:</h3>
        <h3 className="last-line">{new Date(latestCardio.date).toLocaleDateString()} — {latestCardio.exercise === 'Stair Master' ? latestCardio.distance.toFixed(0) : latestCardio.distance.toFixed(2)} {latestCardio.exercise === 'Stair Master' ? 'ft' : 'mi'}</h3>
        <h3 className="last-line">New {latestCardio.exercise} Pace — {latestCardio.exercise === 'Stair Master' ? "Level " + (latestCardio.level + 1) : (Math.ceil((newGoal * 2) * 10) / 10).toFixed(1)  + "mph"}</h3>
        
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
                <td>{latestCardio.exercise === 'Stair Master' ? Math.ceil(newGoal / 6).toFixed(0) : (Math.ceil((newGoal / 6) * 100) / 100).toFixed(2)} {latestCardio.exercise === 'Stair Master' ? 'ft' : 'mi'}</td>
              </tr>
              <tr>
                <td>10:00</td>
                <td>{latestCardio.exercise === 'Stair Master' ? Math.ceil(newGoal / 6 * 2).toFixed(0) : (Math.ceil((newGoal / 6 * 2) * 100) / 100).toFixed(2)} {latestCardio.exercise === 'Stair Master' ? 'ft' : 'mi'}</td>
              </tr>
              <tr>
                <td>15:00</td>
                <td>{latestCardio.exercise === 'Stair Master' ? Math.ceil(newGoal / 6 * 3).toFixed(0) : (Math.ceil((newGoal / 6 * 3) * 100) / 100).toFixed(2)} {latestCardio.exercise === 'Stair Master' ? 'ft' : 'mi'}</td>
              </tr>
              <tr>
                <td>20:00</td>
                <td>{latestCardio.exercise === 'Stair Master' ? Math.ceil(newGoal / 6 * 4).toFixed(0) : (Math.ceil((newGoal / 6 * 4) * 100) / 100).toFixed(2)} {latestCardio.exercise === 'Stair Master' ? 'ft' : 'mi'}</td>
              </tr>
              <tr>
                <td>25:00</td>
                <td>{latestCardio.exercise === 'Stair Master' ? Math.ceil(newGoal / 6 * 5).toFixed(0) : (Math.ceil((newGoal / 6 * 5) * 100) / 100).toFixed(2)} {latestCardio.exercise === 'Stair Master' ? 'ft' : 'mi'}</td>
              </tr>
              <tr>
                <td>30:00</td>
                <td>{latestCardio.exercise === 'Stair Master' ? Math.ceil(newGoal).toFixed(0) : (Math.ceil((newGoal) * 100) / 100).toFixed(2)} {latestCardio.exercise === 'Stair Master' ? 'ft' : 'mi'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

let cardioForm;
if (form.exercise === 'Stair Master') {
  cardioForm = (
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
          name="distance"
          type="number"
          min="0"
          step="0.01"
          placeholder="Distance (ft)"
          value={form.distance}
          onChange={handleChange}
        />
      </div>
      <div className="field-row field-row--double">
        <input
          name="level"
          type="number"
          min="1"
          step="1"
          placeholder="Level"
          value={form.level}
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
  )
} else {
  cardioForm = (
    <form className="workout-form" onSubmit={handleSubmit}>
      <div className="field-row field-row--triple-alt">
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
            onChange={handleChange}
          />
          Failed?
        </label>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Log Workout'}
      </button>
    </form>
  )
}
return (
    <>
      {cardioForm}
      {table}
    </>
  );
}
