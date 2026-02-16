import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signing up:", email);
    navigate("/login");
  };

  return (
    <div>
        <nav className="navbar">
            <h1><a href="/">BOARD IT</a></h1>
        </nav>
        <div className="auth-container">
            <form className="auth-box" onSubmit={handleSignup}>
                <h2>Create Account</h2>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Password again" onChange={(e) => setPasswordAgain(e.target.value)} required />
                <button type="submit" className="btn-primary">Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    </div>
    
  );
}

export default Signup;