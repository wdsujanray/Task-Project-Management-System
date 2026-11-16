import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

function Help() {
  return (
    <div className="account-page help-page">
      <PageTitle title="Help & support" subtitle="Find your way around the workspace and get help with common tasks." />

      <div className="help-card-grid">
        <Card title="Getting started" description="Create an account to open your private workspace.">
          <Link className="help-link" to="/dashboard">Open your dashboard</Link>
        </Card>
        <Card title="Manage your profile" description="Update your name, email, and profile photo.">
          <Link className="help-link" to="/edit-profile">Edit your profile</Link>
        </Card>
        <Card title="Organize a team" description="Create teams and maintain member lists for your organization.">
          <Link className="help-link" to="/organization">Manage teams</Link>
        </Card>
      </div>

      <Card title="Frequently asked questions">
        <div className="help-faq">
          <details>
            <summary>Where do projects and tasks appear?</summary>
            <p>Your dashboard lists the projects and tasks owned by your signed-in account. New accounts start with editable sample data.</p>
          </details>
          <details>
            <summary>Can I change my theme?</summary>
            <p>Yes. Open Settings from the account menu to change the theme or layout density. Preferences are saved in this browser.</p>
          </details>
          <details>
            <summary>How do I remove my account?</summary>
            <p>Open Edit Profile, enter your current password in the account section, and confirm deletion. Your owned projects, tasks, and teams are removed too.</p>
          </details>
          <details id="account-recovery">
            <summary>How do I recover my account?</summary>
            <p>Account recovery requires help from your workspace administrator. <Link to="/recover-account">Open account recovery</Link>.</p>
          </details>
          <details id="forgot-password">
            <summary>Can I reset my password?</summary>
            <p>Yes. <Link to="/forgot-password">Request a password reset link</Link> using your account email.</p>
          </details>
        </div>
      </Card>

      <Card title="Contact support" description={supportEmail ? "Send a message to the configured support address." : "Support email has not been configured for this installation."}>
        {supportEmail
          ? <a className="help-link" href={`mailto:${supportEmail}`}>Email support</a>
          : <p className="support-unavailable">Ask your application administrator to configure VITE_SUPPORT_EMAIL.</p>}
      </Card>
    </div>
  );
}

export default Help;
