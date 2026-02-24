import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password != passwordAgain) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occured during registration.");
      }

      alert("Registration successful! You can log in now.");
      navigate("/login");

    } catch(error) {
      setError(error.message);
    }
  };

  return (
    <div>
        <nav className="navbar">
            <h1><a href="/">BOARD IT</a></h1>
        </nav>
        <div className="auth-container">
            <form className="auth-box" onSubmit={handleSignup}>
                <h2>Create Account</h2>
                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Password again" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} required />
                <button type="submit" className="btn-primary">Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    </div>
    
  );
}

export default Signup;