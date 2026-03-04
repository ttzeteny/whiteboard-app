
import { Link } from "react-router-dom";

function LoginUI({ email, setEmail, password, setPassword, error, handleLogin }) {
  return (
    <div>
      <nav className="navbar">
        <h1><a href="/">BOARD IT</a></h1>
      </nav>
      <div className="auth-container">
        <form className="auth-box" onSubmit={handleLogin}>
          <h2>Log in</h2>
          {error && <div className="error-banner">
                    <span>⚠️</span> {error}
                    </div>
          }
          <input 
            type="email" 
            placeholder="Email"
            title="Enter your email address." 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password"
            title="Enter your password."
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-primary">Login</button>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </form>
      </div>
    </div>
  );
}

export default LoginUI;