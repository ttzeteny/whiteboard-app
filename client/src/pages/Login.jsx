import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error trying to log in");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <nav className="navbar">
            <h1><a href="/">BOARD IT</a></h1>
      </nav>
      <div className="auth-container">
          <form className="auth-box" onSubmit={handleLogin}>
            <h2>Log in</h2>
            {error && <p style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn-primary">Login</button>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </form>
      </div>
    </div>
    
  );
}
export default Login;