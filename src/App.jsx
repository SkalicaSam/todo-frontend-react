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
      const savedUsername = localStorage.getItem('username');
      const savedCredentials = localStorage.getItem('credentials');
      if (savedUsername && savedCredentials) {
        setIsLoggedIn(true);
        setUsername(savedUsername);
      }
    setIsLoading(false);  // načítání dokončeno
    }, []);

  const handleLogin = (username, credentials) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username);
    localStorage.setItem('credentials', credentials);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('credentials');
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