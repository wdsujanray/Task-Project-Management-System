import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/ui/PageTitle";
import { getPreferences, savePreferences } from "../../services/preferences";

function Settings() {
  const [preferences, setPreferences] = useState(getPreferences);
  const [saved, setSaved] = useState(false);

  const updatePreference = (name, value) => {
    const updated = savePreferences({ ...preferences, [name]: value });
    setPreferences(updated);
    setSaved(true);
  };

  return (
    <div className="account-page settings-page">
      <PageTitle title="Settings" subtitle="Personalize how TaskFlow looks and how your workspace behaves in this browser." />

      <Card title="Appearance" description="These settings apply across every page in this browser.">
        <div className="preference-row">
          <label htmlFor="theme-setting"><strong>Color theme</strong><small>Choose the appearance for your workspace.</small></label>
          <select id="theme-setting" value={preferences.theme} onChange={(event) => updatePreference("theme", event.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="preference-row">
          <label htmlFor="compact-setting"><strong>Compact layout</strong><small>Reduce spacing on cards and lists.</small></label>
          <input id="compact-setting" type="checkbox" checked={preferences.compactMode} onChange={(event) => updatePreference("compactMode", event.target.checked)} />
        </div>
      </Card>

      <Card title="Task reminders" description="Control reminders shown by this workspace.">
        <div className="preference-row">
          <label htmlFor="reminder-setting"><strong>In-app task reminders</strong><small>Keep task deadline reminders enabled in your workspace.</small></label>
          <input id="reminder-setting" type="checkbox" checked={preferences.taskReminders} onChange={(event) => updatePreference("taskReminders", event.target.checked)} />
        </div>
      </Card>
      <Card title="Recycle Bin" description="Restore deleted projects and tasks or remove them permanently.">
        <Link className="btn secondary" to="/recycle-bin">Open Recycle Bin</Link>
      </Card>
      {saved && <p className="page-feedback" role="status">Preferences saved and applied.</p>}
    </div>
  );
}

export default Settings;
