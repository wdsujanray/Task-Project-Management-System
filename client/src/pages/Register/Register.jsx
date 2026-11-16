import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "../../components/ui/Button";
import { registerUser } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEye, faEyeSlash, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    if (!name || !email || !formData.password || !formData.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser({ name, email, password: formData.password });
      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. You can now log in." },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-panel">
        <div className="auth-icon" aria-hidden="true"><FontAwesomeIcon icon={faUserPlus} /></div>
        <p className="eyebrow">Start organized</p>
        <h1>Create Account</h1>
        <p>Register to manage your tasks and project workspace.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
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
              autoComplete="email"
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
                autoComplete="new-password"
                minLength={8}
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

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" className="full-width auth-submit register-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
            <FontAwesomeIcon className="auth-submit-icon" icon={faArrowRight} aria-hidden="true" />
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account? <NavLink to="/login">Login here</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
