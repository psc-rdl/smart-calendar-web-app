import { useState } from 'react';
import './App.css';

interface Task {
  title: string;
  duration: number; // in minutes
}

interface Event {
  title: string;
  start: string; // e.g. "10:00"
  end: string;   // e.g. "11:30"
  dayOffset: number;
}

function App() {
  const [task, setTask] = useState('');
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23
  const dayOffsets = [0, 1, 2];

  const formatHour = (hour: number) =>
    hour === 0 ? '12 AM' :
    hour < 12 ? `${hour} AM` :
    hour === 12 ? '12 PM' : `${hour - 12} PM`;

  const getDateLabel = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = durationHours * 60 + durationMinutes;
    if (!task || duration <= 0) return;

    setPendingTasks([...pendingTasks, { title: task, duration }]);
    setTask('');
    setDurationHours(0);
    setDurationMinutes(0);
  };

  const handleScheduleTasks = () => {
    const newEvents: Event[] = [];
    let currentTime = 0; // start from 12:00 AM
    let dayOffset = 0;

    for (const task of pendingTasks) {
      if (currentTime + task.duration > 24 * 60) { // past 12:00 AM next day
        currentTime = 0;
        dayOffset++;
      }

      const startHour = Math.floor(currentTime / 60);
      const startMin = currentTime % 60;
      const endMinTotal = currentTime + task.duration;
      const endHour = Math.floor(endMinTotal / 60);
      const endMin = endMinTotal % 60;

      const start = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
      const end = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      newEvents.push({ title: task.title, start, end, dayOffset });
      currentTime = endMinTotal;
    }

    setEvents(newEvents);
  };

  return (
    <div className="calendar-wrapper">
      <div className="form-panel">
        <h1>Schedule Tasks</h1>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task name"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <label>Duration</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="number"
              min="0"
              placeholder={durationHours === 0 ? "Hrs" : ""}
              value={durationHours === 0 ? "" : durationHours} // Display empty if 0
              onChange={(e) => setDurationHours(e.target.value ? Number(e.target.value) : 0)} // Handle empty input correctly
              style={{ width: '60px' }}
            />
            <input
              type="number"
              min="0"
              max="59"
              placeholder={durationMinutes === 0 ? "Min" : ""}
              value={durationMinutes === 0 ? "" : durationMinutes} // Display empty if 0
              onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : 0)} // Handle empty input correctly
              style={{ width: '60px' }}
            />
          </div>

          <button type="submit">Add Task</button>
        </form>

        <h2>Pending Tasks</h2>
        <ul>
          {pendingTasks.map((t, i) => (
            <li key={i}>
              {t.title} – {Math.floor(t.duration / 60)}h {t.duration % 60}m
            </li>
          ))}
        </ul>

        <button onClick={handleScheduleTasks}>Optimize Schedule</button>
      </div>

      <div className="calendar-container">
        <div className="time-column">
          {hours.map((h) => (
            <div key={h} className="time-slot">{formatHour(h)}</div>
          ))}
        </div>

        {dayOffsets.map((dayIdx) => (
          <div key={dayIdx} className="day-column">
            <div className="day-label">{getDateLabel(dayIdx)}</div>
            <div className="day-grid">
              {events
                .filter((ev) => ev.dayOffset === dayIdx)
                .map((ev, i) => {
                  const [startH, startM] = ev.start.split(':').map(Number);
                  const [endH, endM] = ev.end.split(':').map(Number);
                  const startMinutes = startH * 60 + startM;
                  const endMinutes = endH * 60 + endM;
                  const top = startMinutes;
                  const height = endMinutes - startMinutes;

                  return (
                    <div
                      key={i}
                      className="event-block"
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <div className="event-title">{ev.title}</div>
                      <div className="event-time">{ev.start} - {ev.end}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
