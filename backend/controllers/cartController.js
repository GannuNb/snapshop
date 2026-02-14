import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js"; // ✅ THIS LINE WAS MISSING

/* GET CART */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image"
    );

    res.json(cart ? cart : { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD TO CART */
export const addToCart = async (req, res) => {
  const { productId } = req.body;

  const cart =
    (await Cart.findOne({ user: req.user._id })) ||
    (await Cart.create({ user: req.user._id, items: [] }));

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += 1;
  } else {
    cart.items.push({ product: productId, quantity: 1 });
  }

  await cart.save();

  const populatedCart = await cart.populate(
    "items.product",
    "name price"
  );

  res.json(populatedCart);
};

/* REMOVE ITEM */
export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );

  await cart.save();

  const populatedCart = await cart.populate(
    "items.product",
    "name price"
  );

  res.json(populatedCart);
};

/* UPDATE QUANTITY */
export const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (item) {
    item.quantity = quantity;
    await cart.save();
  }

  const populatedCart = await cart.populate(
    "items.product",
    "name price"
  );

  res.json(populatedCart);
};


/* BUY NOW (DIRECT ORDER) */
export const buyNow = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // 🔥 IMPORTANT: overwrite cart safely
    cart.items = [
      {
        product: product._id,
        quantity: quantity || 1,
      },
    ];

    await cart.save();

    res.json({ message: "Buy Now cart created" });
  } catch (error) {
    console.error("Buy Now Error:", error);
    res.status(500).json({ message: error.message });
  }
};

