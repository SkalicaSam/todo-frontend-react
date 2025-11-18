import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateLogin } from '../utils/Validators';

import styles from './Login.module.css';

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

    <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Login</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              className={styles.inputField}
              value={username}
              onChange={(e) => {
                  setUsername(e.target.value);
                  setValidationErrors({...validationErrors, username: ''});
                  setError(null);
                  }}
            />
            {validationErrors.username &&
                <p className={styles.errorMessage}>{validationErrors.username}</p>}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={styles.inputField}
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setValidationErrors({...validationErrors, password: ''});
                    setError(null);
                    }}
              />
              {validationErrors.password &&
                  <p className={styles.errorMessage}>{validationErrors.password}</p>}
          </div>

          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button
         type="submit"
         className={styles.submitButton}

         >Login</button>
      </form>
    </div>
  );
}
