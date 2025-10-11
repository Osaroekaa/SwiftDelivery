import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaWallet, FaPlus, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import BottomNav from "../component/BottomNav";
import "./TopUpPage.css";

export default function TopUpPage() {
  const [amount, setAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [shortfall, setShortfall] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Quick top-up amounts
  const quickAmounts = [1000, 2000, 5000, 10000];

  useEffect(() => {
    loadBalanceData();
  }, []);

  const loadBalanceData = () => {
    try {
      // Get current balance
      const balance = Number(localStorage.getItem("userBalance") || 2500);
      setCurrentBalance(balance);

      // Get required amount (from payment page)
      const required = Number(localStorage.getItem("requiredAmount") || localStorage.getItem("estimatedPrice") || 0);
      setRequiredAmount(required);

      // Calculate shortfall
      const deficit = Math.max(0, required - balance);
      setShortfall(deficit);

      // Pre-fill with shortfall amount if it exists
      if (deficit > 0) {
        setAmount(deficit.toString());
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading balance data:", error);
      setIsLoading(false);
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const handleTopUp = () => {
    console.log("Top-up button clicked"); // Debug log
    console.log("Amount:", amount, "Type:", typeof amount); // Debug log
    
    const topUpAmount = Number(amount);
    console.log("Parsed amount:", topUpAmount); // Debug log
    
    if (!amount || amount.trim() === "" || topUpAmount <= 0 || isNaN(topUpAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    const minAmount = getMinimumTopUp();
    if (topUpAmount < minAmount) {
      alert(`Minimum top-up amount is ₦${minAmount}`);
      return;
    }

    try {
      // Get current balance safely
      const currentBalanceStr = localStorage.getItem("userBalance") || "2500";
      const currentBalanceNum = Number(currentBalanceStr);
      console.log("Current balance:", currentBalanceNum); // Debug log
      
      const newBalance = currentBalanceNum + topUpAmount;
      console.log("New balance will be:", newBalance); // Debug log

      // Save new balance
      localStorage.setItem("userBalance", newBalance.toString());
      console.log("Balance saved to localStorage"); // Debug log

      // Show success message
      const message = `Successfully added ₦${topUpAmount}!\n\nOld Balance: ₦${currentBalanceNum}\nNew Balance: ₦${newBalance}`;
      alert(message);

      // Clear the input
      setAmount("");
      
      // Update local state
      setCurrentBalance(newBalance);

      // Navigate back to payment page after a short delay
      setTimeout(() => {
        navigate("/payment");
      }, 1000);

    } catch (error) {
      console.error("Error during top-up:", error);
      alert("An error occurred while processing your top-up. Please try again.");
    }
  };

  const getMinimumTopUp = () => {
    return Math.max(shortfall > 0 ? shortfall : 500, 100); // Minimum ₦100 top-up
  };

  const isButtonDisabled = () => {
    if (!amount || amount.trim() === "") return true;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return true;
    if (numAmount < getMinimumTopUp()) return true;
    return false;
  };

  if (isLoading) {
    return (
      <div className="topup-container">
        <div className="loading-spinner">Loading wallet details...</div>
      </div>
    );
  }

  return (
    <div className="topup-container">
      {/* Header */}
      <header className="topup-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
        <h2>💰 Top Up Wallet</h2>
      </header>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <FaWallet className="wallet-icon" />
          <h3>Wallet Overview</h3>
        </div>

        <div className="balance-details">
          <div className="balance-item">
            <span className="label">Current Balance:</span>
            <span className="amount current">₦{currentBalance}</span>
          </div>

          {requiredAmount > 0 && (
            <>
              <div className="balance-item">
                <span className="label">Required Fee:</span>
                <span className="amount required">₦{requiredAmount}</span>
              </div>

              <div className="balance-item shortfall">
                <span className="label">
                  {shortfall > 0 ? (
                    <>
                      <FaExclamationCircle className="status-icon insufficient" />
                      Shortfall:
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="status-icon sufficient" />
                      Surplus:
                    </>
                  )}
                </span>
                <span className={`amount ${shortfall > 0 ? 'deficit' : 'surplus'}`}>
                  ₦{Math.abs(shortfall > 0 ? shortfall : currentBalance - requiredAmount)}
                </span>
              </div>
            </>
          )}
        </div>

        {shortfall > 0 && (
          <div className="shortfall-notice">
            <FaExclamationCircle className="notice-icon" />
            <p>You need at least ₦{shortfall} more to complete your order</p>
          </div>
        )}
      </div>

      {/* Top Up Card */}
      <div className="topup-card">
        <h3>💳 Add Funds</h3>
        
        {/* Manual Amount Input */}
        <div className="amount-input-section">
          <label htmlFor="amount">Enter amount to add:</label>
          <div className="input-wrapper">
            <span className="currency-symbol">₦</span>
            <input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="topup-input"
              min={getMinimumTopUp()}
            />
          </div>
          <p className="input-hint">Minimum top-up: ₦{getMinimumTopUp()}</p>
          {amount && Number(amount) > 0 && (
            <p className="amount-status">
              {Number(amount) < getMinimumTopUp() ? 
                <span style={{color: '#dc3545'}}>Amount too low (minimum ₦{getMinimumTopUp()})</span> :
                <span style={{color: '#28a745'}}>Amount valid ✓</span>
              }
            </p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="quick-amounts">
          <h4>Quick Top-Up Options:</h4>
          <div className="quick-buttons">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                className={`quick-btn ${amount === quickAmount.toString() ? 'selected' : ''}`}
                onClick={() => handleQuickAmount(quickAmount)}
              >
                <FaPlus className="plus-icon" />
                ₦{quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Add Funds Button */}
        <button 
          className="add-funds-btn" 
          onClick={handleTopUp}
          disabled={isButtonDisabled()}
          type="button"
        >
          <FaWallet className="btn-icon" />
          {amount && Number(amount) > 0 ? `Add ₦${amount} to Wallet` : 'Enter Amount to Add'}
        </button>

        {/* New Balance Preview */}
        {amount && Number(amount) > 0 && (
          <div className="balance-preview">
            <p>New balance after top-up: <strong>₦{currentBalance + Number(amount)}</strong></p>
            {requiredAmount > 0 && (currentBalance + Number(amount)) >= requiredAmount && (
              <p className="success-message">
                <FaCheckCircle className="success-icon" />
                You'll have enough funds to complete your order!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div> 
  );
}