import { useState } from 'react';
import './Scheduler.css';

interface Task {
  title: string;
  duration: number; // in minutes
  deadline: string; // e.g., "2025-04-25"
  priority: number; // 1 to 5
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
  const [priority, setPriority] = useState<number>(5);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23
  const dayOffsets = Array.from({ length: 7 }, (_, i) => i);

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
    setPriority(5);
  };

  const handleScheduleTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/optimize-schedule', { // Replace with your API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: pendingTasks }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to optimize schedule');
      }
  
      const data = await response.json();
      setEvents(data.events); // Assuming backend returns { events: Event[] }
    } catch (error) {
      console.error('Error optimizing schedule:', error);
    }
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
          <p className="priority-description">1-high, 5-low</p>
          <input
            type="number"
            min="1"
            max="5"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            style={{ marginBottom: '10px' }}
          />

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
