const mongoose = require("mongoose");
<<<<<<< HEAD
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
=======
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User, required: true },
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
    status: { type: String, default: "preparing" },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shipTo: { type: Object, required: true },
    contact: { type: Object, required: true },
    orderNum: { type: String },
    items: [
      {
<<<<<<< HEAD
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
=======
        productId: { type: mongoose.ObjectId, ref: Product },
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
        price: { type: Number, required: true },
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true },
      },
    ],
  },
  { timestamps: true },
);
orderSchema.methods.toJSON = function () {
<<<<<<< HEAD
  const obj = this.toObject();
=======
  const obj = this._doc;
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
