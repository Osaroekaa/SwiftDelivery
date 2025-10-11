import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      // Save user profile to localStorage (mock for login)
      const userProfile = {
        name: email,
        email: email,
        phone: "",
        address: "",
        joinDate: new Date().toLocaleDateString()
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("authToken", "sample_token");
      navigate("/home"); // go to home
    } else {
      alert("Enter both fields");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <p className="redirect-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </p>

        <p className="forgot-password">
          <Link to="/forgot-password" className="link">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
