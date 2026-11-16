import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentPreview from "../../components/common/AttachmentPreview";
import { deleteTask, getProjects, getTasks } from "../../services/api";
import { getProject } from "../../services/projectService";
import "../../styles/allWork.css";

function dateInputValue(value) {
  return value ? String(value).slice(0, 10) : "";
}

function taskStatus(task) {
  const status = typeof task.status === "string" ? task.status.trim() : "";
  if (task.completed || status.toLowerCase() === "completed") return "Completed";
  const knownStatuses = {
    pending: "Pending",
    active: "Active",
    todo: "Todo",
    "in progress": "In Progress",
    review: "Review",
  };
  return knownStatuses[status.toLowerCase()] || status || "Active";
}

function taskStatusLabel(status) {
  return status === "Todo" ? "To do" : status;
}

function AllTasks() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");
  const [deletingTaskId, setDeletingTaskId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setIsLoading(true);
    setError("");
    Promise.all([
      getTasks(token, projectId),
      projectId ? getProject(token, projectId) : getProjects(token),
    ])
      .then(([savedTasks, projectData]) => {
        setTasks(savedTasks);
        setProjects(projectId ? [projectData] : projectData);
        setSelectedProject(projectId ? projectData : null);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [navigate, projectId]);

  const handleDelete = async (task) => {
    if (!window.confirm(`Move "${task.title || task.name || "this task"}" to the Recycle Bin?`)) return;
    setDeletingTaskId(task._id);
    setError("");
    setSuccessMessage("");
    try {
      await deleteTask(localStorage.getItem("taskflowToken"), task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      setSuccessMessage(`${task.title || "Task"} moved to Recycle Bin.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingTaskId("");
    }
  };

  const projectNames = useMemo(
    () => new Map(projects.map((project) => [String(project._id), project.name || project.title])),
    [projects],
  );

  const categories = useMemo(
    () => [...new Set(tasks.map((task) => task.category || "General"))].sort((a, b) => a.localeCompare(b)),
    [tasks],
  );
  const priorities = useMemo(
    () => [...new Set(tasks.map((task) => task.priority || "Medium"))].sort((a, b) => a.localeCompare(b)),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const projectName = task.projectName || projectNames.get(String(task.projectId)) || "";
      const currentStatus = taskStatus(task);
      const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
      const matchesCategory = categoryFilter === "All" || (task.category || "General") === categoryFilter;
      const matchesPriority = priorityFilter === "All" || (task.priority || "Medium") === priorityFilter;
      const matchesSearch = !query
        || [
          task._id,
          task.title,
          task.name,
          task.description,
          task.category,
          task.priority,
          currentStatus,
          task.assignedToName,
          task.startDate,
          task.completionDate,
          task.dueDate,
          task.attachment,
          projectName,
        ]
          .some((value) => String(value || "").toLowerCase().includes(query));
      return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
    });
  }, [tasks, search, statusFilter, categoryFilter, priorityFilter, projectNames]);

  return (
    <div className="all-work-page">
      <PageTitle
        title={selectedProject ? `${selectedProject.name || selectedProject.title} tasks` : "All Tasks"}
        subtitle={selectedProject
          ? `Browse and manage all ${tasks.length} tasks created under this project.`
          : `Browse and search all ${tasks.length} tasks in your workspace.`}
      />
      <div className="all-work-actions">
        <Link className="btn primary" to={projectId ? `/create-task?project=${encodeURIComponent(projectId)}` : "/create-task"}>Create task</Link>
        <Link className="btn secondary" to={projectId ? `/projects/${encodeURIComponent(projectId)}` : "/dashboard"}>
          {projectId ? "Back to project" : "Back to dashboard"}
        </Link>
      </div>

      <div className="all-work-filters">
        <label className="all-work-search">
          <span>Search tasks</span>
          <input type="search" aria-label="Search all task details" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, description, project, status, date, assignee..." />
        </label>
        <label className="all-work-status-filter">
          <span>Task status</span>
          <select aria-label="Filter tasks by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Active</option>
            <option value="Todo">To do</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Completed</option>
          </select>
        </label>
        <label className="all-work-status-filter">
          <span>Category</span>
          <select aria-label="Filter tasks by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option>All</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="all-work-status-filter">
          <span>Priority</span>
          <select aria-label="Filter tasks by priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option>All</option>
            {priorities.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </label>
        {(search || statusFilter !== "All" || categoryFilter !== "All" || priorityFilter !== "All") && (
          <button type="button" className="all-work-clear" onClick={() => { setSearch(""); setStatusFilter("All"); setCategoryFilter("All"); setPriorityFilter("All"); }}>
            Clear filters
          </button>
        )}
      </div>

      {isLoading && <p role="status">Loading tasks...</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {location.state?.message && <p className="form-success" role="status">{location.state.message}</p>}
      {successMessage && !location.state?.message && <p className="form-success" role="status">{successMessage}</p>}
      {!isLoading && !error && <p className="all-work-result-count" role="status">Showing {filteredTasks.length} of {tasks.length} tasks</p>}
      {!isLoading && !error && !filteredTasks.length && (
        <Card title={tasks.length ? "No matching tasks" : "No tasks yet"}>
          <p>{tasks.length ? "Try different search terms or clear the filters." : "Create a task to get started."}</p>
        </Card>
      )}
      {!isLoading && !error && filteredTasks.length > 0 && (
        <div className="all-work-list">
          {filteredTasks.map((task) => {
            const projectName = task.projectName || projectNames.get(String(task.projectId));
            return (
              <Card key={task._id} title={task.title || task.name || "Untitled task"} className="all-work-card">
                <dl className="all-work-details">
                  <div><dt>Status</dt><dd>{taskStatusLabel(taskStatus(task))}</dd></div>
                  <div><dt>Project</dt><dd>{projectName || "Independent task"}</dd></div>
                  {task.category && <div><dt>Category</dt><dd>{task.category}</dd></div>}
                  {task.priority && <div><dt>Priority</dt><dd>{task.priority}</dd></div>}
                  {task.startDate && <div><dt>Start date</dt><dd>{dateInputValue(task.startDate)}</dd></div>}
                  {task.completionDate && <div><dt>Due date</dt><dd>{dateInputValue(task.completionDate)}</dd></div>}
                  {task.assignedToName && <div><dt>Assigned to</dt><dd>{task.assignedToName}</dd></div>}
                </dl>
                {task.description && <p className="all-work-description">{task.description}</p>}
                {task.attachment && <AttachmentPreview attachment={task.attachment} />}
                <div className="all-work-card-actions">
                  <Link className="btn" to={`/tasks/${task._id}`}>View task</Link>
                  <Link className="btn" to={`/tasks/${task._id}/edit`}>Edit task</Link>
                  <Button variant="secondary" onClick={() => handleDelete(task)} disabled={deletingTaskId === task._id}>
                    {deletingTaskId === task._id ? "Moving..." : "Move to Recycle Bin"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllTasks;
