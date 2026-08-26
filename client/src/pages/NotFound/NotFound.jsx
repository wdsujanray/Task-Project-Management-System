import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="login-panel">
        <h1>404</h1>
        <p>Page Not Found</p>
        <NavLink to="/" className="btn">
          Go Home
        </NavLink>
      </div>
    </div>
  );
}

export default NotFound;
