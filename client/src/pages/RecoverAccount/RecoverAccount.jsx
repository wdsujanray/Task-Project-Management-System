import { Link } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import "../../styles/authRecovery.css";

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

function RecoverAccount() {
  const supportSubject = encodeURIComponent("Help recovering my TaskFlow account");
  const supportBody = encodeURIComponent("Hello, I need help recovering access to my TaskFlow account.\n\nName:\nAccount email (if known):");

  return (
    <div className="auth-page recovery-page">
      <div className="auth-panel">
        <PageTitle title="Recover Account" subtitle="Get help finding or restoring access to your account." />

        <div className="recovery-guidance">
          <h2>Contact your workspace administrator</h2>
          <p>For your protection, account details can only be verified by your workspace administrator or support team.</p>
          {supportEmail ? (
            <a className="btn primary full-width" href={`mailto:${supportEmail}?subject=${supportSubject}&body=${supportBody}`}>
              Contact support
            </a>
          ) : (
            <p className="form-error" role="status">Support email is not configured. Please contact your application administrator.</p>
          )}
        </div>

        <p className="auth-recovery-alternative">
          Know your email but forgot your password? <Link to="/forgot-password">Reset your password</Link>
        </p>
        <p className="auth-switch"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}

export default RecoverAccount;
