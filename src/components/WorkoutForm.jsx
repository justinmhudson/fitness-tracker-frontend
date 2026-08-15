import { useState } from 'react';

const EMPTY_FORM = { exerciseType: 'Cardio', exercise: 'Treadmill', sets: '', reps: '', weight: '', duration: '', distance: '', notes: '' };

export default function WorkoutForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.exerciseType || !form.exercise) return;

    setSubmitting(true);
    try {
      await onAdd({
        exerciseType: form.exerciseType,
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
        <select name="exerciseType" value={form.exerciseType} onChange={handleChange} required>
          <option value="Cardio">Cardio</option>
          <option value="Weightlifting">Weightlifting</option>
          <option value="Other">Other</option>
        </select>
        <select name="exercise" value={form.exercise} onChange={handleChange} required>
          <option value="Treadmill">Treadmill</option>
          <option value="Stair Master">Stair Master</option>
          <option value="Stationary Bike">Stationary Bike</option>
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
