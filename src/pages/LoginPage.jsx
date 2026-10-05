import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "1 number", met: /\d/.test(password) },
    { label: "1 special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

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
          <div className="password-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="password-checklist" aria-live="polite">
            {passwordChecks.map((item) => (
              <div key={item.label} className={`password-check ${item.met ? "met" : ""}`}>
                <span className="password-check-mark">{item.met ? "✓" : "○"}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
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
