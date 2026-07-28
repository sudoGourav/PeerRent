import api from "../api/axios";

export const getItemReviews = async (itemId) => {
  const response = await api.get(`/reviews/item/${itemId}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};