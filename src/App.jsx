import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import Login from './Login';

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
    <>
      <h1>Vítej, {username}!</h1>
      <button onClick={handleLogout}>Odhlásit se</button>
    </>
  );
}

export default App;