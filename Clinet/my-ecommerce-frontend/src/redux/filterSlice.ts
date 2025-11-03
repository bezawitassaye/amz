import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  category: string | null;
  types: string[];
  colors: string[];
  availableTypes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  searchQuery: string; // 🆕 added
}

const initialState: FilterState = {
  category: null,
  types: [],
  colors: [],
  availableTypes: [],
  minPrice: null,
  maxPrice: null,
  searchQuery: "", // 🆕 added
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string | null>) {
      state.category = action.payload;
      state.types = [];
      switch (action.payload) {
        case "Shoes":
          state.availableTypes = ["Nike", "Adidas", "Crocs", "Puma", "New Balance"];
          break;
        case "Electronics":
          state.availableTypes = ["Apple iPhone", "Samsung", "Laptop", "Headphones", "Smartwatch"];
          break;
        case "Clothing":
          state.availableTypes = ["Dress", "T-Shirt", "Jeans", "Hoodie", "Jacket"];
          break;
        case "Home & Kitchen":
          state.availableTypes = ["Coffee Maker", "Air Fryer", "Vacuum Cleaner", "Blender"];
          break;
        case "Beauty":
          state.availableTypes = ["Perfume", "Lipstick", "Makeup Kit", "Hair Dryer", "Face Cream"];
          break;
        case "Accessories":
          state.availableTypes = ["Watch", "Sunglasses", "Handbag", "Wallet", "Belt"];
          break;
        default:
          state.availableTypes = [];
      }
    },

    toggleType(state, action: PayloadAction<string>) {
      const index = state.types.indexOf(action.payload);
      if (index >= 0) state.types.splice(index, 1);
      else state.types.push(action.payload);
    },

    setMinPrice(state, action: PayloadAction<number | null>) {
      state.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<number | null>) {
      state.maxPrice = action.payload;
    },

    // 🆕 new search reducer
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    clearFilters(state) {
      state.types = [];
      state.colors = [];
      state.category = null;
      state.availableTypes = [];
      state.minPrice = null;
      state.maxPrice = null;
      state.searchQuery = ""; // 🆕 reset search
    },
  },
});

export const {
  setCategory,
  toggleType,
  clearFilters,
  setMinPrice,
  setMaxPrice,
  setSearchQuery, // 🆕 export it
} = filterSlice.actions;

export default filterSlice.reducer;
