import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaClock, FaWallet, FaCheckCircle, FaTimes } from "react-icons/fa";
import BottomNav from "../component/BottomNav";
import "./ReviewPage.css";

export default function ReviewPage() {
  const navigate = useNavigate();
  
  // State for order data
  const [orderData, setOrderData] = useState(null);
  const [pickupData, setPickupData] = useState(null);
  const [dropoffData, setDropoffData] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [routeInfo, setRouteInfo] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [pickupPhone, setPickupPhone] = useState("");
  const [dropoffPhone, setDropoffPhone] = useState("");
  const [orderTimestamp, setOrderTimestamp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Home page selections
  const [selectedService, setSelectedService] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState(null);

  useEffect(() => {
    loadOrderData();
  }, [navigate]);

  const loadOrderData = () => {
    try {
      // Load current order or individual components
      const currentOrder = localStorage.getItem("currentOrder");
      if (currentOrder) {
        const order = JSON.parse(currentOrder);
        setOrderData(order);
        setPickupData(order.pickup);
        setDropoffData(order.dropoff);
        setEstimatedPrice(order.price);
        setRouteInfo(order.routeInfo);
        setOrderTimestamp(new Date(order.timestamp));
      } else {
        // Load individual components if no current order
        const pickup = localStorage.getItem("pickup");
        const dropoff = localStorage.getItem("dropoff");
        const price = localStorage.getItem("estimatedPrice");
        
        if (!pickup || !dropoff || !price) {
          alert("Missing order information. Please start from the beginning.");
          navigate("/home");
          return;
        }
        
        setPickupData(JSON.parse(pickup));
        setDropoffData(JSON.parse(dropoff));
        setEstimatedPrice(JSON.parse(price));
        setOrderTimestamp(new Date());
        
        // Load route info
        const route = localStorage.getItem("routeInfo");
        if (route) setRouteInfo(JSON.parse(route));
      }

      // Load additional data
      setUserBalance(Number(localStorage.getItem("userBalance") || 0));
      setDeliveryNote(localStorage.getItem("deliveryNote") || "");
      setPickupPhone(localStorage.getItem("pickupPhone") || "");
      setDropoffPhone(localStorage.getItem("dropoffPhone") || "");
      
      // Load home page selections
      setSelectedService(localStorage.getItem("selectedService") || "");
      setDeliveryType(localStorage.getItem("deliveryType") || "instant");
      
      // Load scheduled date/time if applicable
      const savedScheduledDateTime = localStorage.getItem("scheduledDateTime");
      if (savedScheduledDateTime) {
        setScheduledDateTime(new Date(savedScheduledDateTime));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading order data:", error);
      alert("Error loading order information. Please try again.");
      navigate("/home");
    }
  };

  const handleConfirm = async () => {
    if (userBalance < estimatedPrice) {
      alert("Insufficient balance. Please top up your wallet first.");
      navigate("/topup");
      return;
    }

    setIsConfirming(true);
    
    try {
      // Calculate new balance after payment
      const newBalance = userBalance - estimatedPrice;
      
      // Create order object for history
      const confirmedOrder = {
        id: Date.now().toString(), // Simple ID generation
        pickup: {
          address: pickupData.address,
          streetNumber: pickupData.streetNumber || "",
          locationDescription: pickupData.locationDescription || "",
          phone: pickupPhone
        },
        dropoff: {
          address: dropoffData.address,
          streetNumber: dropoffData.streetNumber || "",
          locationDescription: dropoffData.locationDescription || "",
          phone: dropoffPhone
        },
        deliveryNote: deliveryNote,
        selectedService: selectedService,
        deliveryType: deliveryType,
        scheduledDateTime: scheduledDateTime ? scheduledDateTime.toISOString() : null,
        price: estimatedPrice,
        routeInfo: routeInfo,
        orderDate: orderTimestamp.toLocaleDateString(),
        orderTime: orderTimestamp.toLocaleTimeString(),
        timestamp: orderTimestamp.toISOString(),
        status: "confirmed",
        paymentMethod: "wallet",
        balanceAfter: newBalance
      };

      // Save to order history
      const existingHistory = localStorage.getItem("orderHistory");
      const orderHistory = existingHistory ? JSON.parse(existingHistory) : [];
      orderHistory.unshift(confirmedOrder); // Add to beginning of array
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

      // Update user balance
      localStorage.setItem("userBalance", newBalance.toString());

      // Clear current order and temporary data
      localStorage.removeItem("currentOrder");
      localStorage.removeItem("pickup");
      localStorage.removeItem("dropoff");
      localStorage.removeItem("estimatedPrice");
      localStorage.removeItem("routeInfo");
      localStorage.removeItem("deliveryNote");
      localStorage.removeItem("requiredAmount");

      // Save confirmed order for tracking page
      localStorage.setItem("activeOrder", JSON.stringify(confirmedOrder));

      // Show success and navigate
      setTimeout(() => {
        alert("✅ Order Confirmed! Your delivery has been placed successfully 🚚");
        navigate("/tracking");
      }, 500);
      
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Error processing your order. Please try again.");
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order? All details will be lost.");
    
    if (confirmCancel) {
      // Clear current order data but keep user settings
      localStorage.removeItem("currentOrder");
      localStorage.removeItem("pickup");
      localStorage.removeItem("dropoff");
      localStorage.removeItem("estimatedPrice");
      localStorage.removeItem("routeInfo");
      localStorage.removeItem("deliveryNote");
      localStorage.removeItem("requiredAmount");
      
      alert("❌ Order cancelled.");
      navigate("/home");
    }
  };

  if (isLoading) {
    return (
      <div className="review-container">
        <div className="loading-spinner">Loading order details...</div>
      </div>
    );
  }

  const remainingBalance = userBalance - estimatedPrice;

  return (
    <div className="review-container">
      {/* Header */}
      <header className="review-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
        <h2>📋 Review Order</h2>
      </header>

      {/* Order Summary Card */}
      <div className="review-card">
        <div className="card-header">
          <h3>📦 Delivery Details</h3>
          <span className="order-date">{orderTimestamp?.toLocaleDateString()} • {orderTimestamp?.toLocaleTimeString()}</span>
        </div>

        {/* Pickup Information */}
        <div className="location-section">
          <div className="location-header">
            <FaMapMarkerAlt className="location-icon pickup" />
            <h4>Pickup Location</h4>
          </div>
          <div className="location-details">
            <p className="address">{pickupData?.address}</p>
            {pickupData?.streetNumber && (
              <p className="street-info">{pickupData.streetNumber}</p>
            )}
            {pickupData?.locationDescription && (
              <p className="description">{pickupData.locationDescription}</p>
            )}
            {pickupPhone && (
              <p className="phone">
                <FaPhone className="phone-icon" />
                <span className="phone-label">Sender:</span>
                <span className="phone-number">{pickupPhone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Dropoff Information */}
        <div className="location-section">
          <div className="location-header">
            <FaMapMarkerAlt className="location-icon dropoff" />
            <h4>Drop-off Location</h4>
          </div>
          <div className="location-details">
            <p className="address">{dropoffData?.address}</p>
            {dropoffData?.streetNumber && (
              <p className="street-info">{dropoffData.streetNumber}</p>
            )}
            {dropoffData?.locationDescription && (
              <p className="description">{dropoffData.locationDescription}</p>
            )}
            {dropoffPhone && (
              <p className="phone">
                <FaPhone className="phone-icon" />
                <span className="phone-label">Receiver:</span>
                <span className="phone-number">{dropoffPhone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Service Selection Display */}
        <div className="service-selection">
          <h4>📋 Service Details</h4>
          <div className="service-info">
            {selectedService && (
              <div className="service-item">
                <span className="service-label">Service Type:</span>
                <span className="service-value">
                  {selectedService === 'food' && '🍔 Food Delivery'}
                  {selectedService === 'parcel' && '📦 Parcel Delivery'}
                  {selectedService === 'furniture' && '🛋 Furniture Delivery'}
                  {selectedService === 'relocation' && '🚚 Relocation Service'}
                </span>
              </div>
            )}
            
            <div className="service-item">
              <span className="service-label">Delivery Type:</span>
              <span className="service-value">
                {deliveryType === 'instant' ? '⚡ Instant Delivery' : '📅 Scheduled Delivery'}
              </span>
            </div>
            
            {deliveryType === 'scheduled' && scheduledDateTime && (
              <div className="service-item">
                <span className="service-label">Scheduled For:</span>
                <span className="service-value scheduled-time">
                  {scheduledDateTime.toLocaleDateString()} at {scheduledDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Description */}
        {deliveryNote && (
          <div className="note-section">
            <h4>📝 Product Description</h4>
            <p className="note-text">{deliveryNote}</p>
          </div>
        )}
      </div>

      {/* Cost Breakdown Card */}
      <div className="review-card cost-card">
        <div className="card-header">
          <h3>💰 Cost Breakdown</h3>
        </div>

        {routeInfo && (
          <div className="route-info">
            <div className="route-item">
              <FaClock className="route-icon" />
              <span>Estimated Time: {routeInfo.durationText}</span>
            </div>
            <div className="route-item">
              <FaMapMarkerAlt className="route-icon" />
              <span>Distance: {routeInfo.distanceText}</span>
            </div>
          </div>
        )}

        <div className="cost-breakdown">
          <div className="cost-item">
            <span>Delivery Fee:</span>
            <span className="cost-value">₦{estimatedPrice}</span>
          </div>
          <div className="cost-item total">
            <span><strong>Total Amount:</strong></span>
            <span className="cost-value total-amount"><strong>₦{estimatedPrice}</strong></span>
          </div>
        </div>

        <div className="balance-info">
          <div className="balance-item">
            <FaWallet className="balance-icon" />
            <div className="balance-details">
              <span className="balance-label">Current Wallet Balance</span>
              <span className="balance-amount">₦{userBalance}</span>
            </div>
          </div>
          <div className="balance-item">
            <div className="balance-details">
              <span className="balance-label">Balance After Payment</span>
              <span className={`balance-amount ${remainingBalance >= 0 ? 'positive' : 'negative'}`}>
                ₦{remainingBalance}
              </span>
            </div>
          </div>
        </div>

        {remainingBalance < 0 && (
          <div className="insufficient-warning">
            <span>⚠️ Insufficient balance! Please top up your wallet.</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="review-actions">
        <button 
          className="confirm-btn" 
          onClick={handleConfirm}
          disabled={isConfirming || remainingBalance < 0}
        >
          {isConfirming ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <FaCheckCircle className="btn-icon" />
              Confirm & Place Order
            </>
          )}
        </button>
        
        <button 
          className="cancel-btn" 
          onClick={handleCancel}
          disabled={isConfirming}
        >
          <FaTimes className="btn-icon" />
          Cancel Order
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}