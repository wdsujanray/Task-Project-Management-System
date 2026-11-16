const STORAGE_KEY = "taskflowPreferences";

export const defaultPreferences = {
  theme: "light",
  compactMode: false,
  taskReminders: true,
};

export function getPreferences() {
  try {
    return { ...defaultPreferences, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...defaultPreferences };
  }
}

export function applyPreferences(preferences) {
  document.documentElement.dataset.theme = preferences.theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.density = preferences.compactMode ? "compact" : "comfortable";
}

export function savePreferences(preferences) {
  const nextPreferences = { ...defaultPreferences, ...preferences };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
  applyPreferences(nextPreferences);
  return nextPreferences;
}
