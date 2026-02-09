import "./SettingsDrawer.css";

export default function SettingsDrawer({
  open,
  onClose,
  theme,
  setTheme,
  refreshInterval,
  setRefreshInterval,
  slaLimit,
  setSlaLimit,
}) {
  if (!open) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className={`settings-drawer ${theme}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Settings</h3>

        {/* THEME */}
        <div className="setting-item">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* REFRESH */}
        <div className="setting-item">
          <label>Auto Refresh (sec)</label>
          <input
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(+e.target.value)}
          />
        </div>

        {/* SLA */}
        <div className="setting-item">
          <label>SLA Limit (sec)</label>
          <input
            type="number"
            value={slaLimit}
            onChange={(e) => setSlaLimit(+e.target.value)}
          />
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
