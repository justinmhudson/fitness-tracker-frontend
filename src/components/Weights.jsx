import { useState, useEffect } from 'react';
import { EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

// <input type="date"> requires "YYYY-MM-DD". MongoDB gives back a full
// ISO timestamp (e.g. "2026-08-15T00:00:00.000Z"), so this trims it down.
function toDateInputValue(isoString) {
  const date = new Date(isoString);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localISODate = new Date(date.getTime() - offsetMs).toISOString().slice(0, -1);
  return localISODate.toISOString().slice(0, 10);
}

export default function Weights({ workouts, onAdd, onDelete, onUpdate, activeTab }) {

  const [form, setForm] = useState({
    category: activeTab,
    exercise: EXERCISES_BY_CATEGORY[activeTab][0],
    sets: '',
    reps: '',
    weight: '',
    isFail: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ date: '', weight: '', sets: '', reps: '', isFail: false });
  const [savingEdit, setSavingEdit] = useState(false);

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

  function startEditing(w) {
    setEditingId(w._id);
    setEditValues({
      date: toDateInputValue(w.date),
      weight: w.weight,
      sets: w.sets,
      reps: w.reps,
      isFail: w.isFail,
    });
  }

  function cancelEditing() {
    setEditingId(null);
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function saveEdit(id) {
    setSavingEdit(true);
    try {
      await onUpdate(id, {
        date: editValues.date,
        weight: Number(editValues.weight),
        sets: Number(editValues.sets),
        reps: Number(editValues.reps),
        isFail: editValues.isFail,
      });
      setEditingId(null);
    } finally {
      setSavingEdit(false);
    }
  }

  const recentWeights = workouts
    .filter((w) => w.exercise === form.exercise)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

 let content;
  if (workouts.length === 0) {
    content = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (recentWeights.length === 0) {
    content = <p className="empty-state">No {form.exercise} entries logged yet. Add your first one above.</p>;
  } else {
    content = (
      <div>
        <h3>Last Five {form.exercise} Attempts</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Failed?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentWeights.map((w) => {
                const isEditing = editingId === w._id;
                return (
                  <tr key={w._id} className={w.isFail ? 'row--failed' : ''}>
                    {isEditing ? (
                      <>
                        <td>
                          <input
                            className="table-edit-input"
                            name="date"
                            type="date"
                            value={editValues.date}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            className="table-edit-input"
                            name="weight"
                            type="number"
                            min="0"
                            value={editValues.weight}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            className="table-edit-input"
                            name="sets"
                            type="number"
                            min="0"
                            value={editValues.sets}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            className="table-edit-input"
                            name="reps"
                            type="number"
                            min="0"
                            value={editValues.reps}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            name="isFail"
                            type="checkbox"
                            checked={editValues.isFail}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td className="table-actions">
                          <button
                            type="button"
                            className="table-action-btn"
                            onClick={() => saveEdit(w._id)}
                            disabled={savingEdit}
                          >
                            {savingEdit ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            type="button"
                            className="table-action-btn table-action-btn--cancel"
                            onClick={cancelEditing}
                            disabled={savingEdit}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{new Date(w.date).toLocaleDateString()}</td>
                        <td>{w.weight} lbs</td>
                        <td>{w.sets}</td>
                        <td>{w.reps}</td>
                        <td>{w.isFail ? 'Yes' : 'No'}</td>
                        <td className="table-actions">
                          <button
                            type="button"
                            className="table-action-btn"
                            onClick={() => startEditing(w)}
                          >
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
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
          Failed Attempt?
        </label>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Log workout'}
      </button>
    </form>
    {content}
    </>
  );
}