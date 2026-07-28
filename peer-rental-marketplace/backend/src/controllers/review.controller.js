const reviewService = require("../services/review.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createReview = asyncHandler(async (req, res) => {
  const { itemId, rating, comment } = req.body;

  if (!itemId || !rating || !comment) {
    throw new ApiError(400, "All fields are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const review = await reviewService.createReview(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: review,
  });
});

exports.getItemReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getItemReviews(
    req.params.itemId
  );

  res.json({
    success: true,
    data: result,
  });
});