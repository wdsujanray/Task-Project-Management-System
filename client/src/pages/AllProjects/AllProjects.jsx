import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentPreview from "../../components/common/AttachmentPreview";
import { deleteProject, getProjects } from "../../services/projectService";
import "../../styles/allWork.css";

function projectStatus(project) {
  const status = typeof project.status === "string" ? project.status.trim() : "";
  const knownStatuses = {
    planning: "Planning",
    active: "Active",
    completed: "Completed",
  };
  return knownStatuses[status.toLowerCase()] || status || "Planning";
}

function AllProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");
  const [deletingProjectId, setDeletingProjectId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getProjects(token)
      .then(setProjects)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const handleDelete = async (project) => {
    const projectName = project.name || project.title || "this project";
    if (!window.confirm(`Move "${projectName}" and its tasks to the Recycle Bin?`)) return;

    setDeletingProjectId(project._id);
    setError("");
    setSuccessMessage("");
    try {
      await deleteProject(localStorage.getItem("taskflowToken"), project._id);
      setProjects((current) => current.filter((item) => item._id !== project._id));
      setSuccessMessage(`${projectName} and its tasks moved to Recycle Bin.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingProjectId("");
    }
  };

  const categories = useMemo(
    () => [...new Set(projects.map((project) => project.category || "General"))].sort((a, b) => a.localeCompare(b)),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) =>
      (statusFilter === "All" || projectStatus(project) === statusFilter)
      && (categoryFilter === "All" || (project.category || "General") === categoryFilter)
      && (!query || [
        project._id,
        project.name,
        project.title,
        project.description,
        project.category,
        project.status,
        project.startDate,
        project.completionDate,
        project.attachment,
      ].some((value) => String(value || "").toLowerCase().includes(query))),
    );
  }, [projects, search, statusFilter, categoryFilter]);

  return (
    <div className="all-work-page">
      <PageTitle title="All Projects" subtitle={`Browse and search all ${projects.length} projects in your workspace.`} />
      <div className="all-work-actions">
        <Link className="btn primary" to="/create-project">Create project</Link>
        <Link className="btn secondary" to="/dashboard">Back to dashboard</Link>
      </div>

      <div className="all-work-filters">
        <label className="all-work-search">
          <span>Search projects</span>
          <input type="search" aria-label="Search all project details" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, description, category, status, or date..." />
        </label>
        <label className="all-work-status-filter">
          <span>Project status</span>
          <select aria-label="Filter projects by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All</option>
            <option>Planning</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </label>
        <label className="all-work-status-filter">
          <span>Category</span>
          <select aria-label="Filter projects by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option>All</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        {(search || statusFilter !== "All" || categoryFilter !== "All") && (
          <button type="button" className="all-work-clear" onClick={() => { setSearch(""); setStatusFilter("All"); setCategoryFilter("All"); }}>
            Clear filters
          </button>
        )}
      </div>

      {isLoading && <p role="status">Loading projects...</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {successMessage && <p className="form-success" role="status">{successMessage}</p>}
      {!isLoading && !error && <p className="all-work-result-count" role="status">Showing {filteredProjects.length} of {projects.length} projects</p>}
      {!isLoading && !error && !filteredProjects.length && (
        <Card title={projects.length ? "No matching projects" : "No projects yet"}>
          <p>{projects.length ? "Try different search terms or clear the filters." : "Create a project to get started."}</p>
        </Card>
      )}
      {!isLoading && !error && filteredProjects.length > 0 && (
        <div className="all-work-list">
          {filteredProjects.map((project) => (
            <Card key={project._id} title={project.name || project.title || "Untitled project"} className="all-work-card">
              <dl className="all-work-details">
                <div><dt>Status</dt><dd>{projectStatus(project)}</dd></div>
                <div><dt>Category</dt><dd>{project.category || "General"}</dd></div>
                {project.startDate && <div><dt>Start date</dt><dd>{String(project.startDate).slice(0, 10)}</dd></div>}
                {project.completionDate && <div><dt>Due date</dt><dd>{String(project.completionDate).slice(0, 10)}</dd></div>}
              </dl>
              {project.description && <p className="all-work-description">{project.description}</p>}
              {project.attachment && <AttachmentPreview attachment={project.attachment} />}
              <div className="all-work-card-actions">
                <Link className="btn" to={`/projects/${project._id}`}>View project</Link>
                <Link className="btn" to={`/projects/${project._id}/edit`}>Edit project</Link>
                <button
                  type="button"
                  className="btn all-work-delete"
                  onClick={() => handleDelete(project)}
                  disabled={deletingProjectId === project._id}
                >
                  {deletingProjectId === project._id ? "Deleting..." : "Delete project"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProjects;
