import api from "../api/axios";

export const addToWishlist = async (itemId) => {
  const response = await api.post("/wishlist", {
    itemId,
  });

  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const removeFromWishlist = async (itemId) => {
  const response = await api.delete(`/wishlist/${itemId}`);
  return response.data;
};