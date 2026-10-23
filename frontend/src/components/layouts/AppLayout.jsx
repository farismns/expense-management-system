import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

function AppLayout() {
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
            <div className="account-avatar">U</div>
            <span>My Account</span>
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
