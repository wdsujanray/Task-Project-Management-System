import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentField from "../../components/common/AttachmentField";
import { getProject, updateProject } from "../../services/projectService";
import "../../styles/allWork.css";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  status: "Planning",
  startDate: "",
  completionDate: "",
  attachment: null,
};
const NEW_CATEGORY = "__new_category__";
const PROJECT_CATEGORIES = ["Client Project", "E-commerce", "Education", "Internal Tool", "Marketing", "Mobile Application", "Research", "Web Application"];

function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
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

    getProject(token, projectId)
      .then((project) => {
        setForm({
          name: project.name || project.title || "",
          description: project.description || "",
          category: project.category || "General",
          status: project.status || "Planning",
          startDate: project.startDate ? String(project.startDate).slice(0, 10) : "",
          completionDate: project.completionDate ? String(project.completionDate).slice(0, 10) : "",
          attachment: project.attachment || null,
        });
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [navigate, projectId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const category = form.category === NEW_CATEGORY ? newCategory.trim() : form.category.trim();
    if (name.length < 2) {
      setError("Project name must be at least 2 characters.");
      return;
    }
    if (!category) {
      setError("Enter a name for the new project category.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await updateProject(localStorage.getItem("taskflowToken"), projectId, {
        ...form,
        name,
        category,
        description: form.description.trim(),
      });
      navigate("/projects", { replace: true, state: { message: "Project updated successfully." } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="work-edit-page"><p role="status">Loading project...</p></div>;
  }

  return (
    <div className="work-edit-page">
      <PageTitle title="Edit Project" subtitle="Update this project's details and schedule." />
      {error && !form.name && <p className="form-error" role="alert">{error}</p>}
      {form.name && (
        <Card title="Project details">
          <form className="work-edit-form" onSubmit={handleSubmit}>
            <label>Project name<input name="name" value={form.name} onChange={handleChange} minLength="2" maxLength="200" required /></label>
            <label>Description<textarea name="description" rows="5" maxLength="2000" value={form.description} onChange={handleChange} /></label>
            <div className="work-edit-grid">
              <label>Category
                <select name="category" value={form.category} onChange={handleChange}>
                  {[...new Set([...PROJECT_CATEGORIES, form.category].filter(Boolean))]
                    .sort((a, b) => a.localeCompare(b))
                    .map((category) => <option key={category} value={category}>{category}</option>)}
                  <option value={NEW_CATEGORY}>New Category...</option>
                </select>
                {form.category === NEW_CATEGORY && (
                  <input aria-label="New project category" placeholder="Enter a category name" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} maxLength="100" required />
                )}
              </label>
              <label>Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Planning</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </label>
              <label>Start date<input name="startDate" type="date" value={form.startDate} onChange={handleChange} /></label>
              <label>Due date<input name="completionDate" type="date" value={form.completionDate} onChange={handleChange} /></label>
            </div>
            <AttachmentField
              value={form.attachment}
              onChange={(attachment) => setForm((current) => ({ ...current, attachment }))}
              label="Project image or file"
            />
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="work-edit-actions">
              <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button>
              <Link className="btn secondary" to="/projects">Cancel</Link>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

export default EditProject;
