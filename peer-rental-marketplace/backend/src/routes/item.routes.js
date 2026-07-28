const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const itemController = require("../controllers/item.controller");

router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);

router.post("/", authMiddleware, itemController.createItem);

router.put("/:id", authMiddleware, itemController.updateItem);

router.delete("/:id", authMiddleware, itemController.deleteItem);

module.exports = router;