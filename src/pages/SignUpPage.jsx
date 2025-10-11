import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (name && email && password) {
      // Save user profile to localStorage
      const userProfile = {
        name: name,
        email: email,
        phone: "",
        address: "",
        joinDate: new Date().toLocaleDateString()
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("authToken", "sample_token");
      navigate("/home"); // Go to home after signup
    } else {
      alert("Please fill in all fields");
    }
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
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
