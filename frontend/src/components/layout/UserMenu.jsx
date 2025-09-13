import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, logoutUser } from "../../features/auth/authSlice";
import { Menu, Transition } from "@headlessui/react";
import {
  User as UserIcon,
  LogOut,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";

const UserMenu = ({ isAuthenticated, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/create-listing"
        className="hidden md:block text-gray-700 hover:text-[#FF385C] font-semibold"
      >
        Become a Host
      </Link>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2 border rounded-full p-2 hover:shadow-md transition">
          <UserIcon size={20} className="text-gray-700" />
          {isAuthenticated && user && (
            <span className="font-semibold text-sm hidden sm:block">
              {user.profile.fullName.split(" ")[0]}
            </span>
          )}
        </Menu.Button>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {isAuthenticated && user ? (
              <>
                <div className="px-1 py-1">
                  <Menu.Item>
                    <Link
                      to="/my-bookings"
                      className="group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100"
                    >
                      <Briefcase className="mr-2 h-5 w-5" /> My Bookings
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      to="/profile"
                      className="group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100"
                    >
                      <UserIcon className="mr-2 h-5 w-5" /> Profile
                    </Link>
                  </Menu.Item>
                </div>
               
                  <div className="px-1 py-1">
                    <Menu.Item>
                      <Link
                        to="/my-listings"
                        className="group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100"
                      >
                        <LayoutDashboard className="mr-2 h-5 w-5" /> Host
                        Dashboard
                      </Link>
                    </Menu.Item>
                  </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    <button
                      onClick={handleLogout}
                      className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-5 w-5" /> Logout
                    </button>
                  </Menu.Item>
                </div>
              </>
            ) : (
              <div className="px-1 py-1">
                <Menu.Item>
                  <Link
                    to="/login"
                    className="font-bold group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100"
                  >
                    Login
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    to="/register"
                    className="group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                </Menu.Item>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default UserMenu;
