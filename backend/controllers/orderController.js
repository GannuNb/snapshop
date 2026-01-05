import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";


export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "price seller"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      seller: item.product.seller,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
    });

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= SELLER ORDERS ================= */
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Find orders where ANY item belongs to this seller
    const orders = await Order.find({
      "items.seller": sellerId,
    })
      .populate("user", "name email")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* SELLER UPDATE STATUS */
export const sellerUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Packed", "Shipped"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check seller owns at least one item
    const ownsProduct = order.items.some(
      (item) =>
        item.seller.toString() === req.user._id.toString()
    );

    if (!ownsProduct) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ADMIN UPDATE STATUS */
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN GET ALL ORDERS ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price")
      .populate("items.seller", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
