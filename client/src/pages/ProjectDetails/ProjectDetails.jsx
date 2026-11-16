import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentPreview from "../../components/common/AttachmentPreview";
import { getProject } from "../../services/projectService";
import { getTasks, updateTask } from "../../services/taskService";
import "../../styles/allWork.css";

function statusClass(status) {
  return String(status || "pending").toLowerCase().replace(/\s+/g, "-");
}

function displayLabel(value) {
  return String(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [taskToAssociate, setTaskToAssociate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAssociatingTask, setIsAssociatingTask] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getProject(token, projectId)
      .then(setProject)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
    getTasks(token)
      .then((tasks) => setAvailableTasks(tasks.filter((task) => !task.project && !task.projectId)))
      .catch((requestError) => setError(requestError.message));
  }, [navigate, projectId]);

  const handleAssociateTask = async (event) => {
    event.preventDefault();
    const task = availableTasks.find((item) => item._id === taskToAssociate);
    if (!task) {
      setError("Choose an available task to add to this project.");
      return;
    }

    setIsAssociatingTask(true);
    setError("");
    setSuccessMessage("");
    try {
      const updatedTask = await updateTask(localStorage.getItem("taskflowToken"), task._id, { project: projectId });
      setProject((current) => ({
        ...current,
        tasks: [{
          _id: updatedTask._id,
          title: updatedTask.title,
          category: updatedTask.category,
          status: updatedTask.status,
          priority: updatedTask.priority,
          dueDate: updatedTask.dueDate,
        }, ...(current.tasks || [])],
      }));
      setAvailableTasks((current) => current.filter((item) => item._id !== task._id));
      setTaskToAssociate("");
      setSuccessMessage(`"${task.title}" was added to this project.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsAssociatingTask(false);
    }
  };

  if (isLoading) {
    return <div className="work-edit-page"><p role="status">Loading project...</p></div>;
  }

  return (
    <div className="work-edit-page">
      {project ? (
        <>
          <PageTitle title={project.name || project.title || "Project"} subtitle="Project details" />
          <div className="all-work-actions">
            <Link className="btn primary" to={`/create-task?project=${encodeURIComponent(projectId)}`}>Create task</Link>
            <Link className="btn" to={`/projects/${projectId}/edit`}>Edit project</Link>
            <Link className="btn secondary" to="/projects">All projects</Link>
          </div>
          <Card title="Project details" className="work-detail-card">
            <dl className="all-work-details">
              <div><dt>Status</dt><dd>{project.status || "Planning"}</dd></div>
              <div><dt>Category</dt><dd>{project.category || "General"}</dd></div>
              {project.startDate && <div><dt>Start date</dt><dd>{String(project.startDate).slice(0, 10)}</dd></div>}
              {(project.completionDate || project.endDate) && (
                <div><dt>Due date</dt><dd>{String(project.completionDate || project.endDate).slice(0, 10)}</dd></div>
              )}
            </dl>
            {project.description && <p className="all-work-description">{project.description}</p>}
            {project.attachment && <AttachmentPreview attachment={project.attachment} />}
          </Card>
          <section className="project-tasks-section" aria-labelledby="project-tasks-heading">
            <div className="project-tasks-heading">
              <div>
                <p className="eyebrow">Project work</p>
                <h2 id="project-tasks-heading">Tasks</h2>
                <p>{project.tasks?.length || 0} task{project.tasks?.length === 1 ? "" : "s"} associated with this project</p>
              </div>
              <Link className="btn secondary" to={`/tasks?project=${encodeURIComponent(projectId)}`}>All tasks</Link>
            </div>
            {project.tasks?.length ? (
              <div className="project-task-list">
                {project.tasks.map((task) => (
                  <article className="project-task-item" key={task._id}>
                    <div className="project-task-main">
                      <Link className="project-task-title" to={`/tasks/${task._id}`}>{task.title}</Link>
                      {task.dueDate && <span className="project-task-due">Due {task.dueDate}</span>}
                      {task.attachment && <AttachmentPreview attachment={task.attachment} />}
                    </div>
                    <span className={`project-task-status status-${statusClass(task.status)}`}>
                      {displayLabel(task.status || "pending")}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <Card title="No tasks yet" className="project-tasks-empty">
                <p>Add the first task to start tracking work on this project.</p>
                <Link className="btn primary" to={`/create-task?project=${encodeURIComponent(projectId)}`}>Create the first task</Link>
              </Card>
            )}
            {availableTasks.length > 0 && (
              <div className="project-unassigned-tasks">
                <h3>Unassigned tasks</h3>
                <p>Attach a task you created earlier to this project.</p>
                <form className="project-associate-task" onSubmit={handleAssociateTask}>
                  <label htmlFor="existing-project-task">Choose an existing task</label>
                  <select id="existing-project-task" value={taskToAssociate} onChange={(event) => setTaskToAssociate(event.target.value)}>
                    <option value="">Select an unassigned task</option>
                    {availableTasks.map((task) => (
                      <option key={task._id} value={task._id}>{task.title}</option>
                    ))}
                  </select>
                  <button className="btn secondary" type="submit" disabled={!taskToAssociate || isAssociatingTask}>
                    {isAssociatingTask ? "Adding..." : "Add to project"}
                  </button>
                </form>
              </div>
            )}
            {successMessage && <p className="form-success" role="status">{successMessage}</p>}
          </section>
        </>
      ) : (
        <PageTitle title="Project unavailable" subtitle={error || "This project could not be found."} />
      )}
      {error && project && <p className="form-error" role="alert">{error}</p>}
      {location.state?.message && <p className="form-success" role="status">{location.state.message}</p>}
    </div>
  );
}

export default ProjectDetails;
