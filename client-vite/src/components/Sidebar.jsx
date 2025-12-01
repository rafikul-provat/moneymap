import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome, FiBarChart2, FiPercent, FiCreditCard, FiLogOut, FiMenu
} from "react-icons/fi";
import "./Sidebar.css";


const Sidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      <div className="brand">
        <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>
          <FiMenu size={20} />
        </button>
        {!collapsed && <h1>Money Map</h1>}
      </div>

      <nav className="nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          <FiHome size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
          <FiBarChart2 size={20} />
          {!collapsed && <span>Reports</span>}
        </NavLink>


        <NavLink to="/wallet" className={({ isActive }) => (isActive ? "active" : "")}>
          <FiCreditCard size={20} />
          {!collapsed && <span>Wallet</span>}
        </NavLink>
      </nav>

      <div className="footer">
        <button className="logout" onClick={onLogout}>
          <FiLogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
