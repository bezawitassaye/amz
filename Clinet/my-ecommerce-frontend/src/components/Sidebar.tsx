import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setCategory, toggleType } from "../redux/filterSlice";
import { setMinPrice, setMaxPrice } from "../redux/filterSlice";

const categoryTypes: Record<string, string[]> = {
  Shoes: ["Nike", "Adidas", "Crocs", "Puma", "Sneakers"],
  Clothing: ["Dress", "T-Shirt", "Jeans", "Hoodie", "Jacket"],
  Electronics: ["iPhone", "Samsung", "Laptop", "Headphones", "Smartwatch"],
  Accessories: ["Watch", "Sunglasses", "Handbag", "Wallet", "Belt"],
  "Home & Kitchen": ["Coffee Maker", "Air Fryer", "Vacuum Cleaner", "Blender"],
  Beauty: ["Perfume", "Lipstick", "Makeup Kit", "Hair Dryer", "Face Cream"],
};

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { category, types } = useSelector((state: RootState) => state.filters);

  const categories = [
    "Shoes",
    "Clothing",
    "Electronics",
    "Accessories",
    "Home & Kitchen",
    "Beauty",
  ];

  // Get types for the currently selected category
  const availableTypes = category ? categoryTypes[category] || [] : [];

  const handleTypeChange = (type: string) => {
    // Radio behavior: deselect previous type and select new one
    if (types.includes(type)) {
      dispatch(toggleType(type)); // deselect if clicked again
    } else {
      // clear previous type and select new one
      types.forEach((t) => dispatch(toggleType(t)));
      dispatch(toggleType(type));
    }
  };

  return (
    <aside className="w-64 bg-white p-6 pr-0 pl-0 border-r-2 border-gray-100 hidden md:block">
      <div className="flex justify-center items-center border-gray-100 border-b-2">
        <div className="h-20 flex justify-center items-center">
          <img src="/Logo.png" alt="logo" className="h-40" />
        </div>
      </div>

      <div className="flex items-center flex-col justify-center">
        {/* Category Section */}
        <h2 className="text-lg font-semibold mb-6 mt-4">Category</h2>
        <ul className="space-y-2 mb-6 text-gray-600">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => dispatch(setCategory(cat))}
              className={`cursor-pointer font-medium ${category === cat ? "text-indigo-600" : "hover:text-indigo-500"
                }`}
            >
              {cat}
            </li>
          ))}
        </ul>

        {/* Type Section (single selection) */}
        {category && (
          <>
            <h3 className="text-lg font-semibold mb-2">Type</h3>
            <div className="flex flex-col space-y-1 text-sm text-gray-600 mb-6">
              {availableTypes.map((type) => (
                <label key={type} className="cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    checked={types.includes(type)}
                    onChange={() => handleTypeChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </>
        )}

        {/* Color Section */}
        <h3 className="text-lg font-semibold mb-2">Price</h3>
        {/* Price Range Inputs */}
        <div className="flex flex-co items-center gap-3">
          <input
            type="number"
            placeholder="Min "
            className="h-12 w-20 bg-indigo-50 text-gray-500 px-3 py-1.5 focus:outline-none rounded-md"
            value={useSelector((state: RootState) => state.filters.minPrice) || ""}
            onChange={(e) => dispatch(setMinPrice(e.target.value ? Number(e.target.value) : null))}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max "
            className="h-12 w-20 bg-indigo-50 text-gray-500 px-3 py-1.5 focus:outline-none rounded-md"
            value={useSelector((state: RootState) => state.filters.maxPrice) || ""}
            onChange={(e) => dispatch(setMaxPrice(e.target.value ? Number(e.target.value) : null))}
          />
        </div>


        <button className="w-50 bg-indigo-600 text-white py-2 rounded-md mt-6">
          Apply
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
