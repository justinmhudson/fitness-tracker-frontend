import { useState } from 'react';
import { CATEGORIES } from '../exerciseOptions.js';

// Turns "Upper Body" into "upper-body" for use in a CSS class name.
function toClassSuffix(category) {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ workouts }) {
  const today = new Date();
  const [year, setYear] = useState(today.getUTCFullYear());
  const [month, setMonth] = useState(today.getUTCMonth()); // 0-indexed

  // Group workouts by their UTC calendar date, tracking which categories
  // were logged that day — e.g. "2026-08-15" -> Set{"Cardio","Upper Body"}.
  // Workout dates come back from Mongo as ISO strings like
  // "2026-08-15T04:00:19.354Z", so slicing the first 10 characters gives
  // the UTC calendar date directly, no Date object needed.
  const categoriesByDate = {};
  workouts.forEach((w) => {
    const key = w.date.slice(0, 10);
    if (!categoriesByDate[key]) categoriesByDate[key] = new Set();
    categoriesByDate[key].add(w.category);
  });

  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null); // empty leading cells so day 1 lands on the right weekday
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  function goToPrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button type="button" className="calendar__nav-btn" onClick={goToPrevMonth}>
          ‹
        </button>
        <h2>{MONTH_NAMES[month]} {year}</h2>
        <button type="button" className="calendar__nav-btn" onClick={goToNextMonth}>
          ›
        </button>
      </div>

      <div className="calendar__legend">
        {CATEGORIES.map((cat) => (
          <span key={cat} className={`badge badge--${toClassSuffix(cat)}`}>
            {cat}
          </span>
        ))}
      </div>

      <div className="calendar__grid">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="calendar__weekday">
            {label}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="calendar__cell calendar__cell--empty" />;
          }
          const key = `${year}-${pad(month + 1)}-${pad(day)}`;
          const categories = categoriesByDate[key];
          return (
            <div key={key} className="calendar__cell">
              <span className="calendar__day-number">{day}</span>
              {categories && (
                <div className="calendar__badges">
                  {[...categories].map((cat) => (
                    <span key={cat} className={`badge badge--${toClassSuffix(cat)}`}>
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
