import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingsDrawer from "../settings/SettingsDrawer";
import { useAuthStore } from "../auth/auth.store";
import "./Orders.css";
import AnalyticsModal from "../analytics/AnalyticsModal";
import { useOrdersStore } from "./orders.store";
import Header from "./components/header/Header";
import OfflineBanner from "../../shared/components/OfflineBanner";
import OrderBoard from "./components/OrderBord";
import { useDebounce } from "../../shared/hooks/useDebounce";

export default function OrdersPage() {
  const [openSettings, setOpenSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [slaLimit, setSlaLimit] = useState(120);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const orders = useOrdersStore((s) => s.orders);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // Offline detection
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Use debounce hook
  const debouncedSearch = useDebounce(searchText, 300);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!debouncedSearch) return orders;
    return orders.filter((order) => {
      const searchNum = Number(debouncedSearch);
      const tableMatch = !isNaN(searchNum) && order.table === searchNum;
      const itemMatch = order.items.some((i) =>
        i.name.toLowerCase().includes(debouncedSearch),
      );
      return tableMatch || itemMatch;
    });
  }, [orders, debouncedSearch]);

  // Login check
  const loginUser = JSON.parse(localStorage.getItem("kot_user"));
  useEffect(() => {
    if (!loginUser) navigate("/", { replace: true });
  }, [loginUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!loginUser) return null;

  return (
    <div className={`kot-page ${theme}`}>
      {isOffline && <OfflineBanner />}
      <Header
        loginUser={loginUser}
        searchText={searchText}
        setSearchText={setSearchText}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        onLogout={handleLogout}
        onOpenSettings={() => setOpenSettings(true)}
        onOpenAnalytics={() => setShowAnalytics(true)}
      />
      <OrderBoard
        orders={filteredOrders}
        slaLimit={slaLimit}
        refreshInterval={refreshInterval}
      />
      {loginUser.role === "manager" && (
        <AnalyticsModal
          show={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      )}
      <SettingsDrawer
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        theme={theme}
        setTheme={setTheme}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
        slaLimit={slaLimit}
        setSlaLimit={setSlaLimit}
      />
    </div>
  );
}
