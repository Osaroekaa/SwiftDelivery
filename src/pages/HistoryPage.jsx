import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaHistory, 
  FaMapMarkerAlt, 
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaBox,
  FaUtensils,
  FaCouch,
  FaTruck,
  FaCheckCircle,
  FaTimes,
  FaWallet
} from "react-icons/fa";
import BottomNav from "../component/BottomNav";
import "./HistoryPage.css";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = () => {
    try {
      const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
      
      // Add a sample order if no orders exist (for demonstration)
      if (orders.length === 0) {
        const sampleOrder = {
          id: "1703456789123",
          selectedService: "food",
          deliveryType: "instant",
          pickup: {
            address: "Victoria Island, Lagos",
            streetNumber: "No. 45, Near Shoprite Mall",
            locationDescription: "Blue gate, beside First Bank",
            phone: "+234 801 234 5678"
          },
          dropoff: {
            address: "Lekki Phase 1, Lagos",
            streetNumber: "Block 15, Flat 3B",
            locationDescription: "White building, security post at entrance",
            phone: "+234 809 876 5432"
          },
          deliveryNote: "Fresh groceries and vegetables - handle with care",
          price: 1500,
          routeInfo: {
            duration: 2700,
            distance: 15000,
            durationText: "45 minutes",
            distanceText: "15.0 km",
            method: "api"
          },
          orderDate: new Date().toLocaleDateString(),
          orderTime: "2:30 PM",
          timestamp: new Date().toISOString(),
          status: "delivered",
          completedDate: new Date().toLocaleDateString(),
          completedTime: "3:15 PM",
          paymentMethod: "wallet",
          balanceAfter: 3500
        };
        
        orders.push(sampleOrder);
        localStorage.setItem("orderHistory", JSON.stringify(orders));
      }
      
      // Sort orders by timestamp (newest first)
      const sortedOrders = orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setHistory(sortedOrders);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading order history:", error);
      setHistory([]);
      setIsLoading(false);
    }
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case 'food': return FaUtensils;
      case 'parcel': return FaBox;
      case 'furniture': return FaCouch;
      case 'relocation': return FaTruck;
      default: return FaBox;
    }
  };

  const getServiceName = (service) => {
    switch (service) {
      case 'food': return 'Food Delivery';
      case 'parcel': return 'Parcel Delivery';
      case 'furniture': return 'Furniture Delivery';
      case 'relocation': return 'Relocation Service';
      default: return 'Delivery Service';
    }
  };

  const getServiceEmoji = (service) => {
    switch (service) {
      case 'food': return '🍔';
      case 'parcel': return '📦';
      case 'furniture': return '🛋';
      case 'relocation': return '🚚';
      default: return '📦';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'delivered':
        return { text: 'Delivered', color: '#28a745', icon: FaCheckCircle };
      case 'cancelled':
      case 'canceled':
        return { text: 'Cancelled', color: '#dc3545', icon: FaTimes };
      case 'confirmed':
        return { text: 'Completed', color: '#28a745', icon: FaCheckCircle };
      default:
        return { text: 'Completed', color: '#28a745', icon: FaCheckCircle };
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      if (timeString.includes(':')) {
        return timeString;
      }
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timeString;
    }
  };

  if (isLoading) {
    return (
      <div className="history-container">
        <div className="loading-spinner">Loading order history...</div>
        <BottomNav />
      </div>
    );
  }

  // Detail View
  if (selectedOrder) {
    const ServiceIcon = getServiceIcon(selectedOrder.selectedService);
    const statusInfo = getStatusDisplay(selectedOrder.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="history-container">
        {/* Detail Header */}
        <header className="history-header">
          <button className="back-btn" onClick={handleBackToList}>
            <FaArrowLeft />
            Back to History
          </button>
          <h2>Order Details</h2>
        </header>

        {/* Order Detail Card */}
        <div className="detail-card">
          {/* Order Info Header */}
          <div className="detail-header">
            <div className="order-info">
              <div className="service-display">
                <ServiceIcon className="service-icon" />
                <div className="service-text">
                  <h3>{getServiceName(selectedOrder.selectedService)}</h3>
                  <span className="order-id">#{selectedOrder.id?.slice(-8) || 'ORDER001'}</span>
                </div>
              </div>
              <div className="status-display">
                <StatusIcon className="status-icon" style={{ color: statusInfo.color }} />
                <span className="status-text" style={{ color: statusInfo.color }}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="detail-section">
            <h4>Service Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Service Type:</span>
                <span className="info-value">
                  {getServiceEmoji(selectedOrder.selectedService)} {getServiceName(selectedOrder.selectedService)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Delivery Type:</span>
                <span className="info-value">
                  {selectedOrder.deliveryType === 'instant' ? '⚡ Instant' : '📅 Scheduled'}
                </span>
              </div>
              {selectedOrder.scheduledDateTime && (
                <div className="info-item">
                  <span className="info-label">Scheduled For:</span>
                  <span className="info-value scheduled">
                    {new Date(selectedOrder.scheduledDateTime).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="detail-section">
            <h4>Delivery Locations</h4>
            <div className="location-details">
              <div className="location-item">
                <FaMapMarkerAlt className="location-icon pickup" />
                <div className="location-content">
                  <span className="location-label">Pickup Location</span>
                  <p className="location-address">{selectedOrder.pickup?.address}</p>
                  {selectedOrder.pickup?.streetNumber && (
                    <span className="location-extra">{selectedOrder.pickup.streetNumber}</span>
                  )}
                  {selectedOrder.pickup?.phone && (
                    <div className="contact-info">
                      <FaPhone className="contact-icon" />
                      <span>Sender: {selectedOrder.pickup.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="location-divider">→</div>

              <div className="location-item">
                <FaMapMarkerAlt className="location-icon dropoff" />
                <div className="location-content">
                  <span className="location-label">Drop-off Location</span>
                  <p className="location-address">{selectedOrder.dropoff?.address}</p>
                  {selectedOrder.dropoff?.streetNumber && (
                    <span className="location-extra">{selectedOrder.dropoff.streetNumber}</span>
                  )}
                  {selectedOrder.dropoff?.phone && (
                    <div className="contact-info">
                      <FaPhone className="contact-icon" />
                      <span>Receiver: {selectedOrder.dropoff.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          {selectedOrder.deliveryNote && (
            <div className="detail-section">
              <h4>Product Description</h4>
              <p className="product-description">{selectedOrder.deliveryNote}</p>
            </div>
          )}

          {/* Order Timeline */}
          <div className="detail-section">
            <h4>Order Information</h4>
            <div className="timeline-info">
              <div className="timeline-item">
                <FaCalendarAlt className="timeline-icon" />
                <div className="timeline-content">
                  <span className="timeline-label">Order Date</span>
                  <span className="timeline-value">{selectedOrder.orderDate}</span>
                </div>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <div className="timeline-content">
                  <span className="timeline-label">Order Time</span>
                  <span className="timeline-value">{selectedOrder.orderTime}</span>
                </div>
              </div>
              {selectedOrder.completedDate && (
                <div className="timeline-item">
                  <FaCheckCircle className="timeline-icon completed" />
                  <div className="timeline-content">
                    <span className="timeline-label">Delivered On</span>
                    <span className="timeline-value">
                      {selectedOrder.completedDate} at {selectedOrder.completedTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="detail-section payment-section">
            <h4>Payment Details</h4>
            <div className="payment-info">
              <div className="payment-item">
                <span className="payment-label">Delivery Fee:</span>
                <span className="payment-value">₦{selectedOrder.price?.toLocaleString()}</span>
              </div>
              <div className="payment-item">
                <span className="payment-label">Payment Method:</span>
                <span className="payment-value">
                  <FaWallet className="wallet-icon" />
                  Wallet
                </span>
              </div>
              {selectedOrder.balanceAfter !== undefined && (
                <div className="payment-item">
                  <span className="payment-label">Balance After:</span>
                  <span className="payment-value">₦{selectedOrder.balanceAfter?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // List View
  return (
    <div className="history-container">
      {/* Header */}
      <header className="history-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
        <h2>
          <FaHistory className="header-icon" />
          Delivery History
        </h2>
      </header>

      {/* Orders List */}
      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaHistory />
          </div>
          <h3>No deliveries yet</h3>
          <p>Your completed orders will appear here</p>
          <button className="start-order-btn" onClick={() => navigate("/home")}>
            Start Your First Order
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {history.map((order, index) => {
            const ServiceIcon = getServiceIcon(order.selectedService);
            const statusInfo = getStatusDisplay(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id || index}
                className="order-card"
                onClick={() => handleOrderClick(order)}
              >
                <div className="card-header">
                  <div className="service-info">
                    <div className="service-icon-container">
                      <ServiceIcon className="service-icon" />
                      <span className="service-emoji">{getServiceEmoji(order.selectedService)}</span>
                    </div>
                    <div className="service-details">
                      <h3 className="service-name">{getServiceName(order.selectedService)}</h3>
                      <span className="order-date">
                        {formatDate(order.orderDate)} • {formatTime(order.orderTime)}
                      </span>
                    </div>
                  </div>
                  <div className="status-badge">
                    <StatusIcon className="status-icon" />
                    <span className="status-text">{statusInfo.text}</span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="route-info">
                    <div className="route-point">
                      <span className="route-label">From:</span>
                      <span className="route-address">{order.pickup?.address}</span>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-point">
                      <span className="route-label">To:</span>
                      <span className="route-address">{order.dropoff?.address}</span>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <span className="order-price">₦{order.price?.toLocaleString()}</span>
                    <span className="tap-hint">Tap for details</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
    );
}
