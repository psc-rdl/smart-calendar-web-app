// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Scheduler from './Scheduler';
import Login from './Login';
import { useEffect } from 'react';

// Component to manage body class based on route
function BodyClassManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      document.body.className = 'login-body';
    } else if (location.pathname === '/scheduler') {
      document.body.className = 'scheduler-body';
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <BodyClassManager />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scheduler" element={<Scheduler />} />
      </Routes>
    </Router>
  );
}

export default App;
