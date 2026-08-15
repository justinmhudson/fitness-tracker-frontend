// Single source of truth for which exercises belong to which category.
// Add or edit exercises here — the form dropdown reads directly from this.

export const EXERCISES_BY_CATEGORY = {
  Cardio: ['Treadmill', 'Stair Master', 'Stationary Bike', 'Ergometer'],
  'Upper Body': ['Chest Press', 'Pulldown', 'Row', 'Shoulder Press', 'Bicep Curl', 'Tricep Press'],
  'Lower Body': ['Leg Press', 'Back Extension', 'Leg Curl', 'Calf Extension', 'Abdominal'],
};

export const CATEGORIES = Object.keys(EXERCISES_BY_CATEGORY);