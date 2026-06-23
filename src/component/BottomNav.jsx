// src/components/BottomNav.js
import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaHistory, FaUser } from "react-icons/fa";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaHome size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaHistory size={20} />
        <span>History</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaUser size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
