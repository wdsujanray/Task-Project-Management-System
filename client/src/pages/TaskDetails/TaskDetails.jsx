import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import AttachmentPreview from "../../components/common/AttachmentPreview";
import { getTask } from "../../services/taskService";
import "../../styles/allWork.css";

function displayLabel(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getTask(token, taskId)
      .then(setTask)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [navigate, taskId]);

  if (isLoading) {
    return <div className="work-edit-page"><p role="status">Loading task...</p></div>;
  }

  return (
    <div className="work-edit-page">
      {task ? (
        <>
          <PageTitle title={task.title || "Task"} subtitle="Task details" />
          <div className="all-work-actions">
            <Link className="btn" to={`/tasks/${taskId}/edit`}>Edit task</Link>
            <Link className="btn secondary" to="/tasks">All tasks</Link>
          </div>
          <Card title="Task details" className="work-detail-card">
            <dl className="all-work-details">
              <div><dt>Status</dt><dd><span className={`project-task-status status-${String(task.status || "pending").toLowerCase().replace(/\s+/g, "-")}`}>{displayLabel(task.status || "pending")}</span></dd></div>
              <div><dt>Priority</dt><dd>{displayLabel(task.priority || "medium")}</dd></div>
              {task.project && (
                <div>
                  <dt>Project</dt>
                  <dd><Link to={`/projects/${task.project}`}>{task.projectName || "View project"}</Link></dd>
                </div>
              )}
              {task.category && <div><dt>Category</dt><dd>{task.category}</dd></div>}
              {task.assignedToName && <div><dt>Assigned to</dt><dd>{task.assignedToName}</dd></div>}
              {task.startDate && <div><dt>Start date</dt><dd>{String(task.startDate).slice(0, 10)}</dd></div>}
              {task.dueDate && <div><dt>Due date</dt><dd>{String(task.dueDate).slice(0, 10)}</dd></div>}
            </dl>
            {task.description && <p className="all-work-description">{task.description}</p>}
            {task.attachment && <AttachmentPreview attachment={task.attachment} />}
          </Card>
        </>
      ) : (
        <PageTitle title="Task unavailable" subtitle={error || "This task could not be found."} />
      )}
      {error && task && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}

export default TaskDetails;
