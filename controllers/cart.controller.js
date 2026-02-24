const Cart = require("../models/Cart");
const cartController = {};
cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }
    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size,
    );
    if (existItem) {
      throw new Error("This item is already in your cart");
    }
    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();
    res
      .status(200)
      .json({ status: "success", data: cart, cartItemQty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCartQty = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    if (!cart) {
      return res.status(200).json({ status: "success", qty: 0 });
    }

    res.status(200).json({ status: "success", qty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || !cart.items) {
      return res.status(200).json({ status: "success", cartList: [] });
    }

    const cartList = cart.items
      .filter((item) => item.productId)
      .map((item) => {
        const selectedSize = item.size.toLowerCase();
        const prices = item.productId.price;
        const priceForSize = prices[selectedSize] || prices.single || 0;

        return {
          ...item._doc,
          sizePrice: priceForSize,
        };
      });

    res.status(200).json({ status: "success", cartList });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.deleteCartItem = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const cart = await Cart.findOne({ userId });

    cart.items = cart.items.filter((item) => !item._id.equals(id));
    await cart.save();

    return cartController.getCart(req, res);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.updateQty = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { qty } = req.body;
    const cart = await Cart.findOne({ userId });

    const targetItem = cart.items.find((item) => item._id.equals(id));
    if (!targetItem) throw new Error("Item not found");

    targetItem.qty = qty;
    await cart.save();

    return cartController.getCart(req, res);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
