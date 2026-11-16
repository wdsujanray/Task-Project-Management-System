import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import { requestPasswordReset, resetPassword } from "../../services/api";
import "../../styles/authRecovery.css";

function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestReset = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword(token, password);
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page recovery-page">
      <div className="auth-panel">
        <PageTitle
          title={token ? "Choose a new password" : "Forgot Password?"}
          subtitle={token ? "Create a new password for your account." : "We’ll email you a secure link to reset your password."}
        />

        {token ? (
          <form className="recovery-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="reset-password">New password</label>
              <input id="reset-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" maxLength="128" autoComplete="new-password" required />
            </div>
            <div className="form-group">
              <label htmlFor="reset-confirm-password">Confirm new password</label>
              <input id="reset-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength="8" maxLength="128" autoComplete="new-password" required />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {message && <p className="form-success" role="status">{message}</p>}
            <Button type="submit" className="full-width" disabled={isSubmitting || Boolean(message)}>
              {isSubmitting ? "Updating password..." : "Update password"}
            </Button>
          </form>
        ) : (
          <form className="recovery-form" onSubmit={handleRequestReset}>
            <div className="form-group">
              <label htmlFor="recovery-email">Email address</label>
              <input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="name@example.com" required />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {message && <p className="form-success" role="status">{message}</p>}
            <Button type="submit" className="full-width" disabled={isSubmitting}>
              {isSubmitting ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="auth-switch"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}

export default ForgotPassword;
