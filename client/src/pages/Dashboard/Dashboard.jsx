import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";
import AttachmentPreview from "../../components/common/AttachmentPreview";
import { getProjects, getTasks, seedDemoWorkspace, updateTask } from "../../services/api";
import { getPreferences } from "../../services/preferences";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function InlineNotification({ notification, onDismiss, className = "" }) {
  return (
    <div className={`inline-notification ${className} ${notification.type}`.trim()} role="status">
      <strong>{notification.type === "success" ? "Saved" : "Alert"}</strong>
      <span>{notification.message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>
        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
      </button>
    </div>
  );
}

function SectionNotification({ notification, onDismiss }) {
  return notification ? <InlineNotification className="section-notification" notification={notification} onDismiss={onDismiss} /> : null;
}

function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState(null);
  const [extensionDates, setExtensionDates] = useState({});

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!notification) return undefined;
    const timeoutId = window.setTimeout(() => setNotification(null), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    Promise.all([getProjects(token), getTasks(token)]).then(async ([projectData, taskData]) => {
      if (!projectData.length && !taskData.length) {
        const seedResult = await seedDemoWorkspace(token);
        if (seedResult.created) {
          setNotification({ type: "success", message: "Sample projects and tasks are ready to explore.", target: "dashboard" });
        }
        [projectData, taskData] = await Promise.all([getProjects(token), getTasks(token)]);
      }
      setProjects(projectData);
      setTasks(taskData);
    }).catch((error) => {
      if (localStorage.getItem("taskflowToken") === token) {
        setNotification({ type: "warning", message: error.message, target: "dashboard" });
      }
    });
  }, [navigate]);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const remindersEnabled = getPreferences().taskReminders;
  const reminderLimit = new Date();
  reminderLimit.setDate(reminderLimit.getDate() + 7);
  const upcomingTasks = tasks.filter((task) => {
    if (task.completed || !task.completionDate) return false;
    const deadline = new Date(`${task.completionDate}T00:00:00`);
    return deadline >= new Date(`${today}T00:00:00`) && deadline <= reminderLimit;
  });

  const extendTaskDeadline = async (taskId) => {
    const newDeadline = extensionDates[taskId];
    if (!newDeadline || newDeadline <= today) return;
    const token = localStorage.getItem("taskflowToken");
    try {
      if (!token) throw new Error("Authentication required");
      const updatedTask = await updateTask(token, taskId, { completionDate: newDeadline });
      setTasks((currentTasks) => currentTasks.map((task) => task._id === taskId ? { ...task, ...updatedTask, completionDate: newDeadline } : task));
    } catch (error) {
      setNotification({ type: "warning", message: error.message, target: `task-${taskId}` });
      return;
    }
    setExtensionDates((currentDates) => ({ ...currentDates, [taskId]: "" }));
    setNotification({ type: "success", message: "Task deadline extended successfully.", target: "tasks-section" });
  };

  const isOverdue = (task) => !task.completed && task.completionDate && today > task.completionDate;

  return (
    <div className="dashboard-page">
      <PageTitle title="Dashboard" subtitle="Track project performance, task progress, and team productivity." />
      <div className="dashboard-create-actions">
        <Link className="btn secondary" to="/projects">All projects</Link>
        <Link className="btn secondary" to="/tasks">All tasks</Link>
        <Link className="btn primary" to="/create-project">Create project</Link>
        <Link className="btn secondary" to="/create-task">Create task</Link>
      </div>
      <SectionNotification notification={notification?.target === "dashboard" ? notification : null} onDismiss={() => setNotification(null)} />
      {remindersEnabled && upcomingTasks.length > 0 && (
        <Card title="Upcoming task reminders" description={`${upcomingTasks.length} task${upcomingTasks.length === 1 ? "" : "s"} due in the next 7 days.`}>
          <ul className="dashboard-list">
            {upcomingTasks.map((task) => <li key={task._id}><span><strong>{task.title}</strong><small>Due {task.completionDate}</small></span></li>)}
          </ul>
        </Card>
      )}

      <div className="dashboard-grid">
        <Card title="Total Projects" className="stat-card">
          <p className="metric-value">{projects.length}</p>
        </Card>

        <Card title="Total Tasks" className="stat-card">
          <p className="metric-value">{tasks.length}</p>
        </Card>

        <Card title="Completed Tasks" className="stat-card">
          <p className="metric-value">{completedTasks}</p>
        </Card>

        <Card title="Pending Tasks" className="stat-card">
          <p className="metric-value">{pendingTasks}</p>
        </Card>
      </div>

      <div className="dashboard-sections">
        <Card title="Recent Projects" description="Your latest projects at a glance." className="dashboard-recent-card">
          <ul className="dashboard-list">
            {projects.slice(0, 3).map((project) => (
              <li className={`dashboard-work-item ${project.isNew ? "item-added" : ""}`} key={project._id}>
                <span>
                  <strong>{project.name}</strong>
                  <small>{project.category || "General"}</small>
                  {project.description && <small>{project.description}</small>}
                  {project.startDate && <small>Starts: {project.startDate}</small>}
                  {project.completionDate && <small>Due: {project.completionDate}</small>}
                  {project.attachment && <AttachmentPreview attachment={project.attachment} />}
                </span>
                <div className="item-actions">
                  <Link className="btn" to={`/projects/${project._id}`}>View</Link>
                  <Link className="btn" to={`/projects/${project._id}/edit`}>Edit</Link>
                </div>
              </li>
            ))}
            {!projects.length && <li className="dashboard-work-empty">No projects yet. Create one to get started.</li>}
          </ul>
          <Link className="dashboard-view-all" to="/projects">View all projects <span aria-hidden="true">→</span></Link>
        </Card>

        <Card title="Recent Tasks" description="Keep an eye on your latest tasks and deadlines." className="dashboard-recent-card">
          <ul className="dashboard-list">
            {tasks.slice(0, 3).map((task) => (
              <li className={`dashboard-work-item ${task.isNew ? "item-added" : ""}`} key={task._id}>
                <span>
                  <strong>{task.title}</strong>
                  <small>{task.category || "General"}</small>
                  {task.description && <small>{task.description}</small>}
                  {task.startDate && <small>Starts: {task.startDate}</small>}
                  {task.completionDate && <small>Due: {task.completionDate}</small>}
                  {task.attachment && <AttachmentPreview attachment={task.attachment} />}
                  {isOverdue(task) && <small className="overdue-label">Overdue</small>}
                  {isOverdue(task) && (
                    <span className="deadline-extension">
                      <input type="date" min={today} aria-label={`New deadline for ${task.title}`} value={extensionDates[task._id] || ""} onChange={(event) => setExtensionDates((currentDates) => ({ ...currentDates, [task._id]: event.target.value }))} />
                      <Button onClick={() => extendTaskDeadline(task._id)} disabled={!extensionDates[task._id]}>Extend Deadline</Button>
                    </span>
                  )}
                </span>
                <div className="item-actions">
                  <Link className="btn" to={`/tasks/${task._id}`}>View</Link>
                  <Link className="btn" to={`/tasks/${task._id}/edit`}>Edit</Link>
                </div>
                {notification?.target === `task-${task._id}` && <InlineNotification notification={notification} onDismiss={() => setNotification(null)} />}
              </li>
            ))}
            {!tasks.length && <li className="dashboard-work-empty">No tasks yet. Create one to get started.</li>}
          </ul>
          <Link className="dashboard-view-all" to="/tasks">View all tasks <span aria-hidden="true">→</span></Link>
          <SectionNotification notification={notification?.target === "tasks-section" ? notification : null} onDismiss={() => setNotification(null)} />
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;