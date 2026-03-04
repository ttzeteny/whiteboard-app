import React, { useState } from 'react';
import '../Style/App.css';
import '../Style/Signup.css';
import { Link } from "react-router-dom";

function SignupUI({ 
  name, setName, 
  email, setEmail, 
  password, setPassword, 
  passwordAgain, setPasswordAgain, 
  error, onSubmit 
}) {

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const requirements = [
    { label: "8 characters", met: password.length >= 8 },
    {label: "one upper- and lowercase letter", met: /[A-Z]/.test(password) && /[a-z]/.test(password)},
    { label: "one number", met: /\d/.test(password) },
    { label: "one special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div>
      <nav className="navbar">
        <h1><a href="/">BOARD IT</a></h1>
      </nav>
      <div className="auth-container">
        <form className="auth-box" onSubmit={onSubmit}>
          <h2>Create Account</h2>
          {error && <div className="error-banner">
                    <span>⚠️</span> {error}
                    </div>
          }
          
          <input 
            type="text" 
            placeholder="Username" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password again" 
            value={passwordAgain} 
            onChange={(e) => setPasswordAgain(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            required 
          />

          {isPasswordFocused && (
            <div className="password-requirements-tab">
              <p>Password must contain at least:</p>
              <ul>
                {requirements.map((req, index) => (
                  <li key={index} style={{ color: req.met ? '#2ecc71' : '#e74c3c', fontSize: '0.8rem' }}>
                    {req.met ? '✓' : '✗'} {req.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button type="submit" className="btn-primary">Sign Up</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default SignupUI;