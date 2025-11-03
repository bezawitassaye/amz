import React, { useState } from "react";
import { Search, Globe, User, Heart, ShoppingCart, LogOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../redux/filterSlice";
import { logout, login, signup } from "../redux/authSlice";
import type { RootState, AppDispatch } from "../redux/store";

// Safe JSON parse function
const parseJSON = (value: string | null) => {
  try {
    if (!value) return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.filters.searchQuery);
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartCount = useSelector((state: RootState) => state.cart?.items?.length || 0);
  const wishlistCount = useSelector((state: RootState) => state.wishlist?.items?.length || 0);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutPopup(false);
  };

  const handleAuthSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (authMode === "login") {
        const result = await dispatch(login({ email, password })).unwrap();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      } else {
        const result = await dispatch(signup({ full_name: name, email, password })).unwrap();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      setShowAuthPopup(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const storedUser = parseJSON(localStorage.getItem("user"));
  const displayUser = user || storedUser;

  return (
    <div className="flex justify-between items-center border-b-2 border-gray-100 pb-5 pt-1 pr-6">
      {/* Search */}
      <div className="relative w-1/2 flex-1 mx-10">
        <Search
          size={27}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-md h-14 rounded-md bg-indigo-50 placeholder:text-gray-400 pl-11 pr-4 text-sm focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6 relative">
        <div className="flex gap-2">
          <span className="text-md text-gray-600">ENG</span>
          <Globe className="text-gray-500" />
        </div>

        <button className="flex items-center gap-2 h-12 bg-indigo-100 text-indigo-500 px-3 py-1.5 rounded-md relative">
          <Heart className="w-5 h-5" />
          Wishlist
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
              {wishlistCount}
            </span>
          )}
        </button>

        <button className="flex items-center gap-2 h-12 bg-indigo-100 text-indigo-500 px-3 py-1.5 rounded-md relative">
          <ShoppingCart className="w-5 h-5" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full px-2 text-xs">
              {cartCount}
            </span>
          )}
        </button>

        {isAuthenticated && token ? (
          <div className="relative">
            <div
              className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xl font-bold cursor-pointer"
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
            >
              {displayUser?.full_name?.charAt(0).toUpperCase() || "U"}
            </div>

            {showLogoutPopup && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-3 w-40 z-50">
                <p className="text-gray-600 mb-2 text-sm">{displayUser?.full_name || "User"}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 w-full"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="flex items-center gap-2 h-12 bg-indigo-500 text-white px-3 py-1.5 rounded-md"
            onClick={() => setShowAuthPopup(true)}
          >
            <User className="w-5 h-5" /> Login
          </button>
        )}
      </div>

      {/* Auth Popup */}
      {showAuthPopup && (
        <div className="fixed top-5 right-5 w-80 bg-white p-6 rounded-xl shadow-lg border border-gray-200 z-50 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{authMode === "login" ? "Login" : "Sign Up"}</h2>
            <X className="w-5 h-5 cursor-pointer" onClick={() => setShowAuthPopup(false)} />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          {authMode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:outline-none"
          />
          <button
            onClick={handleAuthSubmit}
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-2 rounded-md mb-2 disabled:bg-indigo-300"
          >
            {loading ? "Processing..." : authMode === "login" ? "Login" : "Sign Up"}
          </button>
          <p className="text-sm text-gray-500 text-center">
            {authMode === "login" ? (
              <>
                Don't have an account?{" "}
                <span className="text-indigo-500 cursor-pointer" onClick={() => setAuthMode("signup")}>
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="text-indigo-500 cursor-pointer" onClick={() => setAuthMode("login")}>
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
