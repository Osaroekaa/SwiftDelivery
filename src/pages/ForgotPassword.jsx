import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (email) {
      alert("Password reset link sent to " + email);
    } else {
      alert("Enter your registered email or phone");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2 className="forgot-title">Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="text"
            placeholder="Enter Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-input"
          />
          <button type="submit" className="forgot-button">
            Send Reset Link
          </button>
        </form>

        <p className="back-login">
          <Link to="/login" className="link">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
