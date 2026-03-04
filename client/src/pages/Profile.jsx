import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import '../Style/App.css';
import '../Style/Profile.css';
import ProfileUI from "../UI/ProfileUI";

const socket = io.connect("http://localhost:3001");

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: null, name: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }

    socket.on("account_deleted", () => {
        alert("Your account has been successfully deleted.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signup");
    });

    return () => {
        socket.off("account_deleted");
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
        "WARNING: Are you sure you want to delete your account? All your rooms and drawings will be permanently lost. This action CANNOT be undone!"
    );
    
    if (confirmDelete) {
        socket.emit("delete_account", user.id);
    }
  };

  return (
    <ProfileUI 
      user={user} 
      onLogout={handleLogout} 
      onDelete={handleDeleteAccount}
      onNavigateDashboard={() => navigate("/dashboard")}
    />
  );
}

export default Profile;