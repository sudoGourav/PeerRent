import api from "../api/axios";

export const getItems = async () => {
  const response = await api.get("/items");
  return response.data;
};

export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (formData) => {
  const response = await api.post("/items", formData);
  return response.data;
};
export const getMyItems = async () => {
  const response = await api.get("/items/my");
  return response.data;
};