import mongoose from "mongoose";

const pendingProductSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,
    description: String,
    price: Number,

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    // ⭐ IMAGE FIELD (BINARY STORAGE)
    image: {
      data: Buffer,
      contentType: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PendingProduct", pendingProductSchema);
