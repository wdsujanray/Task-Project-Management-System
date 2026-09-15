import { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import "./CreateTask.css";

const initialFormState = {
  title: "",
  description: "",
  project: "",
  priority: "",
  status: "",
  dueDate: "",
  assignedTo: "",
};

const projectOptions = ["Website Redesign", "Mobile App Launch", "Marketing Campaign"];
const assigneeOptions = ["Sujan Ray", "Aarav Sharma", "Maya Patel"];

function validateForm(formState) {
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

  if (!formState.project) nextErrors.project = "Select a project.";
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
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submittedTask, setSubmittedTask] = useState(null);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage("");
      setSubmittedTask(null);
      return;
    }

    setSubmittedTask({ ...formState });
    setFormState(initialFormState);
    setErrors({});
    setSuccessMessage("Task submitted successfully. It is ready for backend integration.");
  };

  const handleReset = () => {
    setFormState(initialFormState);
    setErrors({});
    setSuccessMessage("");
    setSubmittedTask(null);
  };

  const fieldProps = (fieldName) => ({
    name: fieldName,
    value: formState[fieldName],
    onChange: handleChange,
    "aria-invalid": Boolean(errors[fieldName]),
    "aria-describedby": errors[fieldName] ? `${fieldName}-error` : undefined,
  });

  return (
    <div className="create-task-page">
      <PageTitle title="Create Task" subtitle="Capture the task details your team needs to move work forward." />

      <div className="create-task-layout">
        <Card title="Task details" description="Complete every required field before creating the task.">
          <form className="create-task-form" onSubmit={handleSubmit} noValidate>
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
                <label htmlFor="task-project">Project <RequiredMark /></label>
                <select id="task-project" {...fieldProps("project")}>
                  <option value="">Choose a project</option>
                  {projectOptions.map((project) => <option key={project} value={project}>{project}</option>)}
                </select>
                <FieldError id="project-error" message={errors.project} />
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
                  {assigneeOptions.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
                </select>
                <FieldError id="assignedTo-error" message={errors.assignedTo} />
              </div>
            </div>

            <p className="required-hint"><RequiredMark /> Required fields</p>
            <div className="create-task-actions">
              <Button type="submit">Create Task</Button>
              <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
            </div>
          </form>
        </Card>

        <aside className="create-task-feedback" aria-live="polite">
          {successMessage && <div className="form-success" role="status">{successMessage}</div>}
          {submittedTask && (
            <Card title="Submitted task" description="This preview is stored in local component state only.">
              <dl className="submitted-task-details">
                <div><dt>Task Title</dt><dd>{submittedTask.title}</dd></div>
                <div><dt>Description</dt><dd>{submittedTask.description}</dd></div>
                <div><dt>Project</dt><dd>{submittedTask.project}</dd></div>
                <div><dt>Priority</dt><dd>{submittedTask.priority}</dd></div>
                <div><dt>Status</dt><dd>{submittedTask.status}</dd></div>
                <div><dt>Due Date</dt><dd>{submittedTask.dueDate}</dd></div>
                <div><dt>Assigned To</dt><dd>{submittedTask.assignedTo}</dd></div>
              </dl>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

export default CreateTask;
