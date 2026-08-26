import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "../../components/common/Button";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      name: formData.name || "New User",
      email: formData.email || "user@example.com",
      password: formData.password || "",
    };

    localStorage.setItem("taskflowUser", JSON.stringify(user));
    navigate("/profile", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-panel">
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
            <input
              id="register-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <Button type="submit" className="full-width">Register</Button>
        </form>

        <p className="auth-switch">
          Already have an account? <NavLink to="/login">Login here</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
