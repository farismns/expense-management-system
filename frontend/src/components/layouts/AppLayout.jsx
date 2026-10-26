import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function AppLayout() {
  const { user } = useAuth();
  const name = user?.fullname || "My Account";
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <header className="topbar">
          <div>
            <p className="topbar-eyebrow">PERSONAL FINANCE</p>
            <h2>Expense Management System</h2>
          </div>

          <div className="account-info">
            <div className="account-avatar">{name.slice(0, 1).toUpperCase()}</div>
            <span>{name}</span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
