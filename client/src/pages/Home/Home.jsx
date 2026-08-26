import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="hero-content">
            <p className="eyebrow">Smart workflow</p>
            <h1>Task & Project Management System</h1>
            <p>
              Plan work, manage teams, and track progress from one clean and
              powerful workspace.
            </p>
            <Button>Get Started</Button>
          </div>

          <div className="hero-visual" aria-label="Project illustration">
            ✓
          </div>
        </div>
      </section>

      <section className="feature-section">
        <h2 className="section-title">Core Features</h2>

        <div className="feature-grid">
          <Card>
            <h3>Task Tracking</h3>
            <p>Create, organize, and monitor tasks in a structured workflow.</p>
          </Card>

          <Card>
            <h3>Project Planning</h3>
            <p>Keep project milestones, goals, and team responsibilities visible.</p>
          </Card>

          <Card>
            <h3>Team Visibility</h3>
            <p>Review priorities and progress to keep everyone aligned.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Home;