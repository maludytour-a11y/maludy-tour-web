import { createSlice } from "@reduxjs/toolkit";

export interface bookingSlice {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  booking: {
    activityId: string;
    activityName: String;
    date: string | null;
    seniors: number;
    adults: number;
    youths: number;
    children: number;
    babies: number;
    totalPrice: number;
    pickupLocation: string;
    schedule: string;
  };
}

const initialState: bookingSlice = {
  customer: {
    name: "",
    email: "",
    phone: "",
  },
  booking: {
    activityId: "",
    activityName: "",
    date: null,
    seniors: 0,
    adults: 0,
    youths: 0,
    children: 0,
    babies: 0,
    totalPrice: 0,
    pickupLocation: "",
    schedule: "",
  },
};

export const bookingSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setBookingData: (state, action) => {
      state.booking = action.payload;
    },
  },
});

export const { setBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
