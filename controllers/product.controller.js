const Product = require("../models/Product");

const productController = {};
productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    } = req.body;
    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });
    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};
productController.getProductList = async (req, res) => {
  try {
    const { page, name } = req.query;
    const condition = name
      ? { name: { $regex: name, $options: "i" }, isDeleted: false }
      : { isDeleted: false };

    let query = Product.find(condition);
    let response = { status: "success" };

    if (page) {
      const PAGE_SIZE = 5;
      const totalItemNum = await Product.find(condition).countDocuments();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

      query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);

      response.totalPageNum = totalPageNum;
    }

    const productList = await query.exec();
    response.productList = productList;

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
