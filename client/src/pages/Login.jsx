import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", email);
    navigate("/dashboard");
  };

  return (
    <div>
      <nav className="navbar">
            <h1><a href="/">BOARD IT</a></h1>
      </nav>
      <div className="auth-container">
          <form className="auth-box" onSubmit={handleLogin}>
            <h2>Log in</h2>
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