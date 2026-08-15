//import UpperBodyForm from './UpperBodyForm.jsx';
import CardioForm from './CardioForm.jsx';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

export default function UpperBody({ workouts, onAdd, onDelete }) {

  content = (
    <div>
      {workouts.map((w) => (
        <p key={w._id}>
          <div>
            <span>{w.exercise}</span>
            <span>
              {w.sets} × {w.reps} — {w.weight} lbs
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
