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

