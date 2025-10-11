import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaPhone,
  FaTimes,
  FaBox,
  FaRoute
} from "react-icons/fa";
import BottomNav from "../component/BottomNav";
import "./TrackingPage.css";

export default function TrackingPage() {
  const navigate = useNavigate();
  
  // State for order tracking
  const [activeOrder, setActiveOrder] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStartTime, setOrderStartTime] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  // Delivery statuses with realistic timing
  const deliveryStatuses = [
    { 
      key: "pending", 
      label: "Order Confirmed", 
      icon: FaCheckCircle, 
      description: "Your order has been confirmed and is being prepared",
      duration: 2 // 2 minutes
    },
    { 
      key: "assigned", 
      label: "Driver Assigned", 
      icon: FaTruck, 
      description: "A driver has been assigned to your delivery",
      duration: 3 // 3 minutes
    },
    { 
      key: "pickup", 
      label: "Picked Up", 
      icon: FaBox, 
      description: "Your item has been collected from pickup location",
      duration: 5 // 5 minutes (travel time based on route)
    },
    { 
      key: "on_the_way", 
      label: "On The Way", 
      icon: FaRoute, 
      description: "Driver is on the way to drop-off location",
      duration: 0 // Variable based on route
    },
    { 
      key: "delivered", 
      label: "Delivered", 
      icon: FaCheckCircle, 
      description: "Your order has been successfully delivered",
      duration: 0
    }
  ];

  useEffect(() => {
    loadOrderData();
    simulateDeliveryProgress();
  }, []);

  const loadOrderData = () => {
    try {
      // Load active order from localStorage
      const savedOrder = localStorage.getItem("activeOrder");
      if (!savedOrder) {
        alert("No active order found. Please place an order first.");
        navigate("/home");
        return;
      }

      const order = JSON.parse(savedOrder);
      setActiveOrder(order);
      
      // Set order start time
      const startTime = new Date(order.timestamp);
      setOrderStartTime(startTime);
      
      // Generate map URL with pickup and dropoff
      generateMapUrl(order);
      
      // Generate mock driver info
      generateDriverInfo();
      
      // Calculate initial ETA based on route
      if (order.routeInfo) {
        setEstimatedTimeRemaining(Math.round(order.routeInfo.duration / 60)); // Convert to minutes
      } else {
        setEstimatedTimeRemaining(45); // Default 45 minutes
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading order data:", error);
      alert("Error loading tracking information.");
      navigate("/home");
    }
  };

  const generateMapUrl = (order) => {
    if (order.pickup?.coords && order.dropoff?.coords) {
      // Create a map showing both pickup and dropoff locations
      const pickupLat = order.pickup.coords[0];
      const pickupLng = order.pickup.coords[1];
      const dropoffLat = order.dropoff.coords[0];
      const dropoffLng = order.dropoff.coords[1];
      
      // Center map between pickup and dropoff
      const centerLat = (pickupLat + dropoffLat) / 2;
      const centerLng = (pickupLng + dropoffLng) / 2;
      
      const url = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDAnMDAuMCJOIDfCsDAwJzAwLjAiRQ!5e1!3m2!1sen!2sng!4v1634146768892!5m2!1sen!2sng&zoom=12`;
      setMapUrl(url);
    } else {
      // Default map of Lagos
      setMapUrl("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.27127008794!2d3.3792057!3d6.5243793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc692ba70413d8!2sLagos%2C%20Nigeria!5e1!3m2!1sen!2sng!4v1634146768892!5m2!1sen!2sng");
    }
  };

  const generateDriverInfo = () => {
    // Mock driver data
    const drivers = [
      { name: "Emeka Johnson", phone: "+234 801 234 5678", rating: 4.8 },
      { name: "Adebayo Ogundimu", phone: "+234 809 876 5432", rating: 4.7 },
      { name: "Chioma Nwankwo", phone: "+234 808 123 9876", rating: 4.9 },
      { name: "Ibrahim Musa", phone: "+234 805 456 7890", rating: 4.6 }
    ];
    
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    setDriverInfo(randomDriver);
  };

  const simulateDeliveryProgress = () => {
    // Start status progression simulation
    let currentStatusIndex = 0;
    
    const progressDelivery = () => {
      if (currentStatusIndex < deliveryStatuses.length - 1) {
        const currentStatusData = deliveryStatuses[currentStatusIndex];
        setCurrentStatus(currentStatusData.key);
        
        // Calculate time remaining
        let remainingTime = 0;
        for (let i = currentStatusIndex; i < deliveryStatuses.length - 1; i++) {
          remainingTime += deliveryStatuses[i].duration;
        }
        setEstimatedTimeRemaining(remainingTime);
        
        // Move to next status after specified duration
        setTimeout(() => {
          currentStatusIndex++;
          progressDelivery();
        }, currentStatusData.duration * 60000); // Convert minutes to milliseconds (for demo, use 5000 for 5 seconds)
      } else {
        // Order completed - move to delivered status
        setCurrentStatus("delivered");
        setEstimatedTimeRemaining(0);
        
        // Move order to history after delivery
        setTimeout(() => {
          moveOrderToHistory();
        }, 3000);
      }
    };
    
    progressDelivery();
  };

  const moveOrderToHistory = () => {
    if (!activeOrder) return;
    
    try {
      // Update order status to delivered
      const completedOrder = {
        ...activeOrder,
        status: "delivered",
        deliveredAt: new Date().toISOString(),
        completedDate: new Date().toLocaleDateString(),
        completedTime: new Date().toLocaleTimeString()
      };
      
      // Add to order history
      const existingHistory = localStorage.getItem("orderHistory");
      const orderHistory = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Update the order in history (it should already exist)
      const historyIndex = orderHistory.findIndex(order => order.id === activeOrder.id);
      if (historyIndex !== -1) {
        orderHistory[historyIndex] = completedOrder;
      } else {
        orderHistory.unshift(completedOrder);
      }
      
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
      
      // Remove active order
      localStorage.removeItem("activeOrder");
      
      // Show completion message
      alert("🎉 Delivery Completed! Your order has been delivered successfully.");
      navigate("/confirmation");
      
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const handleCancelOrder = () => {
    if (currentStatus !== "pending" && currentStatus !== "assigned") {
      alert("Cannot cancel order. Delivery is already in progress.");
      return;
    }
    
    const confirmCancel = window.confirm("Are you sure you want to cancel this delivery? This action cannot be undone.");
    
    if (confirmCancel) {
      try {
        // Remove active order
        localStorage.removeItem("activeOrder");
        
        // Refund user balance
        if (activeOrder) {
          const currentBalance = Number(localStorage.getItem("userBalance") || 0);
          const refundedBalance = currentBalance + activeOrder.price;
          localStorage.setItem("userBalance", refundedBalance.toString());
          
          alert(`Order cancelled successfully. ₦${activeOrder.price} has been refunded to your wallet.`);
        }
        
        navigate("/home");
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Error cancelling order. Please try again.");
      }
    }
  };

  const handleContactDriver = () => {
    if (driverInfo) {
      const message = `Contact driver ${driverInfo.name} at ${driverInfo.phone}`;
      alert(message);
      // In a real app, this would open the phone dialer or messaging app
    }
  };

  const getCurrentStatusData = () => {
    return deliveryStatuses.find(status => status.key === currentStatus) || deliveryStatuses[0];
  };

  const getStatusIndex = (statusKey) => {
    return deliveryStatuses.findIndex(status => status.key === statusKey);
  };

  if (isLoading) {
    return (
      <div className="tracking-container">
        <div className="loading-spinner">Loading tracking information...</div>
      </div>
    );
  }

  const statusData = getCurrentStatusData();
  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <div className="tracking-container">
      {/* Header */}
      <header className="tracking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
        <h2>🚚 Track Delivery</h2>
      </header>

      {/* Order Info Card */}
      <div className="tracking-card">
        <div className="card-header">
          <h3>Order #{activeOrder?.id?.slice(-6) || "123456"}</h3>
          <span className="order-time">
            {activeOrder?.orderDate} • {activeOrder?.orderTime}
          </span>
        </div>

        {/* Current Status */}
        <div className="current-status">
          <div className="status-icon-container">
            <statusData.icon className="status-icon" />
          </div>
          <div className="status-info">
            <h4>{statusData.label}</h4>
            <p>{statusData.description}</p>
            {estimatedTimeRemaining > 0 && (
              <div className="eta">
                <FaClock className="eta-icon" />
                <span>ETA: {estimatedTimeRemaining} minutes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Preview */}
      <div className="map-card">
        <h4>📍 Delivery Route</h4>
        <div className="map-container">
          <iframe
            title="Delivery Route Map"
            src={mapUrl}
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Location Details */}
      <div className="tracking-card">
        <div className="location-info">
          <div className="location-item">
            <FaMapMarkerAlt className="location-icon pickup" />
            <div className="location-details">
              <span className="location-label">Pickup</span>
              <p className="location-address">{activeOrder?.pickup?.address}</p>
              {activeOrder?.pickup?.streetNumber && (
                <span className="location-extra">{activeOrder.pickup.streetNumber}</span>
              )}
            </div>
          </div>

          <div className="route-line"></div>

          <div className="location-item">
            <FaMapMarkerAlt className="location-icon dropoff" />
            <div className="location-details">
              <span className="location-label">Drop-off</span>
              <p className="location-address">{activeOrder?.dropoff?.address}</p>
              {activeOrder?.dropoff?.streetNumber && (
                <span className="location-extra">{activeOrder.dropoff.streetNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="tracking-card">
        <h4>📋 Delivery Progress</h4>
        <div className="progress-steps">
          {deliveryStatuses.map((status, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const StatusIcon = status.icon;
            
            return (
              <div key={status.key} className={`progress-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="step-indicator">
                  <StatusIcon className="step-icon" />
                </div>
                <div className="step-content">
                  <span className="step-label">{status.label}</span>
                  {isCurrent && (
                    <span className="step-description">{status.description}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Information */}
      {driverInfo && (currentStatus === "pickup" || currentStatus === "on_the_way") && (
        <div className="tracking-card driver-card">
          <h4>🚗 Your Driver</h4>
          <div className="driver-info">
            <div className="driver-details">
              <p className="driver-name">{driverInfo.name}</p>
              <p className="driver-rating">⭐ {driverInfo.rating}/5.0</p>
            </div>
            <button className="contact-driver-btn" onClick={handleContactDriver}>
              <FaPhone className="btn-icon" />
              Contact
            </button>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="tracking-card summary-card">
        <h4>💰 Order Summary</h4>
        <div className="summary-details">
          <div className="summary-item">
            <span>Delivery Fee:</span>
            <span>₦{activeOrder?.price}</span>
          </div>
          {activeOrder?.routeInfo && (
            <>
              <div className="summary-item">
                <span>Distance:</span>
                <span>{activeOrder.routeInfo.distanceText}</span>
              </div>
              <div className="summary-item">
                <span>Estimated Duration:</span>
                <span>{activeOrder.routeInfo.durationText}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="tracking-actions">
        {(currentStatus === "pending" || currentStatus === "assigned") && (
          <button className="cancel-btn" onClick={handleCancelOrder}>
            <FaTimes className="btn-icon" />
            Cancel Delivery
          </button>
        )}
        
        {currentStatus === "delivered" && (
          <button className="completed-btn" onClick={() => navigate("/confirmation")}>
            <FaCheckCircle className="btn-icon" />
            View Delivery Confirmation
          </button>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      </div>
  );
}