import { createSlice } from "@reduxjs/toolkit";

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type Booking = {
  no: string;
  activityId: string;
  activityName: string;
  date: string | null; // ISO string (serializable)
  seniors: number;
  adults: number;
  youths: number;
  children: number;
  babies: number;
  totalPrice: number;
  pickupLocation: string;
  schedule: string;
};

export interface BookingState {
  customer: Customer;
  booking: Booking;
}

const initialState: BookingState = {
  customer: { name: "", email: "", phone: "" },
  booking: {
    no: "",
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
    setCustomer(state, action) {
      state.customer = action.payload;
    },
    setBookingNo(state, action) {
      state.booking.no = action.payload;
    },
    setBooking(state, action) {
      state.booking = action.payload;
    },
    // Si prefieres despachar todo junto desde el form:
    setAll(state, action) {
      state.customer = action.payload.customer;
      state.booking = action.payload.booking;
    },
    resetBooking() {
      return initialState;
    },
  },
});

export const { setCustomer, setBooking, setAll, resetBooking, setBookingNo } = bookingSlice.actions;
export default bookingSlice.reducer;
