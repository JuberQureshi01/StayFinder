import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, logoutUser } from "../../features/auth/authSlice";
import {UserIcon} from "lucide-react"

const UserMenu = ({ isAuthenticated, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex gap-2 items-center " ref={menuRef}>
      <Link
        to="/create-listing"
        className="hidden md:block text-gray-700 hover:text-pink-500 font-semibold"
      >
        Become a Host
      </Link>

      <div
        className="flex items-center border rounded-full p-2 cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700"><UserIcon size={20} className="text-gray-700" /></span>
        {isAuthenticated && user && (
          <span className="hidden sm:block select-none font-semibold text-sm">
            {user.profile.fullName.split(" ")[0]}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md  z-50">
          {isAuthenticated && user ? (
            <div className="flex flex-col py-1">
              <Link
                to="/my-bookings"
                className="px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Bookings
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/my-listings"
                className="px-4 py-2 text-sm hover:bg-gray-100"
              >
                Host Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col py-1">
              <Link
                to="/login"
                className="px-4 py-2 text-sm hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
