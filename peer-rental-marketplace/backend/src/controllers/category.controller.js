const asyncHandler = require("../middleware/asyncHandler");
const categoryService = require("../services/category.service");

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();

  res.json({
    success: true,
    data: categories,
  });
});

exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.json({
    success: true,
    data: category,
  });
});