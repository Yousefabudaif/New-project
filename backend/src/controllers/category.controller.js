const Category = require("../models/Category");

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

module.exports = { listCategories };
