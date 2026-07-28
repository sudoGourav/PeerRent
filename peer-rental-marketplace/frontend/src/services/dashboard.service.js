import api from "../api/axios";

export const getOwnerDashboard = async () => {
  const response = await api.get("/dashboard/owner");
  return response.data;
};

export const getRevenueSummary = async () => {
  const response = await api.get("/dashboard/revenue");
  return response.data;
};

export const getRecentBookings = async () => {
  const response = await api.get("/dashboard/recent-bookings");
  return response.data;
};