const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const authMiddleware = require("../middleware/auth.middleware");
const itemController = require("../controllers/item.controller");

router.get("/", itemController.getAllItems);
router.get("/my", authMiddleware, itemController.getMyItems);
router.get("/:id", itemController.getItemById);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  itemController.createItem
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  itemController.updateItem
);

router.delete("/:id", authMiddleware, itemController.deleteItem);

module.exports = router;