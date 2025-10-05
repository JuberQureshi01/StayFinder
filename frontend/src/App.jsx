import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import AIDescriptionGeneratorPage from "./pages/AIDescriptionGeneratorPage";
import ProfilePage from "./pages/ProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MyListingsPage from "./pages/MyListingsPage";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";
import AppSkeleton from "./components/skeleton/AppSkeleton";

function App() {
  const dispatch = useDispatch();
  const { loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (authLoading) {
    return <AppSkeleton />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/property/:propertyId" element={<PropertyDetailPage />} />
        <Route
          path="/ai-description-generator"
          element={<AIDescriptionGeneratorPage />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/edit-listing/:propertyId" element={<EditListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
