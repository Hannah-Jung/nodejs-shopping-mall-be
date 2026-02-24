const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: [String], required: true },
    category: { type: Array, required: true },
    description: { type: String, required: true },
    price: {
      single: { type: Number, default: 0 },
      double: { type: Number, default: 0 },
      family: { type: Number, default: 0 },
    },
    stock: { type: Object, required: true },
    status: { type: String, default: "Active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
