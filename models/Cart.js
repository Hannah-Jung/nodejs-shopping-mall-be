const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true },
      },
    ],
  },
  { timestamps: true },
);
cartSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
