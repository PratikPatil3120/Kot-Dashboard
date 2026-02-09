import { FiSettings, FiLogOut } from "react-icons/fi";
import { FaCircleUser } from "react-icons/fa6";
import "./Header.css";

export default function Header({
  loginUser,
  searchText,
  setSearchText,
  showUserMenu,
  setShowUserMenu,
  onLogout,
  onOpenSettings,
  onOpenAnalytics,
}) {
  return (
    <header className="kot-header">
      {/* LEFT: Title */}
      <div>
        <h1>KOT Dashboard</h1>
        <b className="kot-subtitle">Live kitchen order tracking</b>
      </div>

      {/* RIGHT: Search + Analytics + Settings + User */}
      <div className="header-right">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="header-search"
        />

        {loginUser.role === "manager" && (
          <>
            <button className="analytics-btn" onClick={onOpenAnalytics}>
              📊 Analytics
            </button>

            <button className="settings-btn" onClick={onOpenSettings}>
              <FiSettings size={24} />
            </button>
          </>
        )}

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu((prev) => !prev)}
          >
            <FaCircleUser size={30} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div>
                {loginUser.name} ({loginUser.role})
              </div>
              <button className="logout-btn" onClick={onLogout}>
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
