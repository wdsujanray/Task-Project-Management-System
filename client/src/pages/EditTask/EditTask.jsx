import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentField from "../../components/common/AttachmentField";
import { getProjects } from "../../services/projectService";
import { getTask, getTasks, updateTask } from "../../services/taskService";
import "../../styles/allWork.css";

const TASK_CATEGORIES = ["Design", "Development", "General", "Planning", "Testing"];
const NEW_CATEGORY = "__new_category__";

const emptyForm = {
  title: "",
  description: "",
  project: "",
  category: "",
  priority: "Medium",
  status: "Active",
  startDate: "",
  completionDate: "",
  attachment: null,
};

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [projects, setProjects] = useState([]);
  const [existingTasks, setExistingTasks] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    Promise.all([getTask(token, taskId), getProjects(token)])
      .then(([task, availableProjects]) => {
        setProjects(availableProjects);
        setForm({
          title: task.title || task.name || "",
          description: task.description || "",
          project: task.project || task.projectId || "",
          category: task.category || "General",
          priority: task.priority || "Medium",
          status: task.completed ? "Completed" : task.status || "Active",
          startDate: task.startDate ? String(task.startDate).slice(0, 10) : "",
          completionDate: task.completionDate || task.dueDate
            ? String(task.completionDate || task.dueDate).slice(0, 10)
            : "",
          attachment: task.attachment || null,
        });
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
    getTasks(token).then(setExistingTasks).catch((requestError) => setError(requestError.message));
  }, [navigate, taskId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (title.length < 3) {
      setError("Task title must be at least 3 characters.");
      return;
    }
    if (form.category === NEW_CATEGORY && !newCategory.trim()) {
      setError("Enter a name for the new category.");
      return;
    }
    if (form.project && !projects.some((project) => project._id === form.project)) {
      setError("Choose an available project.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await updateTask(localStorage.getItem("taskflowToken"), taskId, {
        ...form,
        title,
        description: form.description.trim(),
        project: form.project || null,
        category: form.category === NEW_CATEGORY ? newCategory.trim() : form.category.trim() || "General",
        completed: form.status === "Completed",
      });
      navigate("/tasks", { replace: true, state: { message: "Task updated successfully." } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="work-edit-page"><p role="status">Loading task...</p></div>;
  }

  return (
    <div className="work-edit-page">
      <PageTitle title="Edit Task" subtitle="Update this task's details, status, and schedule." />
      {error && !form.title && <p className="form-error" role="alert">{error}</p>}
      {form.title && (
        <Card title="Task details" description="Update the task, move it to another project, or change its category.">
          <form className="work-edit-form" onSubmit={handleSubmit}>
            <label>Task title<input name="title" value={form.title} onChange={handleChange} minLength="3" maxLength="200" required /></label>
            <label>Description<textarea name="description" rows="5" maxLength="2000" value={form.description} onChange={handleChange} /></label>
            <div className="work-edit-grid">
              <label>Project
                <select name="project" value={form.project} onChange={handleChange}>
                  <option value="">No project (independent task)</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>{project.name || project.title}</option>
                  ))}
                </select>
              </label>
              <label>Category
                <select name="category" value={form.category} onChange={handleChange}>
                  {[...new Set([...TASK_CATEGORIES, ...existingTasks.map((task) => task.category).filter(Boolean), form.category])]
                    .filter((category) => category && category !== NEW_CATEGORY)
                    .sort((a, b) => a.localeCompare(b))
                    .map((category) => <option key={category} value={category}>{category}</option>)}
                  <option value={NEW_CATEGORY}>New Category...</option>
                </select>
                {form.category === NEW_CATEGORY && (
                  <input aria-label="New task category" placeholder="Enter a category name" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} maxLength="100" required />
                )}
              </label>
              <label>Priority
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <label>Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="pending">Pending</option>
                  <option>Active</option>
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Review</option>
                  <option>Completed</option>
                </select>
              </label>
              <label>Start date<input name="startDate" type="date" value={form.startDate} onChange={handleChange} /></label>
              <label>Due date<input name="completionDate" type="date" value={form.completionDate} onChange={handleChange} /></label>
            </div>
            <AttachmentField
              value={form.attachment}
              onChange={(attachment) => setForm((current) => ({ ...current, attachment }))}
              label="Task image or file"
            />
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="work-edit-actions">
              <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button>
              <Link className="btn secondary" to="/tasks">Cancel</Link>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

export default EditTask;
