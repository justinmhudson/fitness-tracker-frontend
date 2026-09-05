// Single source of truth for which exercises belong to which category.
// Add or edit exercises here — the form dropdown reads directly from this.

export const EXERCISES_BY_CATEGORY = {
  'Cardio': ['Treadmill', 'Stair Master', 'Stationary Bike'],
  'Upper Body': ['Chest Press', 'Pulldown', 'Row', 'Shoulder Press', 'Triceps Press'],
  'Lower Body': ['Squat', 'RDL', 'DB Calf Raises', 'Abdominal', 'Biceps Curl'],
  'Other': ['Yoga', 'Balance'],
};

// 'Bicep Curl'
// 'DB RDL', 'DB Squat', 'Calf Extension'
// , 'Leg Press', 'Back Extension', 'Leg Curl'

export const CATEGORIES = Object.keys(EXERCISES_BY_CATEGORY);