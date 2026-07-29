import api from "../api/axios";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const forgotPassword = async (email) => {
  return api.post("/auth/forgot-password", {
    email,
  });
};

export const resetPassword = async (
  token,
  password
) => {
  return api.post(`/auth/reset-password/${token}`, {
    password,
  });
};