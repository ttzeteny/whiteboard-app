import '../Style/Homepage.css';
import '../Style/App.css';

function HomeUI({ onNavigateLogin, onNavigateSignup }) {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1><a href="/">BOARD IT</a></h1>
        <div className="nav-buttons">
          <button onClick={onNavigateLogin}>Login</button>
          <button onClick={onNavigateSignup}>Sign Up</button>
        </div>
      </nav>
      
      <header className="hero-section">
        <h2>Collaborate in Real-Time</h2>
        <p>
          The ultimate shared whiteboard experience. Draw, chat, and brainstorm 
          with your team from anywhere in the world.
        </p>
        <button 
          className="btn-primary" 
          style={{ fontSize: '1.2rem', padding: '15px 40px' }} 
          onClick={onNavigateSignup}
        >
          Get Started for Free
        </button>
      </header>
    </div>
  );
}

export default HomeUI;