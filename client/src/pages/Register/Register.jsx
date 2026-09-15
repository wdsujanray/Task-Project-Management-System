import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "../../components/ui/Button";
import { registerUser } from "../../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      const { token, user } = await registerUser(formData);
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
    <div className="auth-page register-page">
      <div className="auth-panel">
        <div className="auth-icon" aria-hidden="true">+</div>
        <p className="eyebrow">Start organized</p>
        <h1>Create Account</h1>
        <p>Register to manage your tasks and project workspace.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <div className="password-field">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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
          <Button type="submit" className="full-width auth-submit register-submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Register"}</Button>
        </form>

        <p className="auth-switch">
          Already have an account? <NavLink to="/login">Login here</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
