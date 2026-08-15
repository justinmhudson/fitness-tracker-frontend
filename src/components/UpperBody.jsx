//import UpperBodyForm from './UpperBodyForm.jsx';
import CardioForm from './CardioForm.jsx';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

export default function UpperBody({ workouts, onAdd, onDelete }) {

const latestUpperBody = workouts
    .filter((w) => CATEGORIES.includes(w.category) && EXERCISES_BY_CATEGORY['Upper Body'].includes(w.exercise))
    .reduce((latest, w) => (
      !latest || new Date(w.date) > new Date(latest.date) ? w : latest
    ), null);

  const content = (
    <div>
      {latestUpperBody.map((w) => (
        <p key={w._id}>
          <div>
            <span>
              {w.exercise}: {w.sets} × {w.reps} — {w.weight} lbs
            </span>
          </div>
        </p>
      ))}
    </div>
  );

  return (
    <>
      <CardioForm onAdd={onAdd} />
      {content}
    </>
  );
}
