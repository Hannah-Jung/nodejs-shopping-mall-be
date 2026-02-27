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

orderController.getOrder = async (req, res) => {
  try {
    const { userId } = req;
    const page = req.query.page || 1;
    const PAGE_SIZE = 5;

    const orderList = await Order.find({ userId })
      .populate("userId", "firstName lastName email")
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
          select: "image name",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    const totalItemNum = await Order.find({ userId }).countDocuments();
    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderList = async (req, res) => {
  try {
    const { page, ordernum, limit } = req.query;
    const PAGE_SIZE = Number(limit) || 5;

    const cond = ordernum
      ? { orderNum: { $regex: ordernum, $options: "i" } }
      : {};

    const orderList = await Order.find(cond)
      .populate("userId", "firstName lastName email")
      .populate({
        path: "items.productId",
        model: "Product",
        select: "image name",
      })
      .sort({ createdAt: -1 })
      .skip((Math.max(1, page) - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    const totalItemNum = await Order.find(cond).countDocuments();
    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

    res.status(200).json({
      status: "success",
      data: orderList,
      totalPageNum,
      totalCount: totalItemNum,
    });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) throw new Error("Can't find order");

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
