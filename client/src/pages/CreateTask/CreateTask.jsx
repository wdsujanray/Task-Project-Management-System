import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentField from "../../components/common/AttachmentField";
import { createTask, getProfile, getProjects, getTeams } from "../../services/api";
import { getTasks as getWorkspaceTasks } from "../../services/taskService";
import "./CreateTask.css";

const TASK_CATEGORIES = ["Design", "Development", "General", "Planning", "Testing"];
const NEW_CATEGORY = "__new_category__";

const initialFormState = {
  title: "",
  description: "",
  project: "",
  category: "General",
  priority: "",
  status: "",
  dueDate: "",
  assignedTo: "",
  attachment: null,
};

function validateForm(formState, newCategory) {
  const nextErrors = {};

  if (formState.title.trim().length === 0) {
    nextErrors.title = "Task title is required.";
  } else if (formState.title.trim().length < 3) {
    nextErrors.title = "Task title must be at least 3 characters.";
  }

  if (formState.description.trim().length === 0) {
    nextErrors.description = "Description is required.";
  } else if (formState.description.trim().length < 10) {
    nextErrors.description = "Description must be at least 10 characters.";
  }

  if (formState.category === NEW_CATEGORY && !newCategory.trim()) nextErrors.category = "Enter a name for the new category.";
  if (!formState.priority) nextErrors.priority = "Select a priority.";
  if (!formState.status) nextErrors.status = "Select a status.";
  if (!formState.dueDate) nextErrors.dueDate = "Choose a due date.";
  if (!formState.assignedTo) nextErrors.assignedTo = "Select a team member.";

  return nextErrors;
}

function FieldError({ id, message }) {
  return message ? <p id={id} className="form-field-error" role="alert">{message}</p> : null;
}

function RequiredMark() {
  return <span className="required-mark" aria-hidden="true">*</span>;
}

function CreateTask() {
  const [searchParams] = useSearchParams();
  const [formState, setFormState] = useState(initialFormState);
  const [step, setStep] = useState(1);
  const [isIndependent, setIsIndependent] = useState(false);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [taskCategories, setTaskCategories] = useState(TASK_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [taskLookupError, setTaskLookupError] = useState("");
  const [submittedTask, setSubmittedTask] = useState(null);
  const filteredProjects = projects.filter((project) => {
    const query = projectSearch.trim().toLowerCase();
    return !query || [project.name, project.title, project.category, project.status]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    Promise.all([getProjects(token), getTeams(token), getProfile(token)])
      .then(([savedProjects, teams, user]) => {
        setProjects(savedProjects);
        const teamMembers = teams.flatMap((team) => team.members || []);
        setAssignees([{ name: user.name, email: user.email }, ...teamMembers]);
        const requestedProject = searchParams.get("project");
        const selectedProject = savedProjects.find((project) => project._id === requestedProject);
        if (!savedProjects.length) setIsIndependent(true);
        setFormState((current) => ({
          ...current,
          assignedTo: user.name,
          project: selectedProject?._id || current.project,
        }));
      })
      .catch((error) => setRequestError(error.message))
      .finally(() => setIsLoading(false));
    getWorkspaceTasks(token)
      .then((savedTasks) => setTaskCategories([...new Set([...TASK_CATEGORIES, ...savedTasks.map((task) => task.category).filter(Boolean)])].sort((a, b) => a.localeCompare(b))))
      .catch((error) => setTaskLookupError(`Existing task categories could not be loaded: ${error.message}`));
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({ ...currentState, [name]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
    setSuccessMessage("");
  };

  const handleProjectChange = (event) => {
    setFormState((current) => ({ ...current, project: event.target.value }));
    setIsIndependent(false);
    setErrors((current) => {
      if (!current.project) return current;
      const next = { ...current };
      delete next.project;
      return next;
    });
  };

  const continueToTaskDetails = () => {
    if (!formState.project && !isIndependent) {
      setErrors((current) => ({ ...current, project: "Choose a project or continue without one." }));
      return;
    }
    if (formState.project && !projects.some((project) => project._id === formState.project)) {
      setErrors((current) => ({ ...current, project: "Choose an available project." }));
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(formState, newCategory);
    setErrors(nextErrors);
    setRequestError("");

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage("");
      setSubmittedTask(null);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProject = projects.find((project) => project._id === formState.project);
      if (formState.project && !selectedProject) {
        setErrors((current) => ({ ...current, project: "Choose an available project." }));
        return;
      }
      const category = formState.category === NEW_CATEGORY ? newCategory.trim() : formState.category;
      const createdTask = await createTask(localStorage.getItem("taskflowToken"), {
        title: formState.title.trim(),
        description: formState.description.trim(),
        project: selectedProject?._id || null,
        assignedToName: formState.assignedTo,
        category: category || "General",
        priority: formState.priority,
        status: formState.status,
        dueDate: formState.dueDate,
        completionDate: formState.dueDate,
        attachment: formState.attachment,
      });
      setTaskCategories((current) => [...new Set([...current, category])].sort((a, b) => a.localeCompare(b)));
      setSubmittedTask({ ...formState, category, id: createdTask._id, project: selectedProject?.name || "Independent task" });
      setFormState((current) => ({
        ...initialFormState,
        project: current.project,
        assignedTo: assignees[0]?.name || "",
      }));
      setProjectSearch("");
      setNewCategory("");
      setErrors({});
      setSuccessMessage("Task created and saved to your workspace.");
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormState((current) => ({ ...initialFormState, project: current.project, assignedTo: current.assignedTo }));
    setErrors({});
    setSuccessMessage("");
    setSubmittedTask(null);
    setRequestError("");
    setProjectSearch("");
    setNewCategory("");
  };

  const fieldProps = (fieldName) => ({
    name: fieldName,
    value: formState[fieldName],
    onChange: handleChange,
    "aria-invalid": Boolean(errors[fieldName]),
    "aria-describedby": errors[fieldName] ? `${fieldName}-error` : undefined,
  });

  if (isLoading) {
    return <div className="create-task-page"><p role="status">Loading your projects and team...</p></div>;
  }

  return (
    <div className="create-task-page">
      <PageTitle
        title="Create Task"
        subtitle={step === 1
          ? "Step 1 of 2 · Choose a project or create an independent task."
          : `Step 2 of 2 · Add task details${formState.project ? ` for ${projects.find((project) => project._id === formState.project)?.name || "your selected project"}` : " for an independent task"}.`}
      />

      <div className="create-task-layout">
        {step === 1 ? (
          <Card title="Choose a project" description="Select an existing project, or continue without one to create an independent task.">
            <div className="create-task-form">
              <div className="form-field">
                <label htmlFor="task-project-search">Find a project</label>
                <input
                  id="task-project-search"
                  type="search"
                  value={projectSearch}
                  onChange={(event) => {
                    setProjectSearch(event.target.value);
                    setFormState((current) => ({ ...current, project: "" }));
                    setIsIndependent(false);
                    setErrors((current) => {
                      if (!current.project) return current;
                      const next = { ...current };
                      delete next.project;
                      return next;
                    });
                  }}
                  placeholder="Search project name or category"
                  aria-label="Search projects by name or category"
                  autoComplete="off"
                />
                <select
                  id="task-project"
                  value={formState.project}
                  onChange={handleProjectChange}
                  aria-invalid={Boolean(errors.project)}
                  aria-describedby={errors.project ? "project-error" : undefined}
                >
                  <option value="">Choose an existing project</option>
                  {filteredProjects.map((project) => <option key={project._id} value={project._id}>{project.name || project.title} · {project.category || "General"}</option>)}
                </select>
                {projects.length > 0 && !filteredProjects.length && <p className="required-hint">No projects match that search. <button type="button" className="inline-text-button" onClick={() => setProjectSearch("")}>Show all projects</button></p>}
                {!projects.length && <p className="required-hint">No projects yet. You can create one first or continue with an independent task.</p>}
                {errors.project && <FieldError id="project-error" message={errors.project} />}
              </div>
              <div className={`independent-task-choice ${isIndependent ? "is-selected" : ""}`}>
                <div>
                  <strong>Create independently</strong>
                  <p>This task will not be attached to a project. You can associate it with a project later.</p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  aria-pressed={isIndependent}
                  onClick={() => { setFormState((current) => ({ ...current, project: "" })); setIsIndependent(true); setErrors({}); }}
                >
                  {isIndependent ? "Selected" : "Choose this"}
                </Button>
              </div>
              <div className="create-task-actions">
                <Button type="button" onClick={continueToTaskDetails} disabled={!formState.project && !isIndependent}>
                  Continue to task details
                </Button>
                <Link className="btn secondary" to="/create-project">Create a new project</Link>
              </div>
            </div>
          </Card>
        ) : (
        <Card title="Task details" description="Complete the task information and save it to your workspace.">
          <form className="create-task-form" onSubmit={handleSubmit} noValidate>
            <div className="selected-task-project">
              <span>{formState.project ? "Project" : "Task type"}</span>
              <strong>{formState.project
                ? (projects.find((project) => project._id === formState.project)?.name || projects.find((project) => project._id === formState.project)?.title)
                : "Independent task"}</strong>
              <button type="button" className="inline-text-button" onClick={() => setStep(1)}>Change</button>
            </div>
            <div className="form-field form-field-wide">
              <label htmlFor="task-title">Task Title <RequiredMark /></label>
              <input id="task-title" type="text" placeholder="e.g. Design the login page" {...fieldProps("title")} />
              <FieldError id="title-error" message={errors.title} />
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="task-description">Description <RequiredMark /></label>
              <textarea id="task-description" rows="5" placeholder="Describe the outcome and important details" {...fieldProps("description")} />
              <FieldError id="description-error" message={errors.description} />
            </div>

            <div className="create-task-field-grid">
              <div className="form-field">
                <label htmlFor="task-category">Category</label>
                <select id="task-category" {...fieldProps("category")}>
                  {taskCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                  <option value={NEW_CATEGORY}>New Category...</option>
                </select>
                {formState.category === NEW_CATEGORY && (
                  <input aria-label="New task category" placeholder="Enter a category name" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} maxLength="100" required />
                )}
                <FieldError id="category-error" message={errors.category} />
              </div>

              <div className="form-field">
                <label htmlFor="task-priority">Priority <RequiredMark /></label>
                <select id="task-priority" {...fieldProps("priority")}>
                  <option value="">Choose priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <FieldError id="priority-error" message={errors.priority} />
              </div>

              <div className="form-field">
                <label htmlFor="task-status">Status <RequiredMark /></label>
                <select id="task-status" {...fieldProps("status")}>
                  <option value="">Choose status</option>
                  <option value="Todo">To do</option>
                  <option value="In Progress">In progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
                <FieldError id="status-error" message={errors.status} />
              </div>

              <div className="form-field">
                <label htmlFor="task-due-date">Due Date <RequiredMark /></label>
                <input id="task-due-date" type="date" {...fieldProps("dueDate")} />
                <FieldError id="dueDate-error" message={errors.dueDate} />
              </div>

              <div className="form-field">
                <label htmlFor="task-assigned-to">Assigned To <RequiredMark /></label>
                <select id="task-assigned-to" {...fieldProps("assignedTo")}>
                  <option value="">Choose a team member</option>
                  {assignees.map((assignee, index) => <option key={`${assignee.email}-${index}`} value={assignee.name}>{assignee.name}{index === 0 ? " (you)" : ""}</option>)}
                </select>
                <FieldError id="assignedTo-error" message={errors.assignedTo} />
              </div>
            </div>

            <AttachmentField
              value={formState.attachment}
              onChange={(attachment) => setFormState((current) => ({ ...current, attachment }))}
              label="Task image or file"
            />
            <p className="required-hint"><RequiredMark /> Required fields</p>
            <div className="create-task-actions">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating task..." : "Create Task"}</Button>
              <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
            </div>
          </form>
        </Card>
        )}

        <aside className="create-task-feedback" aria-live="polite">
          {step === 1 && (
            <Card title="Two ways to start" description="Your tasks can belong to a project or remain independent.">
              <ul className="task-setup-options">
                <li><strong>Use a project</strong><span>Choose an existing project and continue with its task.</span></li>
                <li><strong>Start independently</strong><span>Skip project setup now and associate the task later if needed.</span></li>
              </ul>
            </Card>
          )}
          {requestError && <p className="form-error" role="alert">{requestError}</p>}
          {taskLookupError && <p role="status">{taskLookupError}</p>}
          {successMessage && <div className="form-success" role="status">{successMessage}</div>}
          {submittedTask && (
            <Card title="Created task" description={`Saved task ID: ${submittedTask.id}`}>
              <dl className="submitted-task-details">
                <div><dt>Task Title</dt><dd>{submittedTask.title}</dd></div>
                <div><dt>Description</dt><dd>{submittedTask.description}</dd></div>
                <div><dt>Project</dt><dd>{submittedTask.project}</dd></div>
                <div><dt>Category</dt><dd>{submittedTask.category}</dd></div>
                <div><dt>Priority</dt><dd>{submittedTask.priority}</dd></div>
                <div><dt>Status</dt><dd>{submittedTask.status}</dd></div>
                <div><dt>Due Date</dt><dd>{submittedTask.dueDate}</dd></div>
                <div><dt>Assigned To</dt><dd>{submittedTask.assignedTo}</dd></div>
              </dl>
              <Link className="btn primary" to={`/tasks/${submittedTask.id}`}>View task</Link>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

export default CreateTask;
