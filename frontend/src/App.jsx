import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // If user exists in localStorage, go straight to dashboard. Otherwise, show landing.
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("user") ? "dashboard" : "landing";
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView("dashboard");
  };

  const triggerLogout = () => {
    setCurrentView("logout");
  };

  const handleLogoutComplete = () => {
    setUser(null);
    setCurrentView("landing");
  };

  if (currentView === "landing") {
    return <Landing onGetStarted={() => setCurrentView("login")} />;
  }

  if (currentView === "login") {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        switchToRegister={() => setCurrentView("register")}
      />
    );
  }

  if (currentView === "register") {
    return <Register switchToLogin={() => setCurrentView("login")} />;
  }

  if (currentView === "logout") {
    return <Logout onLogoutComplete={handleLogoutComplete} />;
  }

  return <Dashboard user={user} triggerLogout={triggerLogout} />;
}

export default App;