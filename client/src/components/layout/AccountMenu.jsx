import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faChartLine,
  faChevronDown,
  faChevronUp,
  faCircleQuestion,
  faGear,
  faIdCard,
  faLock,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const billingAdministrationPermissions = new Set([
  "admin:manage",
  "billing:manage",
  "billing:read",
]);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("taskflowUser") || "null");
  } catch {
    return null;
  }
}

function AccountMenu({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(readUser);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const refreshUser = () => setUser(readUser());
    window.addEventListener("storage", refreshUser);
    window.addEventListener("taskflow:user-updated", refreshUser);
    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("taskflow:user-updated", refreshUser);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!localStorage.getItem("taskflowToken")) return null;

  const initials = (user?.name || "Account").trim().charAt(0).toUpperCase();
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canAccessBillingAdministration = permissions.some((permission) =>
    billingAdministrationPermissions.has(permission),
  );
  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
    navigate("/login", { replace: true });
  };
  const menuLinks = [
    { to: "/profile", icon: faIdCard, label: "My Profile" },
    { to: "/settings", icon: faGear, label: "Settings" },
    ...(!canAccessBillingAdministration
      ? [{ to: "/organization", icon: faBuilding, label: "Organization & teams" }]
      : []),
    { to: "/dashboard", icon: faChartLine, label: "Dashboard" },
    { to: "/projects", icon: faBuilding, label: "All Projects" },
    { to: "/tasks", icon: faChartLine, label: "All Tasks" },
    { to: "/create-project", icon: faPlus, label: "Create project" },
    { to: "/create-task", icon: faPlus, label: "Create task" },
    ...(canAccessBillingAdministration
      ? [{ to: "/organization", icon: faBuilding, label: "Organization administration" }]
      : []),
    { to: "/help", icon: faCircleQuestion, label: "Help center" },
    { to: "/sessions", icon: faLock, label: "Active session" },
  ];

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        type="button"
        className="account-menu-trigger"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="account-menu-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        {user?.profileImage
          ? <img src={user.profileImage} alt="" className="account-menu-avatar" />
          : <span className="account-menu-avatar account-menu-initial" aria-hidden="true">{initials}</span>}
        <span className="account-menu-name">{user?.name || "Account"}</span>
        <FontAwesomeIcon className="account-menu-chevron" icon={isOpen ? faChevronUp : faChevronDown} aria-hidden="true" />
      </button>

      {isOpen && (
        <div id="account-menu-panel" className="account-menu-panel" role="menu" aria-label="Account options">
          <div className="account-menu-heading">
            <strong>{user?.name || "Your account"}</strong>
            <span>{user?.email || ""}</span>
          </div>
          <nav className="account-menu-links" aria-label="Account options">
            {menuLinks.map((link) => (
              <Link className="account-menu-link" key={link.label} to={link.to} role="menuitem">
                <FontAwesomeIcon icon={link.icon} aria-hidden="true" />
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="account-menu-link account-menu-logout"
              role="menuitem"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />
              Log out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
