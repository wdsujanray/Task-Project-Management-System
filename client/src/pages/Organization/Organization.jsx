import { useCallback, useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/ui/PageTitle";
import { createTeam, deleteTeam, getProfile, getTeams, updateOrganization, updateTeam } from "../../services/api";

function Organization() {
  const [organization, setOrganization] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);
  const [memberDrafts, setMemberDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrganization, setIsSavingOrganization] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const loadWorkspace = useCallback(async () => {
    const token = localStorage.getItem("taskflowToken");
    const [profile, savedTeams] = await Promise.all([getProfile(token), getTeams(token)]);
    setOrganization(profile.organization || "");
    setTeams(savedTeams);
  }, []);

  useEffect(() => {
    loadWorkspace().catch((loadError) => setError(loadError.message)).finally(() => setIsLoading(false));
  }, [loadWorkspace]);

  const handleOrganizationSave = async (event) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    setIsSavingOrganization(true);
    try {
      const profile = await updateOrganization(localStorage.getItem("taskflowToken"), organization);
      setOrganization(profile.organization);
      setFeedback("Organization details saved.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSavingOrganization(false);
    }
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    try {
      const team = await createTeam(localStorage.getItem("taskflowToken"), { name: teamName, description: teamDescription });
      setTeams((current) => [team, ...current]);
      setTeamName("");
      setTeamDescription("");
      setFeedback(`${team.name} was created.`);
    } catch (createError) {
      setError(createError.message);
    }
  };

  const handleTeamSave = async (teamId) => {
    if (!editingTeam?.name.trim()) return;
    setError("");
    try {
      const updatedTeam = await updateTeam(localStorage.getItem("taskflowToken"), teamId, { name: editingTeam.name, description: editingTeam.description });
      setTeams((current) => current.map((team) => team._id === teamId ? updatedTeam : team));
      setEditingTeam(null);
      setFeedback("Team details saved.");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const handleMemberAdd = async (event, team) => {
    event.preventDefault();
    const member = memberDrafts[team._id] || { name: "", email: "", role: "Member" };
    setError("");
    try {
      const updatedTeam = await updateTeam(localStorage.getItem("taskflowToken"), team._id, { members: [...(team.members || []), member] });
      setTeams((current) => current.map((item) => item._id === team._id ? updatedTeam : item));
      setMemberDrafts((current) => ({ ...current, [team._id]: { name: "", email: "", role: "Member" } }));
      setFeedback(`${member.name} was added to ${team.name}.`);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const handleMemberRemove = async (team, memberIndex) => {
    setError("");
    try {
      const members = team.members.filter((_, index) => index !== memberIndex);
      const updatedTeam = await updateTeam(localStorage.getItem("taskflowToken"), team._id, { members });
      setTeams((current) => current.map((item) => item._id === team._id ? updatedTeam : item));
      setFeedback("Team member removed.");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const handleTeamDelete = async (team) => {
    if (!window.confirm(`Delete the ${team.name} team?`)) return;
    setError("");
    try {
      await deleteTeam(localStorage.getItem("taskflowToken"), team._id);
      setTeams((current) => current.filter((item) => item._id !== team._id));
      setFeedback(`${team.name} was deleted.`);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (isLoading) return <div className="account-page"><p role="status">Loading your organization...</p></div>;

  return (
    <div className="account-page organization-page">
      <PageTitle title="Organization & teams" subtitle="Set your workspace name and manage teams and their members." />
      {error && <p className="page-error" role="alert">{error}</p>}
      {feedback && <p className="page-feedback" role="status">{feedback}</p>}

      <Card title="Organization" description="This name is saved to your account and shared across your workspace.">
        <form className="account-form-inline" onSubmit={handleOrganizationSave}>
          <label className="form-field" htmlFor="organization-name">Organization name
            <input id="organization-name" value={organization} onChange={(event) => setOrganization(event.target.value)} maxLength="100" placeholder="Your organization" />
          </label>
          <Button type="submit" disabled={isSavingOrganization}>{isSavingOrganization ? "Saving..." : "Save organization"}</Button>
        </form>
      </Card>

      <Card title="Create a team" description="Teams and member lists belong to your workspace account.">
        <form className="account-form-inline" onSubmit={handleCreateTeam}>
          <label className="form-field" htmlFor="new-team-name">Team name
            <input id="new-team-name" value={teamName} onChange={(event) => setTeamName(event.target.value)} maxLength="100" required />
          </label>
          <label className="form-field" htmlFor="new-team-description">Description
            <input id="new-team-description" value={teamDescription} onChange={(event) => setTeamDescription(event.target.value)} maxLength="500" />
          </label>
          <Button type="submit">Create team</Button>
        </form>
      </Card>

      <section className="team-list" aria-label="Your teams">
        {!teams.length && <Card title="No teams yet" description="Create a team above to start adding members." />}
        {teams.map((team) => {
          const draft = memberDrafts[team._id] || { name: "", email: "", role: "Member" };
          return (
            <Card className="team-card" key={team._id}>
              {editingTeam?.id === team._id ? (
                <div className="team-edit-form">
                  <label className="form-field">Team name<input value={editingTeam.name} onChange={(event) => setEditingTeam({ ...editingTeam, name: event.target.value })} maxLength="100" /></label>
                  <label className="form-field">Description<input value={editingTeam.description} onChange={(event) => setEditingTeam({ ...editingTeam, description: event.target.value })} maxLength="500" /></label>
                  <div className="team-actions">
                    <Button onClick={() => handleTeamSave(team._id)}>Save team</Button>
                    <Button variant="secondary" onClick={() => setEditingTeam(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="team-heading">
                  <div><h2>{team.name}</h2><p>{team.description || "No description yet."}</p></div>
                  <div className="team-actions">
                    <Button variant="secondary" onClick={() => setEditingTeam({ id: team._id, name: team.name, description: team.description || "" })}>Edit</Button>
                    <Button variant="secondary" onClick={() => handleTeamDelete(team)}>Delete</Button>
                  </div>
                </div>
              )}
              <h3>Members ({team.members?.length || 0})</h3>
              <ul className="team-member-list">
                {(team.members || []).map((member, index) => (
                  <li key={`${member.email}-${index}`}>
                    <span><strong>{member.name}</strong><small>{member.email} · {member.role}</small></span>
                    <Button variant="secondary" onClick={() => handleMemberRemove(team, index)} aria-label={`Remove ${member.name}`}>Remove</Button>
                  </li>
                ))}
                {!team.members?.length && <li><span>No members added yet.</span></li>}
              </ul>
              <form className="team-member-form" onSubmit={(event) => handleMemberAdd(event, team)}>
                <label className="form-field">Name<input value={draft.name} onChange={(event) => setMemberDrafts((current) => ({ ...current, [team._id]: { ...draft, name: event.target.value } }))} required /></label>
                <label className="form-field">Email<input type="email" value={draft.email} onChange={(event) => setMemberDrafts((current) => ({ ...current, [team._id]: { ...draft, email: event.target.value } }))} required /></label>
                <label className="form-field">Role<input value={draft.role} onChange={(event) => setMemberDrafts((current) => ({ ...current, [team._id]: { ...draft, role: event.target.value } }))} maxLength="60" /></label>
                <Button type="submit" disabled={(team.members?.length || 0) >= 50}>Add member</Button>
              </form>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

export default Organization;
