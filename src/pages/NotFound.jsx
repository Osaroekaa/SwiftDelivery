// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFoundPage() {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/home" className="back-home-btn">
        Go Back Home
      </Link>
    </div>
  );
}
