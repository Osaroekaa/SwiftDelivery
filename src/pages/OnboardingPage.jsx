import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaArrowLeft, 
  FaUtensils, 
  FaBox, 
  FaCouch,
  FaTruck,
  FaClock,
  FaMapMarkerAlt,
  FaWallet
} from "react-icons/fa";
import "./OnboardingPage.css";

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Welcome To",
      subtitle: "SwiftDelivery",
      description: "Your trusted partner for fast and reliable deliveries across Nigeria",
      icon: FaMapMarkerAlt,
      illustration: "🚚",
      color: "#28a745"
    },
    {
      title: "Multiple Services",
      subtitle: "All In One App",
      description: "Food, Parcels, Furniture, and Relocation services - we deliver it all for you",
      icon: FaBox,
      illustration: "📦🍔🛋",
      color: "#17a2b8"
    },
    {
      title: "Fast & Reliable",
      subtitle: "Instant Delivery",
      description: "Get your items delivered within hours with real-time tracking and updates",
      icon: FaClock,
      illustration: "⚡",
      color: "#ffc107"
    },
    {
      title: "Safe & Secure",
      subtitle: "Payment System",
      description: "Easy wallet payments with secure transactions and transparent pricing",
      icon: FaWallet,
      illustration: "💳",
      color: "#28a745"
    },
    {
      title: "Ready To Start?",
      subtitle: "Let's Get Going!",
      description: "Join thousands of satisfied customers and experience the best delivery service",
      icon: FaArrowRight,
      illustration: "🎉",
      color: "#dc3545"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Navigate to signup on last slide
      navigate("/signup");
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      // Go back to splash screen
      navigate("/splash");
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleSkip = () => {
    navigate("/signup");
  };

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const isFirstSlide = currentSlide === 0;

  return (
    <div className="onboarding-container">
      {/* Skip Button */}
      <button className="skip-btn" onClick={handleSkip}>
        Skip
      </button>

      {/* Main Slide Card */}
      <div className="slide-card">
        {/* Slide Content */}
        <div className="slide-content">
          <div className="slide-illustration">
            <span className="illustration-emoji">{currentSlideData.illustration}</span>
          </div>
          
          <div className="slide-text-card">
            <h1 className="slide-title">{currentSlideData.title}</h1>
            <h2 className="slide-subtitle" style={{ color: currentSlideData.color }}>
              {currentSlideData.subtitle}
            </h2>
            <p className="slide-description">{currentSlideData.description}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="slide-navigation">
          <button 
            className="nav-btn back-btn" 
            onClick={handleBack}
            disabled={isFirstSlide}
          >
            <FaArrowLeft className="btn-icon" />
            {isFirstSlide ? "Splash" : "Back"}
          </button>

          <button 
            className="nav-btn next-btn" 
            onClick={handleNext}
            style={{ backgroundColor: currentSlideData.color }}
          >
            {isLastSlide ? "Get Started" : "Next"}
            <FaArrowRight className="btn-icon" />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="progress-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            style={{
              backgroundColor: index === currentSlide ? currentSlideData.color : '#e0e0e0'
            }}
          />
        ))}
      </div>
      </div>
  );
}