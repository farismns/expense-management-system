import { NavLink, useNavigate } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Transactions", path: "/transactions" },
  { label: "Categories", path: "/categories" },
  { label: "Budgets", path: "/budgets" },
  { label: "My Profile", path: "/profile" },
];

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">E</div>
        <span>Expense Manager</span>
      </div>

      <p className="sidebar-label">MENU</p>

      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </aside>
  );
}

export default Sidebar;
