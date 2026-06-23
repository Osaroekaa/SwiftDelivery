import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaCrosshairs, FaCheck } from "react-icons/fa";
import axios from "axios";
import BottomNav from "../component/BottomNav.jsx";
import "./DropoffPage.css";
import React from "react";

export default function DropoffPage() {
  // Pickup data from localStorage
  const [pickupData, setPickupData] = useState(null);
  
  // Dropoff form states
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [dropoffPhone, setDropoffPhone] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.27127008794!2d7.3963895!3d9.05785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b3a49b4f9e5%3A0x90db79e5d6a2a86d!2sAbuja!5e1!3m2!1sen!2sng!4v1634146768892!5m2!1sen!2sng&zoom=14");
  
  // Price calculation
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  
  const navigate = useNavigate();

  // Load saved data on component mount
  useEffect(() => {
    // Load pickup data
    const savedPickup = localStorage.getItem("pickup");
    if (savedPickup) {
      const pickup = JSON.parse(savedPickup);
      setPickupData(pickup);
    } else {
      // If no pickup data, redirect to pickup page
      navigate("/pickup");
      return;
    }

    // Load saved dropoff data
    const savedDropoff = localStorage.getItem("dropoff");
    if (savedDropoff) {
      const dropoff = JSON.parse(savedDropoff);
      setDropoffAddress(dropoff.address);
      setDropoffCoords(dropoff.coords);
      setStreetNumber(dropoff.streetNumber || "");
      setLocationDescription(dropoff.locationDescription || "");
      if (dropoff.coords) {
        updateMapUrl(dropoff.coords[0], dropoff.coords[1]);
      }
    }

    // Load saved dropoff phone number
    const savedDropoffPhone = localStorage.getItem("dropoffPhone");
    if (savedDropoffPhone) {
      setDropoffPhone(savedDropoffPhone);
    }

    // Load saved estimated price
    const savedPrice = localStorage.getItem("estimatedPrice");
    if (savedPrice) {
      setEstimatedPrice(JSON.parse(savedPrice));
    }
  }, [navigate]);

  // Update Google Maps embed URL with new coordinates
  const updateMapUrl = (lat, lng) => {
    // Enhanced embed URL with zoom controls and higher zoom level
    const enhancedMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2048.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDAnMDAuMCJOIDfCsDAwJzAwLjAiRQ!5e1!3m2!1sen!2sng!4v1634146768892!5m2!1sen!2sng&zoom=16`;
    setMapUrl(enhancedMapUrl);
  };

  // Search for dropoff location using address
  const handleSearchDropoff = async () => {
    if (!dropoffAddress.trim()) {
      alert("Please enter dropoff address");
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJmOGE2MWYzMjBkOTQ1MDNiMWUyNmMxN2FjMGRkNTI1IiwiaCI6Im11cm11cjY0In0=";
      const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
        dropoffAddress
      )}`;

      const response = await axios.get(url);
      
      if (response.data.features.length === 0) {
        alert("Location not found. Please try a different address.");
        return;
      }

      const coords = response.data.features[0].geometry.coordinates; // [lng, lat]
      const lat = coords[1];
      const lng = coords[0];

      // Update state
      setDropoffCoords([lat, lng]);
      
      // Update map
      updateMapUrl(lat, lng);
      
      // Save to localStorage
      const dropoff = {
        address: dropoffAddress,
        coords: [lat, lng],
        streetNumber: streetNumber,
        locationDescription: locationDescription,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("dropoff", JSON.stringify(dropoff));
      localStorage.setItem("dropoffPhone", dropoffPhone);

      alert("Location found and saved!");
      
      // Auto-calculate price if we have both pickup and dropoff
      if (pickupData && pickupData.coords) {
        calculatePrice([lat, lng]);
      }
      
    } catch (err) {
      console.error("Dropoff search failed:", err);
      alert("Could not find dropoff location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setDropoffCoords([lat, lng]);
        updateMapUrl(lat, lng);
        
        // Reverse geocode to get address
        try {
          const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJmOGE2MWYzMjBkOTQ1MDNiMWUyNmMxN2FjMGRkNTI1IiwiaCI6Im11cm11cjY0In0=";
          const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lng}&point.lat=${lat}`;
          
          const response = await axios.get(url);
          if (response.data.features.length > 0) {
            const address = response.data.features[0].properties.label;
            setDropoffAddress(address);
          } else {
            setDropoffAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setDropoffAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }

        // Save to localStorage
        const dropoff = {
          address: dropoffAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          coords: [lat, lng],
          streetNumber: streetNumber,
          locationDescription: locationDescription,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem("dropoff", JSON.stringify(dropoff));
        localStorage.setItem("dropoffPhone", dropoffPhone);
        
        // Auto-calculate price
        if (pickupData && pickupData.coords) {
          calculatePrice([lat, lng]);
        }
        
        alert("Current location detected and saved!");
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your current location. Please enter address manually.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Calculate straight-line distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Calculate delivery price based on route
  const calculatePrice = async (dropoffCoordinates = dropoffCoords) => {
    if (!pickupData?.coords || !dropoffCoordinates) {
      alert("Please set both pickup and dropoff locations first.");
      return;
    }

    setIsCalculatingPrice(true);
    try {
      const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJmOGE2MWYzMjBkOTQ1MDNiMWUyNmMxN2FjMGRkNTI1IiwiaCI6Im11cm11cjY0In0=";
      
      // Convert coordinates to [lng, lat] for OpenRouteService
      const pickupLngLat = [pickupData.coords[1], pickupData.coords[0]];
      const dropoffLngLat = [dropoffCoordinates[1], dropoffCoordinates[0]];

      let finalPrice, routeInfo;

      try {
        // Try OpenRouteService API first
        const response = await axios.post(
          `https://api.openrouteservice.org/v2/directions/driving-car`,
          {
            coordinates: [pickupLngLat, dropoffLngLat],
          },
          {
            headers: {
              Authorization: apiKey,
              'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
          }
        );

        const duration = response.data.routes[0].summary.duration; // in seconds
        const distance = response.data.routes[0].summary.distance; // in meters

        // Price calculation: ₦500 per hour
        const hours = duration / 3600;
        const calculatedPrice = Math.ceil(hours * 500);

        // Minimum price of ₦200
        finalPrice = Math.max(calculatedPrice, 200);

        // Save route info
        routeInfo = {
          duration: duration,
          distance: distance,
          durationText: `${Math.round(duration / 60)} minutes`,
          distanceText: `${(distance / 1000).toFixed(1)} km`,
          method: 'api'
        };

        console.log("API calculation successful:", { duration, distance, finalPrice });

      } catch (apiError) {
        console.warn("API calculation failed, using fallback method:", apiError.message);
        
        // Fallback: Calculate based on straight-line distance
        const distanceKm = calculateDistance(
          pickupData.coords[0], pickupData.coords[1],
          dropoffCoordinates[0], dropoffCoordinates[1]
        );

        // Estimate driving time: assume 30 km/h average speed in city traffic
        const estimatedHours = (distanceKm * 1.4) / 30; // 1.4 factor for actual road distance vs straight line
        const calculatedPrice = Math.ceil(estimatedHours * 500);

        // Minimum price of ₦200
        finalPrice = Math.max(calculatedPrice, 200);

        // Save route info
        routeInfo = {
          duration: estimatedHours * 3600,
          distance: distanceKm * 1400, // estimated road distance in meters
          durationText: `~${Math.round(estimatedHours * 60)} minutes`,
          distanceText: `~${distanceKm.toFixed(1)} km`,
          method: 'fallback'
        };

        console.log("Fallback calculation:", { distanceKm, estimatedHours, finalPrice });
      }

      setEstimatedPrice(finalPrice);
      localStorage.setItem("estimatedPrice", JSON.stringify(finalPrice));
      localStorage.setItem("routeInfo", JSON.stringify(routeInfo));

      alert(`Price calculated: ₦${finalPrice} ${routeInfo.method === 'fallback' ? '(estimated)' : ''}`);

    } catch (err) {
      console.error("Price calculation completely failed:", err);
      
      // Last resort: Simple distance-based pricing
      try {
        const distanceKm = calculateDistance(
          pickupData.coords[0], pickupData.coords[1],
          dropoffCoordinates[0], dropoffCoordinates[1]
        );

        // Simple pricing: ₦500 per hour + ₦200 minimum
        const estimatedHoursSimple = (distanceKm * 2) / 60; // 2 minutes per km
        const simplePrice = Math.max(200, Math.ceil(estimatedHoursSimple * 500));
        
        setEstimatedPrice(simplePrice);
        localStorage.setItem("estimatedPrice", JSON.stringify(simplePrice));
        
        const simpleRouteInfo = {
          duration: distanceKm * 120, // rough estimate: 2 minutes per km
          distance: distanceKm * 1000,
          durationText: `~${Math.round(distanceKm * 2)} minutes`,
          distanceText: `~${distanceKm.toFixed(1)} km`,
          method: 'simple'
        };
        localStorage.setItem("routeInfo", JSON.stringify(simpleRouteInfo));

        alert(`Price estimated: ₦${simplePrice} (based on distance)`);
        console.log("Simple calculation used:", { distanceKm, simplePrice });

      } catch (finalError) {
        console.error("All price calculation methods failed:", finalError);
        alert("Unable to calculate price. Please check your internet connection and try again.");
      }
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  // Handle continue to payment
  const handleContinue = () => {
    if (!dropoffAddress.trim()) {
      alert("Please enter or select a dropoff address first");
      return;
    }

    if (!dropoffPhone.trim()) {
      alert("Please enter a contact phone number");
      return;
    }

    if (!estimatedPrice) {
      alert("Please calculate the delivery price first by setting a location");
      return;
    }

    // Save dropoff phone number to localStorage
    localStorage.setItem("dropoffPhone", dropoffPhone);

    // Ensure dropoff data is saved
    if (!dropoffCoords) {
      // If no coordinates but has address, save what we have
      const dropoff = {
        address: dropoffAddress,
        coords: null,
        streetNumber: streetNumber,
        locationDescription: locationDescription,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("dropoff", JSON.stringify(dropoff));
    }

    navigate("/payment");
  };

  return (
    <div className="dropoff-container">
      {/* Header */}
      <h2>📍 Select Drop-off Location</h2>
      
      <div className="dropoff-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* Pickup Location Display */}
      {pickupData && (
        <div className="pickup-info">
          <h4>📦 Pickup Location:</h4>
          <div className="pickup-details">
            <span className="pickup-address">{pickupData.address}</span>
            {pickupData.streetNumber && <span className="pickup-street">{pickupData.streetNumber}</span>}
          </div>
        </div>
      )}

      {/* Input Fields */}
      <div className="dropoff-form">
        <div className="address-input-container">
          <input
            type="text"
            placeholder="Enter drop-off address (e.g., Ikeja, Lagos)"
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchDropoff()}
          />
          <div className="location-buttons">
            <button 
              type="button"
              onClick={handleSearchDropoff} 
              disabled={isLoading}
              className="search-btn"
              title="Search Address"
            >
              {isLoading ? "..." : <FaMapMarkerAlt />}
            </button>
            <button 
              type="button"
              onClick={handleGetCurrentLocation} 
              disabled={isLoading}
              className="current-location-btn"
              title="Use Current Location"
            >
              <FaCrosshairs />
            </button>
          </div>
        </div>
        
        <input 
          type="text"
          placeholder="Street number, landmark, or bus stop (e.g., No. 12, Near GTBank)"
          value={streetNumber}
          onChange={(e) => setStreetNumber(e.target.value)}
          className="street-number-input"
        />
        
        <textarea
          placeholder="Describe drop-off location (optional - e.g., White building, security post, 3rd floor)"
          value={locationDescription}
          onChange={(e) => setLocationDescription(e.target.value)}
          className="location-description"
          rows={3}
        />
        
        <input 
          type="tel"
          placeholder="Receiver's contact phone number"
          value={dropoffPhone}
          onChange={(e) => setDropoffPhone(e.target.value)}
        />
      </div>

      {/* Location Status */}
      {dropoffAddress && (
        <div className="location-status">
          <FaMapMarkerAlt className="status-icon" />
          <div className="location-details">
            <span className="saved-address">{dropoffAddress}</span>
            {streetNumber && <span className="street-info">{streetNumber}</span>}
            {locationDescription && <span className="description-info">{locationDescription}</span>}
          </div>
        </div>
      )}

      {/* Price Display */}
      {estimatedPrice && (
        <div className="price-display">
          <FaCheck className="price-icon" />
          <span className="price-text">Estimated Price: ₦{estimatedPrice?.toLocaleString()}</span>
          <button 
            className="recalculate-btn" 
            onClick={() => calculatePrice()}
            disabled={isCalculatingPrice}
            title="Recalculate Price"
          >
            {isCalculatingPrice ? "..." : "↻"}
          </button>
        </div>
      )}

      {/* Map Preview */}
      <div className="map-preview">
        <iframe
          title="Drop-off Location Map"
          src={mapUrl}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
        {isLoading && (
          <div className="map-loading-overlay">
            <div className="loading-spinner">Loading...</div>
          </div>
        )}
      </div>

      {/* Calculate Price Button (if price not calculated) */}
      {!estimatedPrice && dropoffCoords && (
        <button 
          className="calculate-price-btn" 
          onClick={() => calculatePrice()}
          disabled={isCalculatingPrice}
        >
          {isCalculatingPrice ? "Calculating..." : "Calculate Delivery Price"}
        </button>
      )}

      {/* Continue Button */}
      <button 
        className="continue-btn" 
        onClick={handleContinue}
        disabled={!dropoffAddress.trim() || !dropoffPhone.trim() || !estimatedPrice}
      >
        Continue to Payment <FaArrowRight className="btn-icon" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}