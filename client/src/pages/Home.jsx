import { useNavigate } from "react-router-dom";
import '../Style/Homepage.css';
import '../Style/App.css';
import HomeUI from "../UI/HomeUI";

function Home() {
  const navigate = useNavigate();
  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  return (
    <HomeUI 
      onNavigateLogin={handleLogin} 
      onNavigateSignup={handleSignup} 
    />
  );
}
export default Home;