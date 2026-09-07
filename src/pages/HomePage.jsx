import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaMapMarkerAlt, 
  FaUtensils,
  FaBox,
  FaCouch,
  FaTruck,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaSpinner
} from "react-icons/fa";
import BottomNav from "../component/BottomNav.jsx";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState("instant");
  const [selectedService, setSelectedService] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Getting location...");
  const [userBalance, setUserBalance] = useState(0);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Service categories with icons and details
  const services = [
    { 
      id: "food", 
      name: "Food", 
      icon: FaUtensils, 
      emoji: "🍔", 
      description: "Restaurant deliveries, groceries",
      available: true 
    },
    { 
      id: "parcel", 
      name: "Parcel", 
      icon: FaBox, 
      emoji: "📦", 
      description: "Documents, packages, gifts",
      available: true 
    },
    { 
      id: "furniture", 
      name: "Furniture", 
      icon: FaCouch, 
      emoji: "🛋", 
      description: "Home appliances, furniture",
      available: true 
    },
    { 
      id: "relocation", 
      name: "Relocation", 
      icon: FaTruck, 
      emoji: "🚚", 
      description: "Moving services, bulk items",
      available: false 
    }
  ];

  useEffect(() => {
    // Load user data and previously saved selections
    loadUserData();
    loadSavedSelections();
    getCurrentLocation();
    
    // Listen for balance updates from other pages
    const handleStorageChange = (e) => {
      if (e.key === 'userBalance') {
        setUserBalance(Number(e.newValue || 0));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for balance updates on focus
    const handleFocus = () => {
      const balance = localStorage.getItem("userBalance");
      setUserBalance(Number(balance || 0));
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation("Location not supported");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get readable address
          const response = await fetch(
            `https://api.openrouteservice.org/geocode/reverse?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJmOGE2MWYzMjBkOTQ1MDNiMWUyNmMxN2FjMGRkNTI1IiwiaCI6Im11cm11cjY0In0=&point.lon=${longitude}&point.lat=${latitude}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              const address = data.features[0].properties.label;
              // Extract city and country or use first part of address
              const shortAddress = address.split(',').slice(-2).join(',').trim();
              setCurrentLocation(shortAddress || address);
            } else {
              setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } else {
            setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          setCurrentLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to Lagos, Nigeria
        setCurrentLocation("Lagos, Nigeria");
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  };

  const loadUserData = () => {
    // Load and constantly update user balance
    const balance = localStorage.getItem("userBalance");
    setUserBalance(Number(balance || 2500)); // Default to 2500 if no balance set
  };

  const loadSavedSelections = () => {
    // Load previously saved delivery note
    const savedNote = localStorage.getItem("deliveryNote");
    if (savedNote) {
      setDeliveryNote(savedNote);
    }

    // Load previously selected service
    const savedService = localStorage.getItem("selectedService");
    if (savedService) {
      setSelectedService(savedService);
    }

    // Load delivery type preference
    const savedType = localStorage.getItem("deliveryType");
    if (savedType) {
      setDeliveryType(savedType);
    }
    
    // Load scheduled date and time
    const savedDate = localStorage.getItem("scheduledDate");
    const savedTime = localStorage.getItem("scheduledTime");
    if (savedDate) setScheduledDate(savedDate);
    if (savedTime) setScheduledTime(savedTime);
  };

  const handleServiceSelect = (serviceId) => {
    if (!services.find(s => s.id === serviceId)?.available) {
      return;
    }
    
    setSelectedService(serviceId);
    localStorage.setItem("selectedService", serviceId);
  };

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
    localStorage.setItem("deliveryType", type);
  };

  const handleNoteChange = (e) => {
    const note = e.target.value;
    if (note.length <= 200) { // Limit to 200 characters
      setDeliveryNote(note);
      localStorage.setItem("deliveryNote", note);
    }
  };

  const handleScheduledDateChange = (e) => {
    const date = e.target.value;
    setScheduledDate(date);
    localStorage.setItem("scheduledDate", date);
  };

  const handleScheduledTimeChange = (e) => {
    const time = e.target.value;
    setScheduledTime(time);
    localStorage.setItem("scheduledTime", time);
  };

  const validateScheduledDelivery = () => {
    if (!scheduledDate) {
      alert("Please select a delivery date.");
      return false;
    }
    
    if (!scheduledTime) {
      alert("Please select a delivery time.");
      return false;
    }
    
    // Check if selected date/time is in the future
    const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();
    
    if (selectedDateTime <= now) {
      alert("Please select a future date and time for scheduled delivery.");
      return false;
    }
    
    // Check if it's within reasonable limits (e.g., within next 30 days)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    
    if (selectedDateTime > maxDate) {
      alert("Scheduled delivery can only be set up to 30 days in advance.");
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    // Validate service selection
    if (!selectedService) {
      alert("Please select a delivery service type first.");
      return;
    }

    // Validate scheduled delivery if selected
    if (deliveryType === "scheduled") {
      if (!validateScheduledDelivery()) {
        return;
      }
    }

    // Save all selections before continuing
    localStorage.setItem("selectedService", selectedService);
    localStorage.setItem("deliveryType", deliveryType);
    localStorage.setItem("deliveryNote", deliveryNote);
    
    if (deliveryType === "scheduled") {
      localStorage.setItem("scheduledDate", scheduledDate);
      localStorage.setItem("scheduledTime", scheduledTime);
      localStorage.setItem("scheduledDateTime", `${scheduledDate}T${scheduledTime}`);
    }

    // Clear any previous order data to start fresh
    localStorage.removeItem("pickup");
    localStorage.removeItem("dropoff");
    localStorage.removeItem("estimatedPrice");
    localStorage.removeItem("routeInfo");
    localStorage.removeItem("currentOrder");

    navigate("/pickup");
  };

  // Get minimum date (today) and maximum date (30 days from now)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Get minimum time if today is selected
  const getMinTime = () => {
    if (scheduledDate === getMinDate()) {
      const now = new Date();
      now.setHours(now.getHours() + 2); // Minimum 2 hours from now
      return now.toTimeString().slice(0, 5);
    }
    return "06:00"; // 6 AM for future dates
  };

  return (
    <div className="home-container">
      {/* Location Header */}
      <div className="location-header">
        <div className="location-section">
          <FaMapMarkerAlt className="location-icon" />
          <div className="location-info">
            <span className="location-label">Current Location</span>
            <div className="location-text">
              {isLoadingLocation ? (
                <span className="loading-location">
                  <FaSpinner className="spinner" />
                  Getting location...
                </span>
              ) : (
                currentLocation
              )}
            </div>
          </div>
        </div>
        <div className="profile-section">
          <div className="profile-info"></div>
          <div className="balance-info">
          <FaUser className="profile-icon" />
            <span className="balance-amount">₦{userBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <h2 className="page-title">What are you sending?</h2>

      {/* Delivery Type Toggle */}
      <div className="delivery-type">
        <button
          className={`delivery-type-btn ${deliveryType === "instant" ? "active" : ""}`}
          onClick={() => handleDeliveryTypeChange("instant")}
        >
          <FaClock className="type-icon" />
          <span>Instant</span>
        </button>
        <button
          className={`delivery-type-btn ${deliveryType === "scheduled" ? "active" : ""}`}
          onClick={() => handleDeliveryTypeChange("scheduled")}
        >
          <FaCalendarAlt className="type-icon" />
          <span>Scheduled</span>
        </button>
      </div>

      {/* Scheduled Delivery DateTime Selection */}
      {deliveryType === "scheduled" && (
        <div className="scheduled-section">
          <h4 className="scheduled-title">Select Delivery Date & Time</h4>
          <div className="datetime-inputs">
            <div className="date-input-group">
              <label htmlFor="delivery-date">Date</label>
              <input
                type="date"
                id="delivery-date"
                value={scheduledDate}
                onChange={handleScheduledDateChange}
                min={getMinDate()}
                max={getMaxDate()}
                className="date-input"
              />
            </div>
            <div className="time-input-group">
              <label htmlFor="delivery-time">Time</label>
              <input
                type="time"
                id="delivery-time"
                value={scheduledTime}
                onChange={handleScheduledTimeChange}
                min={getMinTime()}
                max="22:00"
                className="time-input"
              />
            </div>
          </div>
          <div className="schedule-info">
            <span>📅 Delivery available 6:00 AM - 10:00 PM</span>
            <span>⏰ Minimum 2 hours advance booking</span>
          </div>
        </div>
      )}

      {/* Service Categories */}
      <div className="service-grid">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className={`service-card ${
                selectedService === service.id ? "selected" : ""
              } ${!service.available ? "disabled" : ""}`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <div className="service-icon">
                <IconComponent className="icon" />
                <span className="emoji">{service.emoji}</span>
              </div>
              <div className="service-content">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                {!service.available && (
                  <span className="coming-soon">Coming Soon</span>
                )}
              </div>
              {selectedService === service.id && service.available && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Product Description */}
      <div className="note-section">
        <label htmlFor="delivery-note" className="note-label">
          Describe what you're sending (Optional)
        </label>
        <textarea
          id="delivery-note"
          className="note-input"
          placeholder="Describe your item for better handling (e.g., 'Fresh vegetables', '2 documents in envelope', 'Fragile electronics')..."
          value={deliveryNote}
          onChange={handleNoteChange}
          rows={3}
          maxLength={200}
        />
        <div className="note-counter">
          {deliveryNote.length}/200 characters
        </div>
      </div>

      {/* Promo Banner */}
      <div className="banner">
        <span className="banner-emoji">🎉</span>
        <span className="banner-text">First Delivery Is Free!!!</span>
        <span className="banner-badge">NEW</span>
      </div>

      {/* Selection Reminder */}
      {!selectedService && (
        <div className="selection-reminder">
          <span>Please select a delivery service type above to continue</span>
        </div>
      )}

      {/* Validation Messages for Scheduled */}
      {deliveryType === "scheduled" && selectedService && (!scheduledDate || !scheduledTime) && (
        <div className="validation-reminder">
          <span>Please select both date and time for scheduled delivery</span>
        </div>
      )}

      {/* Continue Button */}
      <button 
        className={`continue-btn ${
          !selectedService || 
          (deliveryType === "scheduled" && (!scheduledDate || !scheduledTime)) 
            ? "disabled" : ""
        }`}
        onClick={handleContinue}
        disabled={
          !selectedService || 
          (deliveryType === "scheduled" && (!scheduledDate || !scheduledTime))
        }
      >
        <span>
          {deliveryType === "scheduled" && scheduledDate && scheduledTime
            ? `Schedule for ${new Date(scheduledDate).toLocaleDateString()} at ${scheduledTime}`
            : "Continue to Pickup"
          }
        </span>
        <FaArrowRight className="btn-icon" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}