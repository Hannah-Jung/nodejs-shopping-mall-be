const mongoose = require("mongoose");
<<<<<<< HEAD
const Schema = mongoose.Schema;
const orderItemSchema = Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
=======
const Order = require("./Order");
const Product = require("./Product");
const Schema = mongoose.Schema;
const orderItemSchema = Schema(
  {
    orderId: { type: mongoose.ObjectId, ref: Order },
    productId: { type: mongoose.ObjectId, ref: Product },
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    size: { type: String, required: true },
  },
  { timestamps: true },
);
orderItemSchema.methods.toJSON = function () {
<<<<<<< HEAD
  const obj = this.toObject();
=======
  const obj = this._doc;
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
