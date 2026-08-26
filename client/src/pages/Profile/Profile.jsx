import { useEffect, useState } from "react";
import Card from "../../components/common/Card";

function Profile() {
  const [user, setUser] = useState({
    name: "Demo User",
    email: "demo@example.com",
    role: "Project Manager",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("taskflowUser") || "null");
    if (storedUser) {
      setUser({
        name: storedUser.name || "Demo User",
        email: storedUser.email || "demo@example.com",
        role: storedUser.role || "Project Manager",
      });
    }
  }, []);

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
        </div>
      </div>

      <p>Manage your personal workspace details and activity preferences.</p>

      <div className="profile-grid">
        <Card>
          <h3>Full Name</h3>
          <p>{user.name}</p>
        </Card>

        <Card>
          <h3>Email</h3>
          <p>{user.email}</p>
        </Card>

        <Card>
          <h3>Role</h3>
          <p>{user.role}</p>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
