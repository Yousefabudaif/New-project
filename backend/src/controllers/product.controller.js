const Product = require("../models/Product");

async function listProducts(req, res, next) {
  try {
    const { search = "", category = "", featured = "", sort = "newest" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      name: { name: 1 }
    };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortMap[sort] || sortMap.newest);

    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, getProduct };
