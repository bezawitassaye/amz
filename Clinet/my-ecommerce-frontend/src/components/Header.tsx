import React, { useState } from "react";
import { Search, Globe, User, Heart, ShoppingCart, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../redux/filterSlice";
import { logout } from "../redux/authSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: any) => state.filters.searchQuery);
  const { user, token } = useSelector((state: any) => state.auth);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Example counts
  const cartCount = 3; // You’ll replace these with real data
  const wishlistCount = 2;

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutPopup(false);
  };

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

      {/* Right side */}
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

        {token ? (
          <div className="relative">
            <div
              className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xl font-bold cursor-pointer"
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
            >
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>

            {showLogoutPopup && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-3 w-40 z-50">
                <p className="text-gray-600 mb-2 text-sm">{user?.full_name}</p>
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
            onClick={() => alert("Please login or sign up")}
          >
            <User className="w-5 h-5" /> Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
