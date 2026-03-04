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
  return (
    <div>
      <nav className="navbar">
        <h1><a href="/">BOARD IT</a></h1>
      </nav>
      <div className="auth-container">
        <form className="auth-box" onSubmit={onSubmit}>
          <h2>Create Account</h2>
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          
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
            required 
          />
          <input 
            type="password" 
            placeholder="Password again" 
            value={passwordAgain} 
            onChange={(e) => setPasswordAgain(e.target.value)} 
            required 
          />
          
          <button type="submit" className="btn-primary">Sign Up</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default SignupUI;