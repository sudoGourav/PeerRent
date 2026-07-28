import api from "../api/axios";

export const createOrder = async (bookingId) => {
  const response = await api.post("/payments/create-order", {
    bookingId,
  });

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post(
    "/payments/verify",
    paymentData
  );

  return response.data;
};