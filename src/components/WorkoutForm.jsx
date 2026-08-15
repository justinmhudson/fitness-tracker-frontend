import { useState } from 'react';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

const EMPTY_FORM = {
  category: CATEGORIES[0],
  exercise: EXERCISES_BY_CATEGORY[CATEGORIES[0]][0],
  distance: '',
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
        distance: form.distance,
      });
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="workout-form" onSubmit={handleSubmit}>
      <div className="field-row field-row--triple">
        <select name="category" value={form.category} onChange={handleChange} required>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
    </form>
  );
}
