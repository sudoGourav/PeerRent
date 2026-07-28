const wishlistService = require("../services/wishlist.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.addToWishlist = asyncHandler(async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    throw new ApiError(400, "Item ID is required");
  }

  const wishlist = await wishlistService.addToWishlist(
    req.user.id,
    itemId
  );

  res.status(201).json({
    success: true,
    message: "Item added to wishlist",
    data: wishlist,
  });
});

exports.getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);

  res.json({
    success: true,
    data: wishlist,
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const result = await wishlistService.removeFromWishlist(
    req.user.id,
    req.params.itemId
  );

  res.json({
    success: true,
    message: result.message,
  });
});