import { useState } from 'react';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

const EMPTY_FORM = {
  category: 'Other',
  exercise: EXERCISES_BY_CATEGORY['Other'][0],
};

export default function Other({ workouts, onAdd, onDelete }) {

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
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
      });
    } finally {
      setSubmitting(false);
    }
  }

  const recentOther = workouts
    .filter((w) => w.category === 'Other')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  let content;
  if (workouts.length === 0) {
    content = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (recentOther.length === 0) {
    content = <p className="empty-state">No rest day activities logged yet. Add your first one above.</p>;
  } else {
     content = (
      <div>
        <h3>Last Five Rest Day Activities</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Exercise</th>
              </tr>
            </thead>
            <tbody>
              {recentOther.map((w) => (
                <tr key={w._id} className={w.isFail ? 'row--failed' : ''}>
                  <td>{new Date(w.date).toLocaleDateString()}</td>
                  <td>{w.exercise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

return (
    <div>
      <form className="workout-form" onSubmit={handleSubmit}>
        <div className="field-row field-row">
          <select name="exercise" value={form.exercise} onChange={handleChange} required>
            {EXERCISES_BY_CATEGORY[form.category].map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
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
