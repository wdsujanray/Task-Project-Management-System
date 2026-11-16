import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import { getRecycleBinItems, permanentlyDeleteRecycleBinItem, restoreRecycleBinItem } from "../../services/api";
import "../../styles/allWork.css";

function RecycleBin() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    getRecycleBinItems(token)
      .then(setItems)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const restoreItem = async (item) => {
    setBusyItemId(item._id);
    setError("");
    setMessage("");
    try {
      await restoreRecycleBinItem(localStorage.getItem("taskflowToken"), item._id);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setMessage(`${item.name} was restored.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyItemId("");
    }
  };

  const permanentlyDeleteItem = async (item) => {
    if (!window.confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) return;
    setBusyItemId(item._id);
    setError("");
    setMessage("");
    try {
      await permanentlyDeleteRecycleBinItem(localStorage.getItem("taskflowToken"), item._id);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setMessage(`${item.name} was permanently deleted.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyItemId("");
    }
  };

  return (
    <div className="all-work-page recycle-bin-page">
      <PageTitle title="Recycle Bin" subtitle="Restore items or permanently delete them from your workspace." />
      <div className="all-work-actions">
        <Link className="btn secondary" to="/settings">Back to settings</Link>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      {isLoading && <p role="status">Loading recycle bin...</p>}
      {!isLoading && !items.length && !error && (
        <Card title="Recycle Bin is empty">
          <p>Deleted projects and tasks will appear here.</p>
        </Card>
      )}
      {!isLoading && items.length > 0 && (
        <div className="recycle-bin-list">
          {items.map((item) => (
            <Card key={item._id} title={item.name} className="recycle-bin-item">
              <dl className="all-work-details">
                <div><dt>Type</dt><dd>{item.entityType === "project" ? "Project" : "Task"}</dd></div>
                <div><dt>Deleted</dt><dd>{new Date(item.deletedAt).toLocaleString()}</dd></div>
                {item.entityType === "project" && item.relatedTaskCount > 0 && (
                  <div><dt>Included tasks</dt><dd>{item.relatedTaskCount}</dd></div>
                )}
              </dl>
              <div className="all-work-card-actions">
                <Button onClick={() => restoreItem(item)} disabled={busyItemId === item._id}>
                  {busyItemId === item._id ? "Working..." : "Restore"}
                </Button>
                <Button variant="secondary" onClick={() => permanentlyDeleteItem(item)} disabled={busyItemId === item._id}>
                  Permanently delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecycleBin;