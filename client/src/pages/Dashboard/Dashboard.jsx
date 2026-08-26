import Card from "../../components/common/Card";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <p>Track project performance, task progress, and team productivity.</p>

      <div className="dashboard-grid">
        <Card>
          <h3>Total Projects</h3>
          <p className="metric-value">12</p>
        </Card>

        <Card>
          <h3>Open Tasks</h3>
          <p className="metric-value">48</p>
        </Card>

        <Card>
          <h3>Completed</h3>
          <p className="metric-value">86%</p>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;