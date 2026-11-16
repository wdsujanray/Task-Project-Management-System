import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBriefcase,
  faBuilding,
  faCheck,
  faDiagramProject,
  faEnvelope,
  faListCheck,
  faPen,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import { getProfile, getProjects, getTasks } from "../../services/api";

function readCachedUser() {
  try {
    return JSON.parse(localStorage.getItem("taskflowUser") || "null");
  } catch {
    return null;
  }
}

function ProfileFact({ icon, label, value }) {
  return (
    <div className="my-profile-fact">
      <span className="my-profile-fact-icon" aria-hidden="true">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span>
        <small>{label}</small>
        <strong>{value || "Not set"}</strong>
      </span>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(readCachedUser);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    Promise.all([getProfile(token), getProjects(token), getTasks(token)])
      .then(([profile, savedProjects, savedTasks]) => {
        setUser(profile);
        setProjects(savedProjects);
        setTasks(savedTasks);
        localStorage.setItem("taskflowUser", JSON.stringify(profile));
        window.dispatchEvent(new Event("taskflow:user-updated"));
      })
      .catch((requestError) => {
        setError(requestError.message);
        if (["Authentication required", "Invalid authentication token"].includes(requestError.message)) {
          localStorage.removeItem("taskflowToken");
          localStorage.removeItem("taskflowSession");
          localStorage.removeItem("taskflowUser");
          navigate("/login", { replace: true });
        }
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  useEffect(() => {
    const refreshUser = () => setUser(readCachedUser());
    window.addEventListener("taskflow:user-updated", refreshUser);
    return () => window.removeEventListener("taskflow:user-updated", refreshUser);
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;

  if (isLoading && !user) {
    return <div className="profile-page"><p role="status">Loading your profile...</p></div>;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <PageTitle title="Profile unavailable" subtitle={error || "Your profile could not be loaded."} />
        {error && <p className="profile-error" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="profile-page my-profile-page">
      <section className="my-profile-hero">
        <div className="my-profile-cover" aria-hidden="true" />
        <div className="my-profile-identity">
          <div className="my-profile-avatar">
            {user.profileImage
              ? <img src={user.profileImage} alt={`${user.name}'s profile`} />
              : <span aria-hidden="true">{(user.name || "A").trim().charAt(0).toUpperCase()}</span>}
          </div>
          <div className="my-profile-heading">
            <p className="eyebrow">Personal account</p>
            <h1>Welcome, {user.name}</h1>
            <p>Your profile and workspace at a glance.</p>
          </div>
          <Link className="btn my-profile-edit-button" to="/edit-profile">
            <FontAwesomeIcon icon={faPen} aria-hidden="true" />
            Edit profile
          </Link>
        </div>
      </section>

      {location.state?.authMessage && <p className="auth-success" role="status">{location.state.authMessage}</p>}
      {error && <p className="profile-error" role="alert">{error}</p>}

      <section className="my-profile-stat-grid" aria-label="Work summary">
        <div className="my-profile-stat">
          <span className="my-profile-stat-icon"><FontAwesomeIcon icon={faDiagramProject} aria-hidden="true" /></span>
          <span><small>Projects</small><strong>{projects.length}</strong></span>
        </div>
        <div className="my-profile-stat">
          <span className="my-profile-stat-icon"><FontAwesomeIcon icon={faListCheck} aria-hidden="true" /></span>
          <span><small>Total tasks</small><strong>{tasks.length}</strong></span>
        </div>
        <div className="my-profile-stat">
          <span className="my-profile-stat-icon"><FontAwesomeIcon icon={faCheck} aria-hidden="true" /></span>
          <span><small>Completed tasks</small><strong>{completedTasks}</strong></span>
        </div>
      </section>

      <div className="my-profile-content">
        <Card title="Personal details" description="Your account information, visible only in your workspace.">
          <div className="my-profile-facts">
            <ProfileFact icon={faUser} label="Full name" value={user.name} />
            <ProfileFact icon={faEnvelope} label="Email address" value={user.email} />
            <ProfileFact icon={faBriefcase} label="Role" value={user.role || "Project Manager"} />
            <ProfileFact icon={faBuilding} label="Organization" value={user.organization} />
          </div>
        </Card>

        <Card title="Recent work" description="A quick look at the latest items in your workspace.">
          <div className="my-profile-work-list">
            {projects.slice(0, 3).map((project) => (
              <div className="my-profile-work-item" key={project._id}>
                <span className="my-profile-work-icon"><FontAwesomeIcon icon={faDiagramProject} aria-hidden="true" /></span>
                <span><strong>{project.name}</strong><small>{project.category || "Project"}</small></span>
                <span className="my-profile-work-status">{project.status || "Planning"}</span>
              </div>
            ))}
            {tasks.slice(0, 3).map((task) => (
              <div className="my-profile-work-item" key={task._id}>
                <span className="my-profile-work-icon"><FontAwesomeIcon icon={faListCheck} aria-hidden="true" /></span>
                <span><strong>{task.title || task.name}</strong><small>{task.category || "Task"}</small></span>
                <span className="my-profile-work-status">{task.completed ? "Completed" : "In progress"}</span>
              </div>
            ))}
            {!projects.length && !tasks.length && <p>No projects or tasks yet. Your workspace will show here as you add work.</p>}
          </div>
          <Link className="my-profile-text-link" to="/dashboard">
            Open dashboard <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </Link>
        </Card>
      </div>

      <div className="my-profile-footer-actions">
        <Link className="my-profile-secondary-link" to="/dashboard">Go to dashboard</Link>
      </div>
    </div>
  );
}

export default Profile;
