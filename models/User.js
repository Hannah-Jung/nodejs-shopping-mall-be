const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, default: "customer" }, // 2 types: customer and admin
  },
  { timestamps: true },
);
userSchema.methods.toJSON = function () {
<<<<<<< HEAD
  const obj = this.toObject();
=======
  const obj = this._doc;
>>>>>>> 723fd500667b22260cc7860df6216b80c4249e1f
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
