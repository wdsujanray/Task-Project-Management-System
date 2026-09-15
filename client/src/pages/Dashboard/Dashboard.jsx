import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";
import { createProject, createTask, deleteProject, deleteTask, getProjects, getTasks, updateProject, updateTask } from "../../services/api";

function InlineNotification({ notification, onDismiss, className = "" }) {
  return (
    <div className={`inline-notification ${className} ${notification.type}`.trim()} role="status">
      <strong>{notification.type === "success" ? "Saved" : "Alert"}</strong>
      <span>{notification.message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>
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
  const [taskCount, setTaskCount] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("Development");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStartDate, setTaskStartDate] = useState("");
  const [taskCompletionDate, setTaskCompletionDate] = useState("");
  const [taskAttachment, setTaskAttachment] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("Web Application");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectCompletionDate, setProjectCompletionDate] = useState("");
  const [projectAttachment, setProjectAttachment] = useState("");
  const [notification, setNotification] = useState(null);
  const [extensionDates, setExtensionDates] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

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
    Promise.all([getProjects(token), getTasks(token)]).then(([projectData, taskData]) => {
      setProjects(projectData);
      setTasks(taskData);
    }).catch((error) => {
      if (localStorage.getItem("taskflowToken") === token) {
        setNotification({ type: "warning", message: error.message, target: "dashboard" });
      }
    });
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const handleAddTask = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    const name = (taskName || event.currentTarget.elements.namedItem("taskName")?.value || "").trim();
    if (!name) return;

    try {
      const newTask = await createTask(token, { title: name, name, description: taskDescription.trim(), category: taskCategory, startDate: taskStartDate, completionDate: taskCompletionDate, attachment: taskAttachment });
      setTasks((currentTasks) => [{ ...newTask, isNew: true }, ...currentTasks]);
      setTaskName("");
      setTaskCategory("Development");
      setTaskDescription("");
      setTaskStartDate("");
      setTaskCompletionDate("");
      setTaskAttachment("");
      setTaskCount((count) => count + 1);
      setNotification({ type: "success", message: `Welcome! ${name} was saved successfully.`, target: "task-form" });
    } catch (error) {
      if (error.message === "Authentication required" || error.message === "Invalid authentication token") {
        localStorage.removeItem("taskflowToken");
        localStorage.removeItem("taskflowSession");
        navigate("/login", { replace: true });
        return;
      }
      setNotification({ type: "warning", message: error.message, target: "task-form" });
    }
  };

  const handleAddProject = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    const name = (projectName || event.currentTarget.elements.namedItem("projectName")?.value || "").trim();
    if (!name) return;

    try {
      const newProject = await createProject(token, { name, title: name, description: projectDescription.trim(), category: projectCategory, startDate: projectStartDate, completionDate: projectCompletionDate, attachment: projectAttachment });
      setProjects((currentProjects) => [{ ...newProject, isNew: true }, ...currentProjects]);
      setProjectName("");
      setProjectCategory("Web Application");
      setProjectDescription("");
      setProjectStartDate("");
      setProjectCompletionDate("");
      setProjectAttachment("");
      setNotification({ type: "success", message: `Welcome! ${name} was saved successfully.`, target: "project-form" });
    } catch (error) {
      if (error.message === "Authentication required" || error.message === "Invalid authentication token") {
        localStorage.removeItem("taskflowToken");
        localStorage.removeItem("taskflowSession");
        navigate("/login", { replace: true });
        return;
      }
      setNotification({ type: "warning", message: error.message, target: "project-form" });
    }
  };

  const updateTaskStatus = (taskId, status) => {
    const task = tasks.find((item) => item._id === taskId);
    const completed = status === "Completed";
    setTasks((currentTasks) => currentTasks.map((item) => item._id === taskId ? { ...item, completed } : item));
    const token = localStorage.getItem("taskflowToken");
    if (token && !String(taskId).startsWith("local-")) updateTask(token, taskId, { completed }).catch(() => null);
    if (completed && task?.completionDate && today <= task.completionDate) {
      setNotification({ type: "success", message: `${task.title} completed on time. Great work!`, target: "tasks-section" });
    } else if (!completed && task?.completionDate && today > task.completionDate) {
      setNotification({ type: "warning", message: `${task.title} is overdue. Extend its deadline to keep the work moving.`, target: "tasks-section" });
    } else {
      setNotification({ type: "success", message: `${task?.title || "Task"} status updated to ${status}.`, target: "tasks-section" });
    }
  };

  const updateProjectStatus = (projectId, status) => {
    setProjects((currentProjects) => currentProjects.map((project) => project._id === projectId ? { ...project, status } : project));
    const token = localStorage.getItem("taskflowToken");
    if (token && !String(projectId).startsWith("local-")) updateProject(token, projectId, { status }).catch(() => null);
    const project = projects.find((item) => item._id === projectId);
    setNotification({ type: "success", message: `${project?.name || "Project"} status updated to ${status}.`, target: `project-${projectId}` });
  };

  const saveTaskEdit = async (taskId) => {
    const token = localStorage.getItem("taskflowToken");
    if (!token || !editingTask?.title.trim()) return;
    const updates = { title: editingTask.title.trim(), description: editingTask.description, category: editingTask.category, startDate: editingTask.startDate, completionDate: editingTask.completionDate };
    try {
      const updatedTask = await updateTask(token, taskId, updates);
      setTasks((currentTasks) => currentTasks.map((task) => task._id === taskId ? { ...task, ...updatedTask } : task));
      setEditingTask(null);
      setNotification({ type: "success", message: "Task updated successfully.", target: "tasks-section" });
    } catch (error) {
      setNotification({ type: "warning", message: error.message, target: "tasks-section" });
    }
  };

  const saveProjectEdit = async (projectId) => {
    const token = localStorage.getItem("taskflowToken");
    if (!token || !editingProject?.name.trim()) return;
    const updates = { name: editingProject.name.trim(), description: editingProject.description, category: editingProject.category, startDate: editingProject.startDate, completionDate: editingProject.completionDate };
    try {
      const updatedProject = await updateProject(token, projectId, updates);
      setProjects((currentProjects) => currentProjects.map((project) => project._id === projectId ? { ...project, ...updatedProject } : project));
      setEditingProject(null);
      setNotification({ type: "success", message: "Project updated successfully.", target: "projects-section" });
    } catch (error) {
      setNotification({ type: "warning", message: error.message, target: "projects-section" });
    }
  };

  const removeTask = async (taskId) => {
    const token = localStorage.getItem("taskflowToken");
    if (!token || !window.confirm("Delete this task?")) return;
    try {
      await deleteTask(token, taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
      setNotification({ type: "success", message: "Task deleted successfully.", target: "tasks-section" });
    } catch (error) {
      setNotification({ type: "warning", message: error.message, target: "tasks-section" });
    }
  };

  const removeProject = async (projectId) => {
    const token = localStorage.getItem("taskflowToken");
    if (!token || !window.confirm("Delete this project and its tasks?")) return;
    try {
      await deleteProject(token, projectId);
      setProjects((currentProjects) => currentProjects.filter((project) => project._id !== projectId));
      setNotification({ type: "success", message: "Project deleted successfully.", target: "projects-section" });
    } catch (error) {
      setNotification({ type: "warning", message: error.message, target: "projects-section" });
    }
  };

  const extendTaskDeadline = (taskId) => {
    const newDeadline = extensionDates[taskId];
    if (!newDeadline || newDeadline <= today) return;
    setTasks((currentTasks) => currentTasks.map((task) => task._id === taskId ? { ...task, completionDate: newDeadline } : task));
    const token = localStorage.getItem("taskflowToken");
    if (token && !String(taskId).startsWith("local-")) updateTask(token, taskId, { completionDate: newDeadline }).catch(() => null);
    setExtensionDates((currentDates) => ({ ...currentDates, [taskId]: "" }));
    setNotification({ type: "success", message: "Task deadline extended successfully.", target: "tasks-section" });
  };

  const isOverdue = (task) => !task.completed && task.completionDate && today > task.completionDate;

  return (
    <div className="dashboard-page">
      <PageTitle title="Dashboard" subtitle="Track project performance, task progress, and team productivity." />

      <Card title="Task Counter" description="Practice managing a task count with React state." className="task-interaction-card">
        <div className="task-counter" aria-live="polite">
          <strong>{taskCount}</strong>
          <div className="task-counter-actions">
            <Button onClick={() => setTaskCount((count) => count + 1)}>+ Add Task</Button>
            <Button onClick={() => setTaskCount((count) => Math.max(0, count - 1))}>- Remove Task</Button>
            <Button variant="secondary" onClick={() => setTaskCount(0)}>Reset</Button>
          </div>
        </div>
        <form className="work-form" onSubmit={handleAddTask}>
          <label className="task-name-field" htmlFor="dashboard-task-name">Task Name</label>
          <div className="work-form-row">
            <input
              id="dashboard-task-name"
              name="taskName"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="Enter a task name"
            />
            <select aria-label="Task Category" value={taskCategory} onChange={(event) => setTaskCategory(event.target.value)}>
              <option>Development</option>
              <option>Design</option>
              <option>Testing</option>
              <option>Documentation</option>
              <option>Bug Fix</option>
              <option>Planning</option>
              <option>Research</option>
              <option>Maintenance</option>
            </select>
          </div>
          <p className="task-name-preview">Task Name: {taskName || "(none)"}</p>
          <p className="task-status" role="status">
            {taskName.trim() ? "Task ready to create" : "Enter a task name"}
          </p>
          <label className="task-name-field" htmlFor="dashboard-task-description">Description</label>
          <textarea id="dashboard-task-description" value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} placeholder="Describe this task" rows="3" />
          <div className="date-fields">
            <label htmlFor="dashboard-task-start-date">Start Date<input id="dashboard-task-start-date" type="date" value={taskStartDate} onChange={(event) => setTaskStartDate(event.target.value)} /></label>
            <label htmlFor="dashboard-task-completion-date">Completion Date<input id="dashboard-task-completion-date" type="date" value={taskCompletionDate} onChange={(event) => setTaskCompletionDate(event.target.value)} /></label>
          </div>
          <label className="task-name-field" htmlFor="dashboard-task-attachment">Image or File</label>
          <input id="dashboard-task-attachment" type="file" accept="image/*,.pdf,.doc,.docx,.txt" onChange={(event) => setTaskAttachment(event.target.files[0]?.name || "")} />
          <Button type="submit" disabled={!taskName.trim()}>Save Task</Button>
          {notification?.target === "task-form" && <InlineNotification notification={notification} onDismiss={() => setNotification(null)} />}
        </form>

        <form className="work-form" onSubmit={handleAddProject}>
          <label className="task-name-field" htmlFor="dashboard-project-name">Project Name</label>
          <div className="work-form-row">
            <input
              id="dashboard-project-name"
              name="projectName"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="Enter a project name"
            />
            <select aria-label="Project Category" value={projectCategory} onChange={(event) => setProjectCategory(event.target.value)}>
              <option>Web Application</option>
              <option>Mobile Application</option>
              <option>Research</option>
              <option>Internal Tool</option>
              <option>E-commerce</option>
              <option>Education</option>
              <option>Marketing</option>
              <option>Client Project</option>
            </select>
          </div>
          <label className="task-name-field" htmlFor="dashboard-project-description">Description</label>
          <textarea id="dashboard-project-description" value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} placeholder="Describe this project" rows="3" />
          <div className="date-fields">
            <label htmlFor="dashboard-project-start-date">Start Date<input id="dashboard-project-start-date" type="date" value={projectStartDate} onChange={(event) => setProjectStartDate(event.target.value)} /></label>
            <label htmlFor="dashboard-project-completion-date">Completion Date<input id="dashboard-project-completion-date" type="date" value={projectCompletionDate} onChange={(event) => setProjectCompletionDate(event.target.value)} /></label>
          </div>
          <label className="task-name-field" htmlFor="dashboard-project-attachment">Image or File</label>
          <input id="dashboard-project-attachment" type="file" accept="image/*,.pdf,.doc,.docx,.txt" onChange={(event) => setProjectAttachment(event.target.files[0]?.name || "")} />
          <Button type="submit" disabled={!projectName.trim()}>Save Project</Button>
          {notification?.target === "project-form" && <InlineNotification notification={notification} onDismiss={() => setNotification(null)} />}
        </form>
      </Card>

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
        <Card title="Recent Projects">
          <ul className="dashboard-list">
            {projects.slice(0, 3).map((project) => <li className={project.isNew ? "item-added" : ""} key={project._id}>{editingProject?.id === project._id ? <div className="edit-fields"><input aria-label="Edit project name" value={editingProject.name} onChange={(event) => setEditingProject({ ...editingProject, name: event.target.value })} /><textarea aria-label="Edit project description" value={editingProject.description || ""} onChange={(event) => setEditingProject({ ...editingProject, description: event.target.value })} /><div className="edit-actions"><Button onClick={() => saveProjectEdit(project._id)}>Save</Button><Button variant="secondary" onClick={() => setEditingProject(null)}>Cancel</Button></div></div> : <><span><strong>{project.name}</strong><small>{project.category || "General"}</small>{project.description && <small>{project.description}</small>}{project.startDate && <small>Starts: {project.startDate}</small>}{project.completionDate && <small>Due: {project.completionDate}</small>}{project.attachment && <small>File: {project.attachment}</small>}</span><div className="item-actions"><select aria-label={`${project.name} status`} value={project.status || "Planning"} onChange={(event) => updateProjectStatus(project._id, event.target.value)}><option>Planning</option><option>Active</option><option>Completed</option></select><Button onClick={() => setEditingProject({ id: project._id, name: project.name, description: project.description || "" })}>Edit</Button><Button variant="secondary" onClick={() => removeProject(project._id)}>Delete</Button></div></>}{notification?.target === `project-${project._id}` && <InlineNotification notification={notification} onDismiss={() => setNotification(null)} />}</li>)}
            {!projects.length && <li><span>No projects yet</span><strong>Start one</strong></li>}
          </ul>
          <SectionNotification notification={notification?.target === "projects-section" ? notification : null} onDismiss={() => setNotification(null)} />
        </Card>

        <Card title="Recent Tasks">
          <ul className="dashboard-list">
            {tasks.slice(0, 3).map((task) => <li className={task.isNew ? "item-added" : ""} key={task._id}>{editingTask?.id === task._id ? <div className="edit-fields"><input aria-label="Edit task name" value={editingTask.title} onChange={(event) => setEditingTask({ ...editingTask, title: event.target.value })} /><textarea aria-label="Edit task description" value={editingTask.description || ""} onChange={(event) => setEditingTask({ ...editingTask, description: event.target.value })} /><div className="edit-actions"><Button onClick={() => saveTaskEdit(task._id)}>Save</Button><Button variant="secondary" onClick={() => setEditingTask(null)}>Cancel</Button></div></div> : <><span><strong>{task.title}</strong><small>{task.category || "General"}</small>{task.description && <small>{task.description}</small>}{task.startDate && <small>Starts: {task.startDate}</small>}{task.completionDate && <small>Due: {task.completionDate}</small>}{task.attachment && <small>File: {task.attachment}</small>}{isOverdue(task) && <small className="overdue-label">Overdue</small>}{isOverdue(task) && <span className="deadline-extension"><input type="date" min={today} aria-label={`New deadline for ${task.title}`} value={extensionDates[task._id] || ""} onChange={(event) => setExtensionDates((currentDates) => ({ ...currentDates, [task._id]: event.target.value }))} /><Button onClick={() => extendTaskDeadline(task._id)} disabled={!extensionDates[task._id]}>Extend Deadline</Button></span>}</span><div className="item-actions"><select aria-label={`${task.title} status`} value={task.completed ? "Completed" : "Active"} onChange={(event) => updateTaskStatus(task._id, event.target.value)}><option>Active</option><option>Completed</option></select><Button onClick={() => setEditingTask({ id: task._id, title: task.title, description: task.description || "" })}>Edit</Button><Button variant="secondary" onClick={() => removeTask(task._id)}>Delete</Button></div></>}{notification?.target === `task-${task._id}` && <InlineNotification notification={notification} onDismiss={() => setNotification(null)} />}</li>)}
            {!tasks.length && <li><span>No tasks yet</span><strong>Start one</strong></li>}
          </ul>
          <SectionNotification notification={notification?.target === "tasks-section" ? notification : null} onDismiss={() => setNotification(null)} />
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;