import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PickupPage from "./pages/PickupPage";
import DropoffPage from "./pages/DropoffPage";
import PaymentPage from "./pages/PaymentPage";
import TopUpPage from "./pages/TopUpPage";
import ReviewPage from "./pages/ReviewPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import TrackingPage from "./pages/TrackingPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ForgotPassword from "./pages/ForgotPassword";
import SplashPage from "./pages/SplashPage";
import OnboardingPage from "./pages/OnboardingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/pickup" element={<PickupPage />} />
      <Route path="/dropoff" element={<DropoffPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/topup" element={<TopUpPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/tracking" element={<TrackingPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
