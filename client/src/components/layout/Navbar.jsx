import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">TaskFlow</div>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Profile
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Login
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Register
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;