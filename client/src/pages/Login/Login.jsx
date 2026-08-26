import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "../../components/common/Button";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const existingUser = JSON.parse(localStorage.getItem("taskflowUser") || "null");
    const emailMatches = existingUser && existingUser.email === formData.email;
    const passwordMatches = existingUser && existingUser.password === formData.password;

    if (emailMatches && passwordMatches) {
      localStorage.setItem("taskflowSession", JSON.stringify({ email: formData.email, loggedIn: true }));
      navigate("/profile", { replace: true });
      return;
    }

    const fallbackUser = {
      name: "Demo User",
      email: formData.email || "demo@example.com",
      password: formData.password || "",
    };

    localStorage.setItem("taskflowUser", JSON.stringify(fallbackUser));
    localStorage.setItem("taskflowSession", JSON.stringify({ email: fallbackUser.email, loggedIn: true }));
    navigate("/profile", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <h1>Welcome Back</h1>
        <p>Sign in to continue managing your tasks and project work.</p>

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
            <input
              id="login-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="full-width">Login</Button>
        </form>

        <p className="auth-switch">
          Need an account? <NavLink to="/register">Register here</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;