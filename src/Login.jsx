import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Zakódovanie username:password do Base64
    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await fetch("http://localhost:8080/api/auth/check", {
        method: "GET", // alebo POST, podľa toho čo máš
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.text();
        localStorage.setItem('credentials', credentials);  // Save credentials for future requests
        console.log("Úspešné prihlásenie:", data);
        onLogin(username, credentials);  // Informuje rodiče o úspěšném přihlášení
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
  );
}
