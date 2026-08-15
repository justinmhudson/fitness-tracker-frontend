import { useState } from 'react';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

const EMPTY_FORM = {
  category: '',
  exercise: '',
  distance: '',
  sets: '',
  reps: '',
  weight: ''
};

export default function WorkoutForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'category') {
      // Whenever category changes, reset exercise to the first option
      // in that new category — otherwise it could stay set to an
      // exercise that doesn't belong there anymore.
      setForm((prev) => ({
        ...prev,
        category: value,
        exercise: EXERCISES_BY_CATEGORY[value][0],
      }));
      return;
    }
    
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.category || !form.exercise) return;

    setSubmitting(true);
    try {
      await onAdd({
        category: form.category,
        exercise: form.exercise,
        distance: form.distance ? Number(form.distance) : undefined,
        sets: form.sets ? Number(form.sets) : undefined,
        reps: form.reps ? Number(form.reps) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        duration: form.category === 'Cardio' ? 30 : undefined, // default duration for cardio
      });
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="workout-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="" disabled>
            Log a workout
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {form.category === 'Cardio' && (
      <>
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
          placeholder="Distance (mi)"
          value={form.distance}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Log workout'}
      </button>
      </>
      )}

      {form.category && form.category !== 'Cardio' && (
      <>
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
          min="1"
          placeholder="Weight (lbs)"
          value={form.weight}
          onChange={handleChange}
        />
      </div>
      <div className="field-row field-row--double">
        <input
          name="sets"
          type="number"
          min="1"
          placeholder="Sets"
          value={form.sets}
          onChange={handleChange}
        />
        <input
          name="reps"
          type="number"
          min="1"
          placeholder="Reps"
          value={form.reps}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Log workout'}
      </button>
      </>
      )}
    </form>
  );
}