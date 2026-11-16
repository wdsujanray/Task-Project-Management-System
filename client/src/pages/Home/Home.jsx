import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import WelcomeMessage from "../../components/ui/WelcomeMessage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("taskflowUser") || "null");
    } catch {
      return null;
    }
  });
  const projectName = "Task & Project Management System";
  const isLoggedIn = Boolean(localStorage.getItem("taskflowToken"));

  useEffect(() => {
    const refreshUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("taskflowUser") || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("taskflow:user-updated", refreshUser);
    return () => window.removeEventListener("taskflow:user-updated", refreshUser);
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="hero-content">
            <PageTitle title={projectName} subtitle="Plan work, manage teams, and track progress from one clean and powerful workspace." />
            <WelcomeMessage name={user?.name || "Project Manager"} projectName={projectName} />
            <p>
              Organize every milestone with a clear view of your team's work.
            </p>
            <Button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/register")}>{isLoggedIn ? "Open dashboard" : "Get started"}</Button>
          </div>

          <div className="hero-visual" aria-label="Project illustration">
            <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="feature-section">
        <h2 className="section-title">Core Features</h2>

        <div className="feature-grid">
          <Card title="Task Tracking" description="Create, organize, and monitor tasks in a structured workflow." />
          <Card title="Project Planning" description="Keep project milestones, goals, and team responsibilities visible." />
          <Card title="Team Visibility" description="Review priorities and progress to keep everyone aligned." />
        </div>
      </section>
    </div>
  );
}

export default Home;