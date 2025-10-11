import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import BottomNav from "../component/BottomNav";
import "./ConfirmationPage.css";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get current order from localStorage - try multiple sources
    let currentOrder = null;
    
    // First try activeOrder (from tracking page)
    const active = localStorage.getItem("activeOrder");
    if (active) {
      currentOrder = JSON.parse(active);
    } else {
      // Then try currentOrder (from review page)
      const current = localStorage.getItem("currentOrder");
      if (current) {
        currentOrder = JSON.parse(current);
      } else {
        // Finally try order history (get most recent)
        const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
        if (history.length > 0) {
          currentOrder = history[0];
        }
      }
    }

    if (currentOrder) {
      setOrder(currentOrder);

      // Save to history if not already saved
      const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
      const exists = history.find((item) => item.id === currentOrder.id);

      if (!exists) {
        history.unshift(currentOrder);
        localStorage.setItem("orderHistory", JSON.stringify(history));
      }
    }
  }, []);

  if (!order) {
    return (
      <div className="confirmation-container">
        <div className="no-order">
          <FaCheckCircle className="success-icon" />
          <p>No order found.</p>
          <button className="home-btn" onClick={() => navigate("/home")}>
            Back to Home
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* Confirmation Card */}
      <div className="confirmation-card">
        <FaCheckCircle className="success-icon" />
        <h2>Order Confirmed!</h2>
        <p>Your delivery has been placed successfully.</p>

        <div className="order-summary">
          <p>
            <strong>Pickup:</strong> {order.pickup?.address || order.pickup}
          </p>
          <p>
            <strong>Dropoff:</strong> {order.dropoff?.address || order.dropoff}
          </p>
          <p>
            <strong>Fee:</strong> ₦{order.price || order.fee}
          </p>
          <p>
            <strong>Date:</strong> {order.orderDate || order.date || new Date(order.timestamp).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {order.orderTime || new Date(order.timestamp).toLocaleTimeString()}
          </p>
          {order.id && (
            <p>
              <strong>Order ID:</strong> #{order.id.slice(-6)}
            </p>
          )}
        </div>

        <div className="confirmation-actions">
          <button
            className="track-btn"
            onClick={() => navigate("/tracking")}
          >
            Track Delivery
          </button>
          <button
            className="home-btn"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}