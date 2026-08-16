import { useState } from 'react';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

const EMPTY_FORM = {
  category: '',
  exercise: '',
  sets: '',
  reps: '',
  weight: '',
};

export default function UpperBodyForm({ onAdd , activeTab  }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  category = activeTab; // Set the category based on the active tab
  exercise = EXERCISES_BY_CATEGORY[category][0]; // Default to the first exercise in the category
  setForm((prev) => ({ ...prev, category, exercise })); // Update the form state with the new category and exercise

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
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }

  return (
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
  );
}