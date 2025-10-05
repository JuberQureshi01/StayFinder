import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import MainLayout from "../components/layout/MainLayout";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ fullName, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Create an Account</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white bg-[#FF385C] rounded-md hover:bg-red-600 disabled:bg-red-300"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FF385C] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
