import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaUser, 
  FaWallet, 
  FaPhone, 
  FaEnvelope, 
  FaEdit,
  FaHistory,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaSave,
  FaTimes,
  FaCamera,
  FaMapMarkerAlt
} from "react-icons/fa";
import BottomNav from "../component/BottomNav";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com", 
    phone: "+234 801 234 5678",
    address: "Victoria Island, Lagos",
    joinDate: new Date().toLocaleDateString()
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  useEffect(() => {
    loadUserData();
    
    // Listen for balance updates
    const handleStorageChange = (e) => {
      if (e.key === 'userBalance') {
        setUserBalance(Number(e.newValue || 0));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadUserData);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadUserData);
    };
  }, []);

  const loadUserData = () => {
    // Load profile data
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const savedProfile = JSON.parse(storedProfile);
      setProfile(savedProfile);
      setTempProfile(savedProfile);
    }

    // Load current balance
    const balance = Number(localStorage.getItem("userBalance") || 2500);
    setUserBalance(balance);

    // Load order count
    const orderHistory = localStorage.getItem("orderHistory");
    if (orderHistory) {
      const orders = JSON.parse(orderHistory);
      setOrderCount(orders.length);
    }
  };

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedProfile = {
      ...tempProfile,
      lastUpdated: new Date().toISOString()
    };
    
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout? This will clear your local data.");
    
    if (confirmLogout) {
      // Clear all user data
      localStorage.removeItem("userProfile");
      localStorage.removeItem("userBalance");
      localStorage.removeItem("orderHistory");
      localStorage.removeItem("pickup");
      localStorage.removeItem("dropoff");
      localStorage.removeItem("selectedService");
      localStorage.removeItem("deliveryType");
      localStorage.removeItem("deliveryNote");
      localStorage.removeItem("currentOrder");
      localStorage.removeItem("activeOrder");
      
      alert("Logged out successfully!");
      navigate("/");
    }
  };

  const menuItems = [
    {
      icon: FaEdit,
      label: "Edit Profile",
      action: () => setIsEditing(true),
      description: "Update your personal information"
    },
    {
      icon: FaWallet,
      label: "Wallet & Payments",
      action: () => navigate("/topup"),
      description: `₦${userBalance.toLocaleString()} available`,
      badge: `₦${userBalance.toLocaleString()}`
    },
    {
      icon: FaHistory,
      label: "Order History",
      action: () => navigate("/history"),
      description: `${orderCount} completed deliveries`,
      badge: orderCount > 0 ? orderCount.toString() : null
    },
    {
      icon: FaCog,
      label: "App Settings",
      action: () => alert("Settings feature coming soon!"),
      description: "Notifications and preferences"
    },
    {
      icon: FaQuestionCircle,
      label: "Help & Support",
      action: () => alert("For support, contact: support@deliveryapp.com"),
      description: "Get help and contact support"
    }
  ];

  if (isEditing) {
    return (
      <div className="profile-container">
        <header className="profile-header">
          <button className="back-btn" onClick={handleCancel}>
            <FaTimes />
            Cancel
          </button>
          <h2>Edit Profile</h2>
          <button className="save-btn-header" onClick={handleSave}>
            <FaSave />
            Save
          </button>
        </header>

        <div className="edit-profile-card">
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar">
                {tempProfile.name ? tempProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <button className="avatar-edit-btn">
                <FaCamera />
              </button>
            </div>
            <p className="avatar-hint">Tap to change photo</p>
          </div>

          <div className="form-section">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-container">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={tempProfile.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={tempProfile.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-container">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={tempProfile.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="address">Address</label>
              <div className="input-container">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={tempProfile.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={handleSave}>
              <FaSave className="btn-icon" />
              Save Changes
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              <FaTimes className="btn-icon" />
              Cancel
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
        <h2>My Profile</h2>
        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          <FaEdit />
        </button>
      </header>

      {/* Profile Info Card */}
      <div className="profile-info-card">
        <div className="avatar-section">
          <div className="avatar">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <h3 className="user-name">{profile.name}</h3>
            <p className="user-email">{profile.email}</p>
            <p className="user-phone">{profile.phone}</p>
            <p className="join-date">Member since {profile.joinDate}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <div className="stat-item">
            <FaWallet className="stat-icon" />
            <div className="stat-info">
              <span className="stat-label">Wallet Balance</span>
              <span className="stat-value">₦{userBalance.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-item">
            <FaHistory className="stat-icon" />
            <div className="stat-info">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orderCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-section">
        <h4 className="menu-title">Account</h4>
        <div className="menu-list">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="menu-item"
              onClick={item.action}
            >
              <div className="menu-item-left">
                <item.icon className="menu-icon" />
                <div className="menu-content">
                  <span className="menu-label">{item.label}</span>
                  <span className="menu-description">{item.description}</span>
                </div>
              </div>
              <div className="menu-item-right">
                {item.badge && (
                  <span className="menu-badge">{item.badge}</span>
                )}
                <FaChevronRight className="menu-arrow" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          Logout
        </button>
        <p className="logout-warning">This will clear all your local data</p>
      </div>

      <BottomNav />
    </div>
  );
}