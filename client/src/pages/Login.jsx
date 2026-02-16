import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your auth logic here (Firebase, MongoDB, etc.)
    console.log("Logging in:", email);
    navigate("/dashboard"); // Redirect on success
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn-primary">Login</button>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  );
}
export default Login;