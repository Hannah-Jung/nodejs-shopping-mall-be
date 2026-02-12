const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartItemSchema = Schema(
  {
    cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    qty: { type: Number, required: true, default: 1 },
    size: { type: String, required: true },
  },
  { timestamps: true },
);
cartItemSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
