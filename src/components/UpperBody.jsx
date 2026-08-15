//import UpperBodyForm from './UpperBodyForm.jsx';
import { CATEGORIES, EXERCISES_BY_CATEGORY } from '../exerciseOptions.js';

export default function UpperBody({ workouts, onAdd, onDelete }) {

    const latestUpperBodyExercises = [];

    for (const category of EXERCISES_BY_CATEGORY['Upper Body'][0]) {
        const latestExercise = workouts
        .filter((w) => w.exercise === category)
        .reduce((latest, w) => (
            !latest || new Date(w.date) > new Date(latest.date) ? w : latest
        ), null);
        latestUpperBodyExercises.push(latestExercise);
    }

  let content;
  if (workouts.length === 0) {
    content = <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  } else if (latestUpperBodyExercises.length == 0) {
    content = <p className="empty-state">No upper body exercises logged yet. Add your first one above.</p>;
  } else {
    content = (
      <div>
       <p>{latestUpperBodyExercises[0]?.exercise}: {latestUpperBodyExercises[0]?.sets} x {latestUpperBodyExercises[0]?.reps} {latestUpperBodyExercises[0]?.weight} lbs</p>
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
