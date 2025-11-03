import { useEffect, useState } from "react";
import type { Product } from "../types";
import { ShoppingCart, X, Heart, ArrowUp, ArrowDown } from "lucide-react";
import type { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, toggleType } from "../redux/filterSlice";
import { login, signup } from "../redux/authSlice";

import type { AppDispatch, } from "../redux/store";

export default function ProductList() {
  const dispatch = useDispatch<AppDispatch>();


  const [products, setProducts] = useState<Product[]>([]);
  const { category, types } = useSelector((state: RootState) => state.filters);
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);
  const searchQuery = useSelector((state: RootState) => state.filters.searchQuery);
  const { minPrice, maxPrice } = useSelector((state: RootState) => state.filters);
 const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);

  // Auth popup state
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  dispatch(login({ email, password }));
dispatch(signup({ name, email, password }));


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categoryTypes: Record<string, string[]> = {
    Shoes: ["nike", "adidas", "crocs", "puma", "sneakers"],
    Clothing: ["dress", "t-shirt", "jeans", "hoodie", "jacket"],
    Electronics: ["Apple iPhone", "samsung", "laptop", "headphones", "smartwatch"],
    Accessories: ["watch", "sunglasses", "handbag", "wallet", "belt"],
    "Home & Kitchen": ["coffee maker", "air fryer", "vacuum cleaner", "blender"],
    Beauty: ["perfume", "lipstick", "makeup kit", "hair dryer", "face cream"],
  };

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Filter products
  let filteredProducts = products
    .filter((p) => {
      const title = p.title?.toLowerCase() || "";
      const searchMatch = title.includes(searchQuery.toLowerCase());
      if (!category) return searchMatch;
      const selectedTypes = types.length > 0 ? types : categoryTypes[category] || [];
      return selectedTypes.some((t) => title.includes(t.toLowerCase())) && searchMatch;
    })
    .filter((p) => {
      const priceValue = p.price ? parseFloat(p.price.replace(/[^0-9.]/g, "")) : 0;
      return (
        (minPrice === null || priceValue >= minPrice) &&
        (maxPrice === null || priceValue <= maxPrice)
      );
    });

  if (sortPrice) {
    filteredProducts.sort((a, b) => {
      const priceA = a.price ? parseFloat(a.price.replace(/[^0-9.]/g, "")) : 0;
      const priceB = b.price ? parseFloat(b.price.replace(/[^0-9.]/g, "")) : 0;
      return sortPrice === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Handle Add to Cart or Wishlist
  const handleAddToCartOrWishlist = () => {
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      setAuthMode("login");
      return;
    }
    alert("Item added to cart!");
  };

  // Handle Login / Signup
  const handleAuthSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        authMode === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/signup";

      const body =
        authMode === "login"
          ? { email, password }
          : { name, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // Store token in localStorage & Redux
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user?.name || email);
      if (authMode === "login") {
    await dispatch(login({ email, password }));
  } else {
    await dispatch(signup({ name, email, password }));
  }
  setShowAuthPopup(false);
      setShowAuthPopup(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 relative">
      {/* Filters & Sort */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {category && (
          <button
            onClick={() => dispatch(setCategory(null))}
            className="flex items-center gap-2 h-12 bg-indigo-50 text-gray-400 px-3 py-1.5 rounded-md"
          >
            Category: {category} <X className="w-4 h-4" />
          </button>
        )}
        {types.length > 0 &&
          types.map((t) => (
            <button
              key={t}
              onClick={() => dispatch(toggleType(t))}
              className="flex items-center gap-2 h-12 bg-indigo-50 text-gray-400 px-3 py-1.5 rounded-md"
            >
              Type: {t} <X className="w-4 h-4" />
            </button>
          ))}
        <div className="relative">
          <select
            value={sortPrice || ""}
            onChange={(e) =>
              setSortPrice(e.target.value === "" ? null : (e.target.value as "asc" | "desc"))
            }
            className="h-12 bg-indigo-50 text-gray-400 px-3 py-1.5 rounded-md appearance-none pr-8"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            {sortPrice === "asc" && <ArrowUp className="w-4 h-4 text-gray-500" />}
            {sortPrice === "desc" && <ArrowDown className="w-4 h-4 text-gray-500" />}
          </div>
        </div>
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          {products.length === 0 ? "Loading products..." : "No products match your filters."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentProducts.map((p) => (
            <div
              key={p.asin}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform relative hover:-translate-y-1 cursor-pointer"
            >
              <Heart
                className="absolute top-3 right-3.5 w-6 h-6 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                onClick={handleAddToCartOrWishlist}
              />
              <div className="pb-10"></div>
              <img src={p.photo} alt={p.title} className="w-full h-60 object-contain rounded-t-xl " />
              <div className="p-4 ">
                <h2 className="font-semibold text-lg text-gray-600 line-clamp-2">{p.title}</h2>
                <div className="flex justify-between items-center pt-4">
                  <div className="flex flex-col gap-0">
                    <p className="text-gray-500 text-sm">⭐ {p.rating || "N/A"}</p>
                    <p className="text-gray-600 font-bold mt-1">${p.price}</p>
                  </div>
                  <button
                    className="flex w-12 justify-center items-center gap-2 h-12 text-white bg-indigo-500 px-3 py-1.5 rounded-md"
                    onClick={handleAddToCartOrWishlist}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-10 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
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
                <span
                  className="text-indigo-500 cursor-pointer"
                  onClick={() => setAuthMode("signup")}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-indigo-500 cursor-pointer"
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
