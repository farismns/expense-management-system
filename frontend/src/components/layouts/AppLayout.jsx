import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { api } from "../../api.js";

function AppLayout() {
  const [name, setName] = useState("My Account");
  useEffect(() => { queueMicrotask(async () => { try { const result = await api.getMyProfile(); setName(result?.data?.user?.fullname || "My Account"); } catch { setName("My Account"); } }); }, []);
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
