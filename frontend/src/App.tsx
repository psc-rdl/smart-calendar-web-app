import { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, duration }),
    });

    const data = await res.json();
    setResponse(data.message || 'Scheduled!');
  };

  return (
    <div>
      <h1>Task Scheduler</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task name"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="text"
          placeholder="Duration (in minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button type="submit">Schedule Task</button>
      </form>
      <p>{response}</p>
    </div>
  );
}

export default App;

