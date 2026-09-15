import { NavLink } from "react-router-dom";
import projectMark from "../../assets/hero.png";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-panel">
        <div className="not-found-art" aria-hidden="true">
          <img src={projectMark} alt="" />
          <span className="not-found-mark">?</span>
        </div>
        <p className="eyebrow">Lost in the workspace</p>
        <p className="not-found-code">ERROR 404</p>
        <h1>Page Not Found</h1>
        <p className="not-found-title">That page moved.</p>
        <p>We could not find the project view you were looking for. Let&apos;s get you back to your workspace.</p>
        <div className="not-found-actions">
          <NavLink to="/" className="btn">Return home</NavLink>
          <NavLink to="/dashboard" className="btn secondary">Open dashboard</NavLink>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
