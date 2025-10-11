import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaCrosshairs } from "react-icons/fa";
import axios from "axios";
import BottomNav from "../component/BottomNav.jsx";
import "./pickupPage.css";
import React from "react";

export default function PickupPage() {
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [pickupPhone, setPickupPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.27127008794!2d7.3963895!3d9.05785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b3a49b4f9e5%3A0x90db79e5d6a2a86d!2sAbuja!5e1!3m2!1sen!2sng!4v1634146768892!5m2!1sen!2sng&zoom=14");
  const [streetNumber, setStreetNumber] = useState(""); // <-- Add this
  const [locationDescription, setLocationDescription] = useState(""); // <-- Add this

  const navigate = useNavigate();

  // Load saved pickup data on component mount
  useEffect(() => {
    const savedPickup = localStorage.getItem("pickup");
    if (savedPickup) {
      const pickup = JSON.parse(savedPickup);
      setPickupAddress(pickup.address);
      setPickupCoords(pickup.coords);
      setStreetNumber(pickup.streetNumber || "");
      setLocationDescription(pickup.locationDescription || "");
      if (pickup.coords) {
        updateMapUrl(pickup.coords[0], pickup.coords[1]);
      }
    }

    // Load saved phone number
    const savedPhone = localStorage.getItem("pickupPhone");
    if (savedPhone) {
      setPickupPhone(savedPhone);
    }
  }, []);

  // Update Google Maps embed URL with new coordinates
  const updateMapUrl = (lat, lng) => {
    // Enhanced embed URL with zoom controls and higher zoom level
    const enhancedMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2048.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDAnMDAuMCJOIDfCsDAwJzAwLjAiRQ!5e1!3m2!1sen!2sng!4v1634146768892!5m2!1sen!2sng&zoom=16`;
    setMapUrl(enhancedMapUrl);
  };

  // Search for pickup location using address
  const handleSearchPickup = async () => {
    if (!pickupAddress.trim()) {
      alert("Please enter pickup address");
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJmOGE2MWYzMjBkOTQ1MDNiMWUyNmMxN2FjMGRkNTI1IiwiaCI6Im11cm11cjY0In0=";
      const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
        pickupAddress
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
      setPickupCoords([lat, lng]);
      
      // Update map
      updateMapUrl(lat, lng);
      
      // Save to localStorage
      const pickup = {
        address: pickupAddress,
        coords: [lat, lng],
        streetNumber: streetNumber,
        locationDescription: locationDescription,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("pickup", JSON.stringify(pickup));
      localStorage.setItem("pickupPhone", pickupPhone);

      alert("Location found and saved!");
      
    } catch (err) {
      console.error("Pickup search failed:", err);
      alert("Could not find pickup location. Please try again.");
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
        
        setPickupCoords([lat, lng]);
        updateMapUrl(lat, lng);
        
        // Reverse geocode to get address
        try {
          const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJmOGE2MWYzMjBkOTQ1MDNiMWUyNmMxN2FjMGRkNTI1IiwiaCI6Im11cm11cjY0In0=";
          const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lng}&point.lat=${lat}`;
          
          const response = await axios.get(url);
          if (response.data.features.length > 0) {
            const address = response.data.features[0].properties.label;
            setPickupAddress(address);
          } else {
            setPickupAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setPickupAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }

        // Save to localStorage
        const pickup = {
          address: pickupAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          coords: [lat, lng],
          streetNumber: streetNumber,
          locationDescription: locationDescription,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem("pickup", JSON.stringify(pickup));
        localStorage.setItem("pickupPhone", pickupPhone);
        
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

  // Handle continue to dropoff
  const handleContinue = () => {
    if (!pickupAddress.trim()) {
      alert("Please enter or select a pickup address first");
      return;
    }

    if (!pickupPhone.trim()) {
      alert("Please enter a contact phone number");
      return;
    }

    // Save phone number to localStorage
    localStorage.setItem("pickupPhone", pickupPhone);

    // Ensure pickup data is saved
    if (!pickupCoords) {
      // If no coordinates but has address, save what we have
      const pickup = {
        address: pickupAddress,
        coords: null,
        streetNumber: streetNumber,
        locationDescription: locationDescription,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("pickup", JSON.stringify(pickup));
    }

    navigate("/dropoff");
  };

  return (
    <div className="pickup-container">
      {/* Header */}
      <h2>Select Pickup Location</h2>
      
      <div className="pickup-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* Input Fields */}
      <div className="pickup-form">
        <div className="address-input-container">
          <input
            type="text"
            placeholder="Enter pickup address (e.g., Victoria Island, Lagos)"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchPickup()}
          />
          <div className="location-buttons">
            <button 
              type="button"
              onClick={handleSearchPickup} 
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
          placeholder="Street number, landmark, or bus stop (e.g., No. 45, Near Shoprite)"
          value={streetNumber}
          onChange={(e) => setStreetNumber(e.target.value)}
          className="street-number-input"
        />
        
        <textarea
          placeholder="Describe pickup location (optional - e.g., Blue gate, beside pharmacy, 2nd floor)"
          value={locationDescription}
          onChange={(e) => setLocationDescription(e.target.value)}
          className="location-description"
          rows={3}
        />
        
        <input 
          type="tel"
          placeholder="Contact phone number"
          value={pickupPhone}
          onChange={(e) => setPickupPhone(e.target.value)}
        />
      </div>

      {/* Location Status */}
      {pickupAddress && (
        <div className="location-status">
          <FaMapMarkerAlt className="status-icon" />
          <div className="location-details">
            <span className="saved-address">{pickupAddress}</span>
            {streetNumber && <span className="street-info">{streetNumber}</span>}
            {locationDescription && <span className="description-info">{locationDescription}</span>}
          </div>
        </div>
      )}

      {/* Map Preview */}
      <div className="map-preview">
        <iframe
          title="Pickup Location Map"
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

      {/* Continue Button */}
      <button 
        className="continue-btn" 
        onClick={handleContinue}
        disabled={!pickupAddress.trim() || !pickupPhone.trim()}
      >
        Continue to Drop-off <FaArrowRight className="btn-icon" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}