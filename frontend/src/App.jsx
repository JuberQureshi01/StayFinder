import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";
import AppSkeleton from "./components/skeleton/AppSkeleton";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const PropertyDetailPage = lazy(() => import("./pages/PropertyDetailPage"));
const AIDescriptionGeneratorPage = lazy(() => import("./pages/AIDescriptionGeneratorPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage"));
const MyListingsPage = lazy(() => import("./pages/MyListingsPage"));
const CreateListingPage = lazy(() => import("./pages/CreateListingPage"));
const EditListingPage = lazy(() => import("./pages/EditListingPage"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF385C]"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { initialLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (initialLoading) {
    return <AppSkeleton />;
  }

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/property/:propertyId" element={<PropertyDetailPage />} />
          <Route path="/ai-description-generator" element={<AIDescriptionGeneratorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/edit-listing/:propertyId" element={<EditListingPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
