export default function WorkoutList({ workouts, onDelete }) {

  if (workouts.length === 0) {
    return <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  }

  return (
    <ul className="workout-list">
      {workouts.map((w) => (
        <li key={w._id} className="workout-card">
          <div className="workout-card__main">
            <span className="workout-card__exercise">{w.exercise}</span>
            <span className="workout-card__meta">
              {w.sets} × {w.reps}
              {w.weight > 0 ? ` @ ${w.weight} lbs` : ''}
            </span>
            {w.notes && <span className="workout-card__notes">{w.notes}</span>}
            <span className="workout-card__date">
              {new Date(w.date).toLocaleDateString()}
            </span>
          </div>
          <button
            className="workout-card__delete"
            onClick={() => onDelete(w._id)}
            aria-label={`Delete ${w.exercise}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
