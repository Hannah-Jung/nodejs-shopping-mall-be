const mongoose = require("mongoose");
<<<<<<< HEAD
const Schema = mongoose.Schema;
const cartItemSchema = Schema(
  {
    cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
=======
const Cart = require("./Cart");
const Product = require("./Product");
const Schema = mongoose.Schema;
const cartItemSchema = Schema(
  {
    cartId: { type: mongoose.ObjectId, ref: Cart },
    productId: { type: mongoose.ObjectId, ref: Product },
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
    qty: { type: Number, required: true, default: 1 },
    size: { type: String, required: true },
  },
  { timestamps: true },
);
cartItemSchema.methods.toJSON = function () {
<<<<<<< HEAD
  const obj = this.toObject();
=======
  const obj = this._doc;
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
