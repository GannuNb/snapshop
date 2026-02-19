import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";


/* BUY NOW - DIRECT ORDER (NO CART) */
export const buyNowOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const qty = quantity || 1;

    const order = await Order.create({
      user: req.user._id,

      shippingAddress, // ⭐ SAVE ADDRESS HERE

      items: [
        {
          product: product._id,
          quantity: qty,
          price: product.price,
          seller: product.seller,
        },
      ],
      totalAmount: product.price * qty,
      status: "Placed",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Buy Now Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "price seller",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* ⭐ GET DEFAULT ADDRESS */
    const user = await User.findById(req.user._id);

    const shippingAddress =
      user.savedAddresses.find((a) => a.isDefault) || user.savedAddresses[0];

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Please add shipping address first",
      });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      seller: item.product.seller,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: req.user._id,
      shippingAddress, // ⭐ FIXED
      items,
      totalAmount,
      status: "Placed",
    });

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* CREATE RAZORPAY ORDER */
export const createPaymentOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const qty = quantity || 1;
    const amount = product.price * qty * 100; // Razorpay uses paise

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      product,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* VERIFY PAYMENT & CREATE ORDER */
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      shippingAddress,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 1️⃣ VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 2️⃣ PRODUCT CHECK
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const qty = quantity || 1;

    // 3️⃣ CREATE ORDER
    const order = await Order.create({
      user: req.user._id,
      shippingAddress,
      items: [{ product: product._id, quantity: qty, price: product.price, seller: product.seller }],
      totalAmount: product.price * qty,
      paymentMethod: "ONLINE",
      paymentStatus: "Paid",
      paymentInfo: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
      status: "Placed",
    });

    // 4️⃣ RESPOND TO FRONTEND IMMEDIATELY
    res.status(201).json({
      success: true,
      message: "Payment verified & order placed",
      order,
    });

    // 5️⃣ SEND EMAIL IN BACKGROUND
    const user = await User.findById(req.user._id);

    sendEmail({
      to: user.email,
      subject: "Order Confirmed 🎉",
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your payment was successful.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> ₹${order.totalAmount}</p>
        <p>Status: ${order.status}</p>
      `,
    }).catch(err => console.error("Email sending failed:", err));

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* COD ORDER */
export const createCODOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const qty = quantity || 1;

    const order = await Order.create({
      user: req.user._id,
      shippingAddress,
      items: [{ product: product._id, quantity: qty, price: product.price, seller: product.seller }],
      totalAmount: product.price * qty,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Placed",
    });

    res.status(201).json({
      success: true,
      message: "COD Order placed successfully",
      order,
    });

    const user = await User.findById(req.user._id);

    sendEmail({
      to: user.email,
      subject: "COD Order Confirmed 🧾",
      html: `
        <h2>Your COD order is confirmed!</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> ₹${order.totalAmount}</p>
        <p>You will pay on delivery.</p>
      `,
    }).catch(err => console.error("Email sending failed:", err));

  } catch (error) {
    console.error("COD Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* CREATE RAZORPAY ORDER FOR CART */
export const createCartPaymentOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "price seller");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const options = {
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `cart_receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      totalAmount,
    });

  } catch (error) {
    console.error("Create Cart Payment Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* VERIFY CART PAYMENT & CREATE ORDER */
export const verifyCartPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    /* 1️⃣ VERIFY SIGNATURE */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    /* 2️⃣ GET CART */
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "price seller");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* 3️⃣ GET DEFAULT ADDRESS */
    const user = await User.findById(req.user._id);

    const shippingAddress =
      user.savedAddresses.find((a) => a.isDefault) ||
      user.savedAddresses[0];

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Please add shipping address first",
      });
    }

    /* 4️⃣ PREPARE ITEMS */
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

    /* 5️⃣ CREATE ORDER */
    const order = await Order.create({
      user: req.user._id,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod: "ONLINE",
      paymentStatus: "Paid",
      paymentInfo: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
      status: "Placed",
    });

    /* 6️⃣ CLEAR CART */
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Payment verified & cart order placed",
      order,
    });

  } catch (error) {
    console.error("Verify Cart Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name") // ⭐ add this
      .sort({ createdAt: -1 });

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
      (item) => item.seller.toString() === req.user._id.toString(),
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
