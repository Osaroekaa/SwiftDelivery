import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignUpPage.css";

export default function SignUpPage() {
  const [name, setName] = useState("");
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

  const isStrongPassword = (value) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!isStrongPassword(password)) {
      alert("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character");
      return;
    }

    const userProfile = {
      name: name,
      email: email,
      phone: "",
      address: "",
      joinDate: new Date().toLocaleDateString()
    };
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    localStorage.setItem("authToken", "sample_token");
    navigate("/home");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
          />
          <input
            type="text"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
          <div className="password-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
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
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        <p className="redirect-text">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log In
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