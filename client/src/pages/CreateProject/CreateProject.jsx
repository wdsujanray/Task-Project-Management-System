import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentField from "../../components/common/AttachmentField";
import { createProject, getProjects } from "../../services/projectService";
import { createTask, getTasks, updateTask } from "../../services/taskService";
import "./CreateProject.css";

const PROJECT_CATEGORIES = ["Client Project", "E-commerce", "Education", "Internal Tool", "Marketing", "Mobile Application", "Research", "Web Application"];
const TASK_CATEGORIES = ["Design", "Development", "General", "Planning", "Testing"];
const NEW_CATEGORY = "__new_category__";

const initialTaskState = {
  title: "",
  description: "",
  category: "General",
  status: "pending",
  priority: "medium",
  dueDate: "",
  attachment: null,
};

const initialFormState = {
  name: "",
  category: "Web Application",
  description: "",
  startDate: "",
  completionDate: "",
  attachment: null,
};

function CreateProject() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(initialFormState);
  const [taskForm, setTaskForm] = useState(initialTaskState);
  const [createdProject, setCreatedProject] = useState(null);
  const [tasksCreated, setTasksCreated] = useState(0);
  const [existingTasks, setExistingTasks] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [taskToAssociate, setTaskToAssociate] = useState("");
  const [requestError, setRequestError] = useState("");
  const [taskLookupError, setTaskLookupError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isAssociatingTask, setIsAssociatingTask] = useState(false);
  const [existingProjects, setExistingProjects] = useState([]);
  const [projectLookupError, setProjectLookupError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    getProjects(token)
      .then(setExistingProjects)
      .catch((error) => setProjectLookupError(`Existing projects could not be checked: ${error.message}`));
    getTasks(token)
      .then(setExistingTasks)
      .catch((error) => setTaskLookupError(`Existing task categories could not be loaded: ${error.message}`));
  }, []);

  const projectCategories = useMemo(
    () => [...new Set([...PROJECT_CATEGORIES, ...existingProjects.map((project) => project.category).filter(Boolean)])].sort((a, b) => a.localeCompare(b)),
    [existingProjects],
  );
  const taskCategories = useMemo(
    () => [...new Set([...TASK_CATEGORIES, ...existingTasks.map((task) => task.category).filter(Boolean)])].sort((a, b) => a.localeCompare(b)),
    [existingTasks],
  );

  const matchingProjects = useMemo(() => {
    const query = formState.name.trim().toLowerCase();
    if (!query) return [];
    return existingProjects.filter((project) =>
      [project.name, project.title, project.category, project.description]
        .some((value) => String(value || "").toLowerCase().includes(query)),
    ).slice(0, 5);
  }, [existingProjects, formState.name]);

  const exactNameMatch = existingProjects.find((project) =>
    (project.name || project.title || "").trim().toLowerCase() === formState.name.trim().toLowerCase(),
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
    setRequestError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = formState.name.trim();
    const category = formState.category === NEW_CATEGORY ? newCategory.trim() : formState.category;
    if (name.length < 2) {
      setRequestError("Project name must be at least 2 characters.");
      return;
    }
    if (!category) {
      setRequestError("Enter a name for the new project category.");
      return;
    }

    setIsSubmitting(true);
    setRequestError("");
    setSuccessMessage("");
    try {
      const createdProject = await createProject(localStorage.getItem("taskflowToken"), {
        ...formState,
        category,
        name,
        title: name,
        description: formState.description.trim(),
      });
      setExistingProjects((current) => [createdProject, ...current]);
      setCreatedProject(createdProject);
      setSuccessMessage(`${name} is ready. Add tasks now or finish setup and add them later.`);
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((current) => ({ ...current, [name]: value }));
    setTaskError("");
    setSuccessMessage("");
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    const title = taskForm.title.trim();
    if (!title) {
      setTaskError("Task title is required.");
      return;
    }

    const category = taskForm.category === NEW_CATEGORY ? newTaskCategory.trim() : taskForm.category;
    if (!category) {
      setTaskError("Enter a name for the new task category.");
      return;
    }

    setIsCreatingTask(true);
    setTaskError("");
    setSuccessMessage("");
    try {
      const savedTask = await createTask(localStorage.getItem("taskflowToken"), {
        ...taskForm,
        title,
        category,
        project: createdProject._id,
      });
      setExistingTasks((current) => [{ ...savedTask, project: createdProject._id, projectName: createdProject.name }, ...current]);
      setTasksCreated((count) => count + 1);
      setTaskForm(initialTaskState);
      setSuccessMessage("Task added to the project. Add another or finish setup.");
    } catch (error) {
      setTaskError(error.message);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const finishSetup = () => {
    navigate(`/projects/${createdProject._id}`, {
      replace: true,
      state: {
        message: tasksCreated
          ? `${tasksCreated} task${tasksCreated === 1 ? "" : "s"} added to the project.`
          : "Project created. You can add tasks here at any time.",
      },
    });
  };

  const handleAssociateTask = async () => {
    const task = existingTasks.find((item) => item._id === taskToAssociate);
    if (!task || !createdProject) {
      setTaskError("Choose an existing task to add to this project.");
      return;
    }

    setIsAssociatingTask(true);
    setTaskError("");
    setSuccessMessage("");
    try {
      const updatedTask = await updateTask(localStorage.getItem("taskflowToken"), task._id, { project: createdProject._id });
      setExistingTasks((current) => current.filter((item) => item._id !== task._id));
      setExistingTasks((current) => [{ ...updatedTask, projectName: createdProject.name }, ...current]);
      setTaskToAssociate("");
      setTasksCreated((count) => count + 1);
      setSuccessMessage(`"${task.title}" was added to the project. Add another task or finish setup.`);
    } catch (error) {
      setTaskError(error.message);
    } finally {
      setIsAssociatingTask(false);
    }
  };

  return (
    <div className="create-project-page">
      <PageTitle
        title={createdProject ? "Add project tasks" : "Create Project"}
        subtitle={createdProject
          ? `Step 2 of 2 · Add tasks to ${createdProject.name || createdProject.title}, or skip and add them later.`
          : "Step 1 of 2 · Set up a project, then add its tasks or finish setup."}
      />
      <ol className="project-create-steps" aria-label="Project setup steps">
        <li className={createdProject ? "is-complete" : "is-current"} aria-current={createdProject ? undefined : "step"}>
          <span>01</span> Create project
        </li>
        <li className={createdProject ? "is-current" : "is-upcoming"} aria-current={createdProject ? "step" : undefined}>
          <span>02</span> Add tasks <small>Optional</small>
        </li>
      </ol>

      {createdProject ? (
        <Card
          title={createdProject.name || createdProject.title}
          description="Add one or more tasks to this project. You can also skip this step and create tasks later."
          className="project-task-setup"
        >
          {taskLookupError && <p className="form-error" role="alert">{taskLookupError}</p>}
          {successMessage && <p className="form-success" role="status">{successMessage}</p>}
          <form className="create-project-form" onSubmit={handleCreateTask}>
            <div className="form-field">
              <label htmlFor="setup-task-title">Task title <span className="required-mark" aria-hidden="true">*</span></label>
              <input id="setup-task-title" name="title" value={taskForm.title} onChange={handleTaskChange} maxLength="200" required />
            </div>
            <div className="form-field">
              <label htmlFor="setup-task-description">Description</label>
              <textarea id="setup-task-description" name="description" rows="3" maxLength="2000" value={taskForm.description} onChange={handleTaskChange} />
            </div>
            <div className="create-project-date-grid">
              <div className="form-field">
                <label htmlFor="setup-task-category">Category</label>
                <select id="setup-task-category" name="category" value={taskForm.category} onChange={handleTaskChange}>
                  {taskCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                  <option value={NEW_CATEGORY}>New Category...</option>
                </select>
              </div>
              {taskForm.category === NEW_CATEGORY && (
                <div className="form-field">
                  <label htmlFor="setup-task-new-category">New task category</label>
                  <input id="setup-task-new-category" value={newTaskCategory} onChange={(event) => setNewTaskCategory(event.target.value)} maxLength="100" required />
                </div>
              )}
              <div className="form-field">
                <label htmlFor="setup-task-status">Status</label>
                <select id="setup-task-status" name="status" value={taskForm.status} onChange={handleTaskChange}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="in progress">In progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="setup-task-priority">Priority</label>
                <select id="setup-task-priority" name="priority" value={taskForm.priority} onChange={handleTaskChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="setup-task-due-date">Due date</label>
                <input id="setup-task-due-date" name="dueDate" type="date" value={taskForm.dueDate} onChange={handleTaskChange} />
              </div>
            </div>
            <AttachmentField
              value={taskForm.attachment}
              onChange={(attachment) => setTaskForm((current) => ({ ...current, attachment }))}
              label="Task image or file"
            />
            {taskError && <p className="form-error" role="alert">{taskError}</p>}
            <div className="create-project-actions">
              <Button type="submit" disabled={isCreatingTask}>
                {isCreatingTask ? "Adding task..." : tasksCreated ? "Add another task" : "Add task"}
              </Button>
              <Button type="button" variant="secondary" onClick={finishSetup}>
                {tasksCreated ? "Finish setup" : "Skip tasks for now"}
              </Button>
            </div>
          </form>
          {existingTasks.some((task) => !task.project && !task.projectId) && (
            <div className="project-existing-tasks">
              <label htmlFor="existing-task-to-add">Or add an unassigned task you created earlier</label>
              <div>
                <select id="existing-task-to-add" value={taskToAssociate} onChange={(event) => setTaskToAssociate(event.target.value)}>
                  <option value="">Choose an unassigned task</option>
                  {existingTasks.filter((task) => !task.project && !task.projectId).map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.title}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="secondary" onClick={handleAssociateTask} disabled={!taskToAssociate || isAssociatingTask}>
                  {isAssociatingTask ? "Adding..." : "Add existing task"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
      <Card title="Project details" description="Add the key information for your new project.">
        <form className="create-project-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="project-name">Project Name <span className="required-mark" aria-hidden="true">*</span></label>
            <input id="project-name" name="name" value={formState.name} onChange={handleChange} minLength="2" maxLength="200" required />
            {projectLookupError && <p className="project-lookup-error" role="status">{projectLookupError}</p>}
            {matchingProjects.length > 0 && (
              <div className="project-lookup" aria-live="polite">
                <strong>{exactNameMatch ? "A project with this name already exists" : "Matching projects"}</strong>
                <ul>
                  {matchingProjects.map((project) => (
                    <li key={project._id || `${project.name}-${project.category}`}>
                      <span><b>{project.name || project.title}</b><small>{project.category || "General"} · {project.status || "Project"}</small></span>
                      {project._id && <Link to={`/projects/${project._id}`}>View</Link>}
                    </li>
                  ))}
                </ul>
                {exactNameMatch && <p>Creating another project with the same name is allowed, but check the existing one first.</p>}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="project-category">Category</label>
            <select id="project-category" name="category" value={formState.category} onChange={handleChange}>
              {projectCategories.map((category) => <option key={category}>{category}</option>)}
              <option value={NEW_CATEGORY}>New Category...</option>
            </select>
            {formState.category === NEW_CATEGORY && (
              <input aria-label="New project category" placeholder="Enter a category name" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} maxLength="100" required />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="project-description">Description</label>
            <textarea id="project-description" name="description" rows="4" maxLength="2000" value={formState.description} onChange={handleChange} />
          </div>

          <div className="create-project-date-grid">
            <div className="form-field">
              <label htmlFor="project-start-date">Start Date</label>
              <input id="project-start-date" name="startDate" type="date" value={formState.startDate} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="project-completion-date">Completion Date</label>
              <input id="project-completion-date" name="completionDate" type="date" value={formState.completionDate} onChange={handleChange} />
            </div>
          </div>

          <AttachmentField
            value={formState.attachment}
            onChange={(attachment) => setFormState((current) => ({ ...current, attachment }))}
            label="Project image or file"
          />

          {requestError && <p className="form-error" role="alert">{requestError}</p>}
          {successMessage && <p className="form-success" role="status">{successMessage}</p>}
          <div className="create-project-actions">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating project..." : "Create project and continue"}</Button>
            <Link className="btn secondary" to="/dashboard">Back to dashboard</Link>
          </div>
        </form>
      </Card>
      )}
    </div>
  );
}

export default CreateProject;
