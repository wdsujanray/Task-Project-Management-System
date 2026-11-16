import { useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import { loginUser } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEye, faEyeSlash, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.message || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasAttemptedLogin(true);
    setError("");
    setSuccess("");

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    if (!emailPattern.test(formData.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { token, user } = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });
      localStorage.setItem("taskflowToken", token);
      localStorage.setItem("taskflowUser", JSON.stringify(user));
      localStorage.setItem("taskflowSession", JSON.stringify({ email: user.email, loggedIn: true, signedInAt: new Date().toISOString() }));
      navigate("/profile", { replace: true, state: { authMessage: "Login successful." } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-panel">
        <div className="auth-icon" aria-hidden="true"><FontAwesomeIcon icon={faRightToBracket} /></div>
        <PageTitle title="Welcome Back" subtitle="Sign in to continue managing your tasks and project work." />

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="password-field">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon className="password-icon" icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" />
              </button>
            </div>
          </div>

          {success && <p className="auth-success" role="status">{success}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" className="full-width auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
            <FontAwesomeIcon className="auth-submit-icon" icon={faArrowRight} aria-hidden="true" />
          </Button>
        </form>

        <p className="auth-switch">
          Need an account? <NavLink to="/register">Register here</NavLink>
        </p>
        {hasAttemptedLogin && (
          <p className="auth-recovery-links">
            <NavLink to="/recover-account">Recover Account</NavLink>
            <NavLink to="/forgot-password">Forgot Password?</NavLink>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;