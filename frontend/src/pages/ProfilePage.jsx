import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserAvatar,
} from "../features/users/userSlice";
import MainLayout from "../components/layout/MainLayout";
import { User, Mail, Calendar, Edit2 } from "lucide-react";
import { format } from "date-fns";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth); 
  const [fullName, setFullName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(user.profile.fullName || "");
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(updateUserAvatar(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ fullName}));
  };

  if (loading && !profile) {
    return (
      <MainLayout>
        <div className="text-center p-10">Loading Profile...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={
                    user.profile.profilePictureUrl ||
                    `https://ui-avatars.com/api/?name=${fullName}&background=random&color=fff&size=128`
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-[#FF385C] text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <Edit2 size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className="text-xl font-bold flex gap-2 justify-center"><User/>{user.profile.fullName}</h2>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="flex items-center justify-center">
                  <Mail size={14} className="mr-2" /> {user?.email}
                </p>
                <p className="flex items-center justify-center">
                  <Calendar size={14} className="mr-2" /> Joined{" "}
                  {user && format(new Date(user.createdAt), "MMMM yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF385C] text-white font-bold py-3 rounded-lg hover:bg-red-600 transition disabled:bg-red-300"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
