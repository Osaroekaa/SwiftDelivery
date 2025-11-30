import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./splashPage.css";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding"); // always go to onboarding
    }, 5000); // 5s splash

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <h1 className="splash-logo">FoodCourt</h1>
      <p className="splash-tagline">Swift. Easy. Green.</p>
    </div>
  );
}
