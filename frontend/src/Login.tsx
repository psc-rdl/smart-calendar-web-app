//import { useNavigate } from 'react-router-dom';
import './Login.css';  // Importing the CSS file

function Login() {
  //const navigate = useNavigate();

  const handleLogin = () => {
    window.location.assign('http://localhost:3001/auth/google');
  };

  return (
    <div className="login-body">
        <div className="login-container">
            <h1>Welcome to Smart Scheduler</h1>
            <p>Plan your day smarter! Smart Scheduler integrates <br/>with your Google Calendar to optimize your productivity!</p>
            <button onClick={handleLogin} className="login-button">
                Sign in with Google
            </button>
        </div>
    </div>
  );
}

export default Login;
