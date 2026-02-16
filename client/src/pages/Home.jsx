import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1><a href="/">BOARD IT</a></h1>
        <div className="nav-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </nav>
      
      <header className="hero-section">
        <h2>Collaborate in Real-Time</h2>
        <p>The ultimate shared whiteboard experience. Draw, chat, and brainstorm with your team from anywhere in the world.</p>
        <button className="btn-primary" style= {{fontSize: '1.2rem', padding: '15px 40px'}} onClick={() => navigate("/signup")}>
          Get Started for Free
        </button>
      </header>
    </div>
  );
}
export default Home;