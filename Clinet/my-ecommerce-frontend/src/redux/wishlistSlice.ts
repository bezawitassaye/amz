import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
items: any[];
}

const initialState: WishlistState = {
items: JSON.parse(localStorage.getItem("wishlist") || "[]"),
};

const wishlistSlice = createSlice({
name: "wishlist",
initialState,
reducers: {
addToWishlist: (state, action: PayloadAction<any>) => {
state.items.push(action.payload);
localStorage.setItem("wishlist", JSON.stringify(state.items));
},
removeFromWishlist: (state, action: PayloadAction<string>) => {
state.items = state.items.filter((item) => item.id !== action.payload);
localStorage.setItem("wishlist", JSON.stringify(state.items));
},
},
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
