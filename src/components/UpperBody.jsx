//import UpperBodyForm from './UpperBodyForm.jsx';
import CardioForm from './CardioForm.jsx';
import { EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

export default function UpperBody({ workouts, onAdd, onDelete }) {

  // For each Upper Body exercise, find the single most recent logged entry.
  const latestByExercise = EXERCISES_BY_CATEGORY['Upper Body']
    .map((exerciseName) =>
      workouts
        .filter((w) => w.exercise === exerciseName)
        .reduce((latest, w) => (
          !latest || new Date(w.date) > new Date(latest.date) ? w : latest
        ), null)
    )
    .filter((entry) => entry != null);

  let content;
  if (workouts.length === 0) {
    content = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (latestByExercise.length === 0) {
    content = <p className="empty-state">No upper body exercises logged yet. Add your first one above.</p>;
  } else {
    content = (
      <div>
        {latestByExercise.map((w) => (
          <p key={w._id}>
            Most Recent {w.exercise}: {w.sets} × {w.reps} — {w.weight} lbs
          </p>
        ))}
      </div>
    );
  }

  return (
    <>
      <CardioForm onAdd={onAdd} />
      {content}
    </>
  );
}