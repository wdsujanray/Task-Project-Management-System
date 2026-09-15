import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import { getProfile, getProjects, getTasks } from "../../services/api";
import profileCover from "../../assets/hero.png";

function ProfileDetail({ icon, label, value }) {
  return (
    <Card>
      <span className="profile-card-icon" aria-hidden="true">{icon}</span>
      <h3>{label}</h3>
      <p>{value}</p>
    </Card>
  );
}

function Profile() {
  const [user, setUser] = useState({
    name: "Demo User",
    email: "demo@example.com",
    role: "Project Manager",
    profileImage: "",
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const profileDetails = [
    { icon: "✓", label: "Full Name", value: user.name },
    { icon: "@", label: "Email", value: user.email },
    { icon: "★", label: "Role", value: user.role },
    { icon: "◆", label: "Project", value: "Task & Project Management System" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) return;
    Promise.all([getProfile(token), getProjects(token), getTasks(token)]).then(([profile, projectData, taskData]) => {
      setUser(profile);
      setProjects(projectData);
      setTasks(taskData);
    }).catch((error) => {
      if ((error.message === "Authentication required" || error.message === "Invalid authentication token") && localStorage.getItem("taskflowToken") === token) {
        localStorage.removeItem("taskflowToken");
        localStorage.removeItem("taskflowSession");
      }
    });
  }, []);

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-cover" style={{ backgroundImage: `url(${profileCover})` }}>
          {user.profileImage ? <img src={user.profileImage} alt={`${user.name} profile`} className="profile-image" /> : <div className="profile-avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</div>}
        </div>
        <div>
          <PageTitle title={user.name} subtitle="Manage your personal workspace details and activity preferences." />
        </div>
      </section>

      <div className="profile-grid">
        {profileDetails.map((detail) => <ProfileDetail key={detail.label} {...detail} />)}
      </div>

      <section className="profile-activity">
        <Card title="My Projects" description={`${projects.length} saved project${projects.length === 1 ? "" : "s"}`}>
          <ul className="dashboard-list">
            {projects.slice(0, 5).map((project) => <li key={project._id}><span><strong>{project.name}</strong><small>{project.category || "General"}</small></span><strong>{project.status || "Planning"}</strong></li>)}
            {!projects.length && <li><span>No saved projects yet</span></li>}
          </ul>
        </Card>
        <Card title="My Tasks" description={`${tasks.length} saved task${tasks.length === 1 ? "" : "s"}`}>
          <ul className="dashboard-list">
            {tasks.slice(0, 5).map((task) => <li key={task._id}><span><strong>{task.title}</strong><small>{task.category || "General"}</small></span><strong>{task.completed ? "Completed" : "Active"}</strong></li>)}
            {!tasks.length && <li><span>No saved tasks yet</span></li>}
          </ul>
        </Card>
      </section>

      <section className="profile-settings">
        <div>
          <p className="eyebrow">Workspace settings</p>
          <h2>Stay in control</h2>
          <p>Keep your workspace focused, secure, and ready for the next milestone.</p>
        </div>
        <div className="settings-list">
          <div className="setting-row"><span><strong>Profile visibility</strong><small>Your team can find your profile</small></span><span className="status-pill">Active</span></div>
          <div className="setting-row"><span><strong>Task reminders</strong><small>Stay ahead of upcoming work</small></span><span className="status-pill">On</span></div>
          <div className="setting-row"><span><strong>Account security</strong><small>Your workspace is protected</small></span><span className="status-pill">Secure</span></div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
