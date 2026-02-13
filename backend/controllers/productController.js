import Product from "../models/productModel.js";

import PendingProduct from "../models/pendingProductModel.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const productData = {
      seller: req.user._id,
      name,
      description,
      price,
      stock: stock || 0,
      category,
    };

    // ⭐ IMAGE SAVE
    if (req.file) {
      productData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const product = await PendingProduct.create(productData);

    res.status(201).json({
      message: "Product submitted for approval",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getPendingProducts = async (req, res) => {
  try {
    const products = await PendingProduct.find({})
      .populate("seller", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const pending = await PendingProduct.findById(id);

    if (!pending) {
      return res.status(404).json({ message: "Product not found" });
    }

    // create real product
    const product = await Product.create({
      seller: pending.seller,
      name: pending.name,
      description: pending.description,
      price: pending.price,
      stock: pending.stock,
      category: pending.category,
    });

    // remove pending entry
    await pending.deleteOne();

    res.json({ message: "Product approved", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const pending = await PendingProduct.findById(id);

    if (!pending) {
      return res.status(404).json({ message: "Product not found" });
    }

    // DELETE rejected product from pending list
    await pending.deleteOne();

    res.json({ message: "Product rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
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

