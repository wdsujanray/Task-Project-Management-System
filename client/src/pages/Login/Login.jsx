import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import { loginUser } from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { token, user } = await loginUser(formData);
      localStorage.setItem("taskflowToken", token);
      localStorage.setItem("taskflowUser", JSON.stringify(user));
      localStorage.setItem("taskflowSession", JSON.stringify({ email: user.email, loggedIn: true }));
      navigate("/profile", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-panel">
        <div className="auth-icon" aria-hidden="true">&#8594;</div>
        <PageTitle title="Welcome Back" subtitle="Sign in to continue managing your tasks and project work." />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
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
                <span className="password-emoji" aria-hidden="true">{showPassword ? "🙈" : "👁️"}</span>
              </button>
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" className="full-width auth-submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Login"}</Button>
        </form>

        <p className="auth-switch">
          Need an account? <NavLink to="/register">Register here</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;