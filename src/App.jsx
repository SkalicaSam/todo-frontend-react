import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Tasks from './Tasks';
import EditTask from './EditTask';
import CreateTask from './CreateTask';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);  // nový stav

    useEffect(() => {
      const token = sessionStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        const savedUsername = localStorage.getItem('username');
        setUsername(savedUsername || 'User');
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('username');
      }
    setIsLoading(false);  // načítání dokončeno
    }, []);

  const handleLogin = (username, token) => {
    sessionStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

    if (isLoading) {
      return null; // nebo můžeš zobrazit spinner/loading komponentu
    }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;   // předání onLogin prop
  }

  return (
      <Router>
            <nav>
              <Link to="/">Home</Link> |{' '}
              <Link to="/tasks">My Tasks</Link> |{' '}
              <button onClick={handleLogout}>Logout</button>
            </nav>

            <Routes>
              <Route path="/" element={<h1>Welcome, {username}!</h1>} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/edit-task/:id" element={<EditTask />} />
              <Route path="/create-task" element={<CreateTask />} />
            </Routes>
          </Router>
  );
}

export default App;