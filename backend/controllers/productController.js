import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      seller: req.user._id,
      name,
      description,
      price,
      stock: stock || 0,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



/* GET PRODUCTS WITH PAGINATION */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({
      isActive: true,
    });

    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* GET SINGLE PRODUCT */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

