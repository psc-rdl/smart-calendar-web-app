import { useState } from 'react';
import './Scheduler.css';

interface Task {
  title: string;
  duration: number; // in minutes
  deadline: string; // e.g., "2025-04-25"
  priority: 'High' | 'Medium' | 'Low';
}

interface Event {
  title: string;
  start: string; // e.g. "10:00"
  end: string;   // e.g. "11:30"
  dayOffset: number;
}

function Scheduler() {
  const [task, setTask] = useState('');
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
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
    if (!task || duration <= 0 || !deadline) return;

    setPendingTasks([...pendingTasks, { title: task, duration, deadline, priority }]);
    setTask('');
    setDurationHours(0);
    setDurationMinutes(0);
    setDeadline('');
    setPriority('Medium');
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
              value={durationHours === 0 ? "" : durationHours}
              onChange={(e) => setDurationHours(e.target.value ? Number(e.target.value) : 0)}
              style={{ width: '60px' }}
            />
            <input
              type="number"
              min="0"
              max="59"
              placeholder={durationMinutes === 0 ? "Min" : ""}
              value={durationMinutes === 0 ? "" : durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : 0)}
              style={{ width: '60px' }}
            />
          </div>

          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{ marginBottom: '10px' }}
          />

          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
            style={{ marginBottom: '10px' }}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button type="submit">Add Task</button>
        </form>

        <h2>Pending Tasks</h2>
        <ul>
          {pendingTasks.map((t, i) => (
            <li key={i}>
              <strong>{t.title}</strong> – {Math.floor(t.duration / 60)}h {t.duration % 60}m<br />
              Deadline: {t.deadline}, Priority: {t.priority}
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
          <div className="day-header">
            <div className="day-label">{getDateLabel(dayIdx)}</div>
          </div>
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

export default Scheduler;
