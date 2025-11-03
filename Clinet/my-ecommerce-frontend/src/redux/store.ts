import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import authReducer from "./authSlice"; // import it

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    auth: authReducer, // add it here ✅
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
