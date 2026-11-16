import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("taskflowSession") || "{}");
  } catch {
    return {};
  }
}

function Sessions() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getSession);
  const [isEnding, setIsEnding] = useState(false);

  const endSession = () => {
    setIsEnding(true);
    localStorage.removeItem("taskflowSession");
    localStorage.removeItem("taskflowUser");
    localStorage.removeItem("taskflowToken");
    setSession({});
    navigate("/login", { replace: true });
  };

  const signedInAt = session.signedInAt
    ? new Date(session.signedInAt).toLocaleString()
    : "Sign-in time is not available for this session.";

  return (
    <div className="account-page sessions-page">
      <PageTitle title="Session management" subtitle="Review and end the current signed-in session for this browser." />

      <Card title="This browser" description="Your account is currently signed in on this device.">
        <dl className="session-details">
          <div><dt>Account</dt><dd>{session.email || "Signed-in account"}</dd></div>
          <div><dt>Session started</dt><dd>{signedInAt}</dd></div>
          <div><dt>Device</dt><dd>{navigator.userAgentData?.platform || navigator.platform || "This browser"}</dd></div>
          <div><dt>Session expiry</dt><dd>Sign-in tokens expire after 24 hours.</dd></div>
        </dl>
        <Button onClick={endSession} disabled={isEnding}>{isEnding ? "Signing out..." : "Sign out on this device"}</Button>
      </Card>
      <p className="session-note">This application manages one browser session at a time. Signing out clears its local sign-in token.</p>
    </div>
  );
}

export default Sessions;
