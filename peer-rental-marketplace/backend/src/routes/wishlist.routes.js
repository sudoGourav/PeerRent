const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlist.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.post("/", wishlistController.addToWishlist);

router.get("/", wishlistController.getWishlist);

router.delete("/:itemId", wishlistController.removeFromWishlist);

module.exports = router;