import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Register from './Register';



export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

      try {
        // Zmena na POST request na správny endpoint
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('token', data.token);
          onLogin(username, data.token); // Posli token do App komponenty
          navigate("/");


      } else {
        console.error("Neúspešné prihlásenie");
        setError("Neplatné uživatelské jméno nebo heslo");
      }
    } catch (error) {
      console.error("Chyba:", error);
      setError("Chyba sítě");
    }
  };

  return (
     <div>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>


     </div>

  );
}
