import { useState } from 'react';
import './App.css';

interface Event {
  title: string;
  start: string; // e.g. "10:00"
  end: string;   // e.g. "11:30"
  dayOffset: number; // 0 = today, 1 = tomorrow, etc.
}

function App() {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(''); // in minutes
  const [events, setEvents] = useState<Event[]>([]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !duration) return;

    const durationMinutes = parseInt(duration);
    const dayOffset = 1; // default to tomorrow

    const optimalStartHour = findAvailableSlot(dayOffset, durationMinutes);
    if (optimalStartHour === null) {
      alert("No available slot!");
      return;
    }

    const startHour = Math.floor(optimalStartHour);
    const startMinutes = Math.round((optimalStartHour - startHour) * 60);
    const endMinutesTotal = startHour * 60 + startMinutes + durationMinutes;
    const endHour = Math.floor(endMinutesTotal / 60);
    const endMinutes = endMinutesTotal % 60;

    const formatTime = (h: number, m: number) =>
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    const startTime = formatTime(startHour, startMinutes);
    const endTime = formatTime(endHour, endMinutes);

    setEvents([...events, { title: task, start: startTime, end: endTime, dayOffset }]);
    setTask('');
    setDuration('');
  };

  // Fake scheduler: just finds the next available hour starting at 8AM
  const findAvailableSlot = (dayOffset: number, duration: number): number | null => {
    const taken: [number, number][] = events
      .filter(ev => ev.dayOffset === dayOffset)
      .map(ev => {
        const startParts = ev.start.split(':').map(Number);
        const endParts = ev.end.split(':').map(Number);
        const start = startParts[0] + startParts[1] / 60;
        const end = endParts[0] + endParts[1] / 60;
        return [start, end];
      });

    for (let hour = 8; hour <= 20 - duration / 60; hour += 0.25) {
      const end = hour + duration / 60;
      if (taken.every(([s, e]) => end <= s || hour >= e)) {
        return hour;
      }
    }
    return null;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const formatHour = (hour: number) =>
    hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

  const getDateLabel = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const dayOffsets = [0, 1, 2];

  return (
    <div className="calendar-wrapper">
      <div className="form-panel">
        <h1>Schedule an Event</h1>
        <form onSubmit={handleAddEvent}>
          <input
            type="text"
            placeholder="Task name"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration (min)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button type="submit">Add Event</button>
        </form>
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
                  const start = parseFloat(ev.start.replace(':', '.'));
                  const end = parseFloat(ev.end.replace(':', '.'));
                  const top = (start - 8) * 60;
                  const height = (end - start) * 60;
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
