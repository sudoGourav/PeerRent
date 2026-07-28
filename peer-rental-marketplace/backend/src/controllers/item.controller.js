const itemService = require("../services/item.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createItem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    dailyRate,
    deposit,
    categoryId,
  } = req.body;

  if (
    !title ||
    !description ||
    !dailyRate ||
    !deposit ||
    !categoryId
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const item = await itemService.createItem({
    title,
    description,
    dailyRate,
    deposit,
    categoryId,
    ownerId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Item created successfully",
    data: item,
  });
});

exports.getAllItems = asyncHandler(async (req, res) => {
  const items = await itemService.getAllItems();

  res.json({
    success: true,
    data: items,
  });
});

exports.getItemById = asyncHandler(async (req, res) => {
  const item = await itemService.getItemById(req.params.id);

  res.json({
    success: true,
    data: item,
  });
});