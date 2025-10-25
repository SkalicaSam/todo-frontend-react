import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/register1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        onLogin(username, data.token);
        navigate('/tasks');
      } else {
        setError(data?.message || "Uživatelské jméno je již obsazeno!");
      }
    } catch (error) {
      console.error("Chyba registrace:", error);
      setError("Chyba spojení se serverem");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Uživatelské jméno"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrovat</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </form>
  );
}