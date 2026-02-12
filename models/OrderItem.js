const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderItemSchema = Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    size: { type: String, required: true },
  },
  { timestamps: true },
);
orderItemSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
