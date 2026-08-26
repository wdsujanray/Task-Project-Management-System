import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <PageTitle title="Dashboard" subtitle="Track project performance, task progress, and team productivity." />

      <div className="dashboard-actions">
        <Button>Create Project</Button>
      </div>

      <div className="dashboard-grid">
        <Card title="Total Projects" description="12" className="stat-card">
          <p className="metric-value">12</p>
        </Card>

        <Card title="Total Tasks" description="48" className="stat-card">
          <p className="metric-value">48</p>
        </Card>

        <Card title="Completed Tasks" description="86" className="stat-card">
          <p className="metric-value">86</p>
        </Card>

        <Card title="Pending Tasks" description="14" className="stat-card">
          <p className="metric-value">14</p>
        </Card>
      </div>

      <div className="dashboard-sections">
        <Card title="Recent Projects">
          <ul className="dashboard-list">
            <li><span>Website redesign</span><strong>72%</strong></li>
            <li><span>Mobile app launch</span><strong>48%</strong></li>
            <li><span>Q4 planning</span><strong>25%</strong></li>
          </ul>
        </Card>

        <Card title="Recent Tasks">
          <ul className="dashboard-list">
            <li><span>Review wireframes</span><strong>Today</strong></li>
            <li><span>Assign sprint owners</span><strong>Tomorrow</strong></li>
            <li><span>Prepare project brief</span><strong>Friday</strong></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;