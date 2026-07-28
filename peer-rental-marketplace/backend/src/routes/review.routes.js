const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const reviewController = require("../controllers/review.controller");

// Create Review
router.post(
  "/",
  authMiddleware,
  reviewController.createReview
);

// Get Reviews of an Item
router.get(
  "/item/:itemId",
  reviewController.getItemReviews
);

module.exports = router;