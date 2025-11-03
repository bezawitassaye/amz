import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartState {
items: any[];
}

const initialState: CartState = {
items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const cartSlice = createSlice({
name: "cart",
initialState,
reducers: {
addToCart: (state, action: PayloadAction<any>) => {
state.items.push(action.payload);
localStorage.setItem("cart", JSON.stringify(state.items));
},
removeFromCart: (state, action: PayloadAction<string>) => {
state.items = state.items.filter((item) => item.id !== action.payload);
localStorage.setItem("cart", JSON.stringify(state.items));
},
},
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
