const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { randomStringGenerator } = require("../utils/randomStringGenerator.js");
const productController = require("./product.controller.js");

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { totalPrice, shipTo, contact, items } = req.body;
    const invalidItems = await productController.checkItemListStock(items);

    if (invalidItems.length > 0) {
      return res.status(400).json({
        status: "fail",
        errorType: "INSUFFICIENT_STOCK",
        invalidItems: invalidItems,
      });
    }

    await productController.reduceStock(items);

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();

    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
