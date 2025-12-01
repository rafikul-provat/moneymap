import React from "react";

const Navbar = ({ username, onLogout }) => {
  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="brand">Money Map</div>
      </div>

      <div className="nav-right">
        <div className="nav-user">Hi, <strong>{username}</strong></div>
        <button className="nav-logout" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
