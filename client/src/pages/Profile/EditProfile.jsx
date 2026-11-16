import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";
import ImageCropper from "../../components/common/ImageCropper";
import { deleteAccount, getProfile, updateProfile } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", profileImage: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskflowToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getProfile(token).then((profile) => {
      setUser(profile);
      setFormData({ name: profile.name || "", email: profile.email || "", profileImage: profile.profileImage || "" });
    }).catch((requestError) => {
      setError(requestError.message);
      if (["Authentication required", "Invalid authentication token"].includes(requestError.message) && localStorage.getItem("taskflowToken") === token) {
        localStorage.removeItem("taskflowToken");
        localStorage.removeItem("taskflowSession");
        navigate("/login", { replace: true });
      }
    }).finally(() => setIsLoading(false));
  }, [navigate]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFeedback("");
    setError("");
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setFeedback("");
    setError("");
    setIsSaving(true);
    try {
      const token = localStorage.getItem("taskflowToken");
      const updatedUser = await updateProfile(token, formData);
      setUser(updatedUser);
      localStorage.setItem("taskflowUser", JSON.stringify(updatedUser));
      const session = JSON.parse(localStorage.getItem("taskflowSession") || "{}");
      localStorage.setItem("taskflowSession", JSON.stringify({ ...session, email: updatedUser.email }));
      window.dispatchEvent(new Event("taskflow:user-updated"));
      setFormData({ name: updatedUser.name, email: updatedUser.email, profileImage: updatedUser.profileImage || "" });
      setFeedback("Your profile has been updated.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    if (!window.confirm("Permanently delete your account, projects, and tasks? This cannot be undone.")) return;

    setError("");
    setFeedback("");
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("taskflowToken");
      await deleteAccount(token, currentPassword);
      localStorage.removeItem("taskflowToken");
      localStorage.removeItem("taskflowSession");
      localStorage.removeItem("taskflowUser");
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="profile-page"><p role="status">Loading your profile...</p></div>;
  }
  if (!user) {
    return <div className="profile-page"><PageTitle title="Profile unavailable" subtitle={error || "Your profile could not be loaded."} /></div>;
  }

  return (
    <div className="profile-page edit-profile-page">
      <Link className="profile-back-link" to="/profile">
        <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
        Back to My Profile
      </Link>
      <PageTitle title="Edit profile" subtitle="Keep your account details and profile photo up to date." />

      {feedback && <p className="profile-feedback" role="status">{feedback}</p>}
      {error && <p className="profile-error" role="alert">{error}</p>}

      <section className="profile-edit-section">
        <Card title="Personal information" description="Your updated name and profile photo appear across your workspace.">
          <form className="profile-edit-form" onSubmit={handleSaveProfile}>
            <ImageCropper
              id="profile-photo"
              label="Choose photo"
              helperText="JPEG, PNG, or WebP. Maximum file size: 5 MB."
              value={formData.profileImage}
              onChange={(profileImage) => {
                setFormData((current) => ({ ...current, profileImage }));
                setFeedback("");
                setError("");
              }}
              fallback={formData.name.trim().charAt(0).toUpperCase() || "Add photo"}
              imageAlt="Profile preview"
              shape="circle"
              aspectRatio={1}
            />
            <div className="profile-form-grid">
              <label className="form-field" htmlFor="profile-name">Full name
                <input id="profile-name" name="name" value={formData.name} onChange={handleProfileChange} minLength="1" maxLength="80" autoComplete="name" required />
              </label>
              <label className="form-field" htmlFor="profile-email">Email address
                <input id="profile-email" name="email" type="email" value={formData.email} onChange={handleProfileChange} maxLength="254" autoComplete="email" required />
              </label>
            </div>
            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving changes..." : "Save changes"}</Button>
          </form>
        </Card>
      </section>

      <section className="account-danger-zone">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Delete your account</h2>
          <p>This permanently removes your account, profile photo, projects, and tasks.</p>
        </div>
        <form onSubmit={handleDeleteAccount}>
          <label className="form-field" htmlFor="delete-account-password">Confirm with your password
            <input id="delete-account-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          <button type="submit" className="btn delete-account-button" disabled={isDeleting}>
            <FontAwesomeIcon icon={faTrashCan} aria-hidden="true" />
            {isDeleting ? "Deleting account..." : "Permanently delete account"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default EditProfile;
