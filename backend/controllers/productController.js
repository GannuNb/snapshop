import Product from "../models/productModel.js";

import PendingProduct from "../models/pendingProductModel.js";
import { formatImage } from "../utils/imageHelper.js";
import Category from "../models/categoryModel.js";
import sharp from "sharp";

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
    // if (req.file) {
    //   productData.image = {
    //     data: req.file.buffer,
    //     contentType: req.file.mimetype,
    //   };
    // }

    if (req.file) {

        const compressedImage = await sharp(req.file.buffer)
          .resize(500) // resize width
          .jpeg({ quality: 70 }) // compress quality
          .toBuffer();

        productData.image = {
          data: compressedImage,
          contentType: "image/jpeg",
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

    const formattedProducts = products.map((p) => {
      const obj = p.toObject();

      obj.image = formatImage(obj.image);

      return obj;
    });

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.image?.data) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", product.image.contentType);

    // ⭐ IMPORTANT: browser caching
    // res.set("Cache-Control", "public, max-age=86400");
    res.set("Cache-Control", "public, max-age=31536000, immutable");

    res.send(product.image.data);
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

    // ⭐ CREATE PRODUCT
    const product = await Product.create({
      seller: pending.seller,
      name: pending.name,
      description: pending.description,
      price: pending.price,
      stock: pending.stock,
      category: pending.category,
      image: pending.image,
    });

    // DELETE ONLY AFTER SUCCESS
    await PendingProduct.findByIdAndDelete(id);

    res.json({
      message: "Product approved successfully",
      product,
    });
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
    /* APPROVED PRODUCTS */
    const approved = await Product.find({
      seller: req.user._id,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    /* PENDING PRODUCTS */
    const pending = await PendingProduct.find({
      seller: req.user._id,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      approved,
      pending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
      isActive: true,
    })
      .select("name category")
      .populate("category", "name")
      .limit(5);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const { search, category, minPrice, maxPrice } = req.query;

    let filter = { isActive: true };

    /* 🔎 SEARCH */
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }
      ];
    }

    /* 📦 MULTIPLE CATEGORY SUPPORT */
    if (category) {
      const categoryArray = category.split(",");

      const categoryDocs = await Category.find({
        name: { $in: categoryArray },
      });

      const categoryIds = categoryDocs.map((c) => c._id);

      filter.category = { $in: categoryIds };
    }

    /* 💰 PRICE */
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

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

