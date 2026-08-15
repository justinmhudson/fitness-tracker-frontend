export default function Homepage({ workouts, onDelete }) {

  const latestTreadmill = workouts
    .filter((w) => w.exercise === 'Treadmill' && w.duration === 30)
    .reduce((latest, w) => (
      !latest || new Date(w.date) > new Date(latest.date) ? w : latest
    ), null);
  
  if (workouts.length === 0) {
    return <p className="empty-state">No workouts logged yet. Add your first one above.</p>;
  }

  if (latestTreadmill != null) {
    return (
      <div>
        <h2>Current Treadmill Pace — {Math.ceil((latestTreadmill.distance * 2) * 10) / 10} mph</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>05:00</td>
                <td>{Math.ceil((latestTreadmill.distance / 6) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>10:00</td>
                <td>{Math.ceil((latestTreadmill.distance / 6 * 2) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>15:00</td>
                <td>{Math.ceil((latestTreadmill.distance / 6 * 3) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>20:00</td>
                <td>{Math.ceil((latestTreadmill.distance / 6 * 4) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>25:00</td>
                <td>{Math.ceil((latestTreadmill.distance / 6 * 5) * 100) / 100} mi</td>
              </tr>
              <tr>
                <td>30:00</td>
                <td>{Math.ceil((latestTreadmill.distance) * 100) / 100} mi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
