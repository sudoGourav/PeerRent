import api from "../api/axios";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
};
export const getUnavailableDates = async (itemId) => {
  const response = await api.get(
    `/bookings/item/${itemId}/unavailable-dates`
  );

  return response.data;
};