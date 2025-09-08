import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./features/bookingSlice";

export const store = configureStore({
  reducer: {
    bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
