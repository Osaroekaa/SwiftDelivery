import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaWallet, FaCreditCard, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import BottomNav from "../component/BottomNav";
import "./PaymentPage.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  
  // State for payment data
  const [pickupData, setPickupData] = useState(null);
  const [dropoffData, setDropoffData] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [routeInfo, setRouteInfo] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderTimestamp, setOrderTimestamp] = useState(null);

  useEffect(() => {
    loadPaymentData();
  }, [navigate]);

  const loadPaymentData = () => {
    try {
      // Load pickup data
      const savedPickup = localStorage.getItem("pickup");
      if (!savedPickup) {
        alert("No pickup location found. Please start from the beginning.");
        navigate("/pickup");
        return;
      }
      setPickupData(JSON.parse(savedPickup));

      // Load dropoff data
      const savedDropoff = localStorage.getItem("dropoff");
      if (!savedDropoff) {
        alert("No drop-off location found. Please set your drop-off location.");
        navigate("/dropoff");
        return;
      }
      setDropoffData(JSON.parse(savedDropoff));

      // Load estimated price
      const savedPrice = localStorage.getItem("estimatedPrice");
      if (!savedPrice) {
        alert("No delivery price calculated. Please recalculate from drop-off page.");
        navigate("/dropoff");
        return;
      }
      setEstimatedPrice(JSON.parse(savedPrice));

      // Load route info
      const savedRoute = localStorage.getItem("routeInfo");
      if (savedRoute) {
        setRouteInfo(JSON.parse(savedRoute));
      }

      // Load user balance (default to 2500 if not set)
      const savedBalance = localStorage.getItem("userBalance");
      setUserBalance(savedBalance ? JSON.parse(savedBalance) : 5000);

      // Set order timestamp
      const timestamp = new Date();
      setOrderTimestamp(timestamp);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading payment data:", error);
      alert("Error loading payment information. Please try again.");
      navigate("/home");
    }
  };

  const handlePayment = () => {
    if (userBalance < estimatedPrice) {
      // Insufficient funds - redirect to top-up
      localStorage.setItem("requiredAmount", JSON.stringify(estimatedPrice));
      navigate("/topup");
    } else {
      // Sufficient funds - proceed to review
      // Save payment timestamp and order details
      const orderDetails = {
        pickup: pickupData,
        dropoff: dropoffData,
        price: estimatedPrice,
        routeInfo: routeInfo,
        timestamp: orderTimestamp.toISOString(),
        orderDate: orderTimestamp.toLocaleDateString(),
        orderTime: orderTimestamp.toLocaleTimeString(),
        status: "pending_review"
      };
      
      localStorage.setItem("currentOrder", JSON.stringify(orderDetails));
      navigate("/review");
    }
  };

  const handleTopUp = () => {
    localStorage.setItem("requiredAmount", JSON.stringify(estimatedPrice));
    navigate("/topup");
  };

  if (isLoading) {
    return (
      <div className="payment-container">
        <div className="loading-spinner">Loading payment details...</div>
      </div>
    );
  }

  const isBalanceSufficient = userBalance >= estimatedPrice;
  const shortfall = isBalanceSufficient ? 0 : estimatedPrice - userBalance;

  return (
    <div className="payment-container">
      {/* Header */}
      <header className="payment-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
        <h2>💳 Payment</h2>
      </header>

      {/* Payment Card */}
      <div className="payment-card">
        {/* Order Summary */}
        <div className="order-summary">
          <h3>📦 Order Summary</h3>
          
          <div className="location-details">
            <div className="location-item">
              <strong>📍 Pickup:</strong>
              <p>{pickupData?.address}</p>
              {pickupData?.streetNumber && (
                <span className="location-extra">{pickupData.streetNumber}</span>
              )}
            </div>
            
            <div className="location-item">
              <strong>📍 Drop-off:</strong>
              <p>{dropoffData?.address}</p>
              {dropoffData?.streetNumber && (
                <span className="location-extra">{dropoffData.streetNumber}</span>
              )}
            </div>
          </div>

          {/* Order DateTime */}
          <div className="order-datetime">
            <p><strong>📅 Date:</strong> {orderTimestamp?.toLocaleDateString()}</p>
            <p><strong>🕐 Time:</strong> {orderTimestamp?.toLocaleTimeString()}</p>
          </div>

          {/* Route Information */}
          {routeInfo && (
            <div className="route-info">
              <p><strong>📏 Distance:</strong> {routeInfo.distanceText}</p>
              <p><strong>⏱️ Duration:</strong> {routeInfo.durationText}</p>
            </div>
          )}
        </div>

        {/* Pricing Details */}
        <div className="pricing-section">
          <div className="price-breakdown">
            <div className="price-item">
              <span>Delivery Fee:</span>
              <span className="price-amount">₦{estimatedPrice}</span>
            </div>
            <div className="price-item total">
              <span><strong>Total Amount:</strong></span>
              <span className="price-amount total-price"><strong>₦{estimatedPrice}</strong></span>
            </div>
          </div>
        </div>

        {/* Balance Information */}
        <div className="balance-section">
          <div className="balance-info">
            <FaWallet className="balance-icon" />
            <div className="balance-details">
              <p className="balance-label">Current Wallet Balance</p>
              <p className={`balance-amount ${isBalanceSufficient ? 'sufficient' : 'insufficient'}`}>
                ₦{userBalance}
              </p>
            </div>
          </div>

          {/* Balance Status */}
          <div className={`balance-status ${isBalanceSufficient ? 'sufficient' : 'insufficient'}`}>
            {isBalanceSufficient ? (
              <>
                <FaCheckCircle className="status-icon" />
                <span>You have sufficient balance to complete this order</span>
              </>
            ) : (
              <>
                <FaExclamationTriangle className="status-icon" />
                <span>Insufficient funds. You need ₦{shortfall} more to complete this order.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {isBalanceSufficient ? (
          <button className="continue-btn" onClick={handlePayment}>
            <FaCreditCard className="btn-icon" />
            Continue to Review
          </button>
        ) : (
          <>
            <button className="topup-btn" onClick={handleTopUp}>
              <FaWallet className="btn-icon" />
              Top Up Wallet (₦{shortfall} needed)
            </button>
            <p className="topup-info">After topping up, you can return to complete your order</p>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}