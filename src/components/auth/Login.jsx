import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateLogin } from '../utils/Validators';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});



  const handleLogin = async (e) => {
    e.preventDefault();

  // Validate first
      const validationErrors = validateLogin(username, password);
      if (Object.keys(validationErrors).length > 0) {
        setValidationErrors(validationErrors);
        return;
      }


    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        onLogin(username, data.token);
        navigate("/"); // This will now work
      } else {
         const errorMessage = await response.text();
         setError(errorMessage);
         setPassword("");
      }
    } catch (error) {
      setPassword("");
      setError("Connection Error");
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
              setUsername(e.target.value);
              setValidationErrors({...validationErrors, username: ''});
              }}
        />
        {validationErrors.username && <p style={{ color: 'red', margin: 0 }}>{validationErrors.username}</p>}
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors({...validationErrors, password: ''});
                }}
          />
          {validationErrors.password && <p style={{ color: 'red', margin: 0 }}>{validationErrors.password}</p>}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',          // Removes border
              outline: 'none',         // Removes outline when clicked
              cursor: 'pointer',
              padding: '0 5px'         // Adds some clickable area
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
