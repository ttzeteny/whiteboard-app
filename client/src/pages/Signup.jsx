import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SignupUI from "../UI/SignupUI";

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

    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    if (!minLength || !hasNumber || !hasSpecialChar || !hasUppercase || !hasLowercase) {
      setError("Password does not meet the requirements!");
      return;
    }

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
    <SignupUI 
      name={name} setName={setName}
      email={email} setEmail={setEmail}
      password={password} setPassword={setPassword}
      passwordAgain={passwordAgain} setPasswordAgain={setPasswordAgain}
      error={error}
      onSubmit={handleSignup}
    />
  );
}

export default Signup;