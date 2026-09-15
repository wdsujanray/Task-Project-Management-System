import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkSession = () => {
    const session = JSON.parse(localStorage.getItem("taskflowSession") || "null");
    setIsLoggedIn(session && session.loggedIn === true);
  };

  useEffect(() => {
    checkSession();
  }, [location]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("taskflowSession");
    localStorage.removeItem("taskflowUser");
    localStorage.removeItem("taskflowToken");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" aria-label="Task and Project Management System home">
          <img src={logo} alt="Task and Project Management System" />
        </NavLink>

        <button
          type="button"
          className="nav-menu-toggle"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="main-navigation" className={`nav-links ${isMenuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Dashboard
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/create-task" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Create Task
            </NavLink>
          )}
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Profile
          </NavLink>
          {!isLoggedIn && (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Login
            </NavLink>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;