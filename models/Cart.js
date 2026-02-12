const mongoose = require("mongoose");
<<<<<<< HEAD
const Schema = mongoose.Schema;
const cartSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
=======
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;
const cartSchema = Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User },
    items: [
      {
        productId: { type: mongoose.ObjectId, ref: Product },
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true },
      },
    ],
  },
  { timestamps: true },
);
cartSchema.methods.toJSON = function () {
<<<<<<< HEAD
  const obj = this.toObject();
=======
  const obj = this._doc;
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
