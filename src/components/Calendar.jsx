import { useState } from 'react';
import { CATEGORIES } from '../exerciseOptions.js';

// Turns "Upper Body" into "upper-body" for use in a CSS class name.
function toClassSuffix(category) {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// Turns a stored ISO timestamp into the viewer's local calendar date,
// e.g. "2026-08-15T04:00:19.354Z" -> "2026-08-14" for someone in a
// timezone behind UTC. new Date(isoString) auto-converts to local time;
// getFullYear/getMonth/getDate (no "UTC" prefix) read it back in that
// same local time, which is exactly what we want here.
function toLocalDateKey(isoString) {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ workouts }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  // Computed once per render so every cell can cheaply check against it,
  // rather than each cell constructing its own Date to compare.
  const todayKey = toLocalDateKey(today.toISOString());

  // Group workouts by the viewer's local calendar date, tracking which
  // categories were logged that day — e.g. "2026-08-15" -> Set{"Cardio"}.
  const categoriesByDate = {};
  workouts.forEach((w) => {
    const key = toLocalDateKey(w.date);
    if (!categoriesByDate[key]) categoriesByDate[key] = new Set();
    categoriesByDate[key].add(w.category);
  });

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

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
          const isToday = key === todayKey;
          return (
            <div key={key} className={isToday ? 'calendar__cell calendar__cell--today' : 'calendar__cell'}>
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
