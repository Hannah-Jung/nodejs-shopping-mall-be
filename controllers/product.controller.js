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
    const finalImages = Array.isArray(image) ? image : [image];
    const product = new Product({
      sku,
      name,
      size,
      image: finalImages,
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
    const { page, name, limit, admin } = req.query;
    const condition = { isDeleted: false };

    if (admin !== "true") {
      condition.status = "active";
    }

    if (name) {
      condition.name = { $regex: name, $options: "i" };
    }

    let query = Product.find(condition).sort({ createdAt: -1 });
    let response = { status: "success" };

    if (page) {
      const PAGE_SIZE = parseInt(limit) || 9;
      const totalItemNum = await Product.countDocuments(condition);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

      query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);

      response.totalPageNum = totalPageNum;
      response.totalCount = totalItemNum;
    }

    const productList = await query.exec();
    response.productList = productList;

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku,
      name,
      size,
      image,
      price,
      description,
      category,
      stock,
      status,
    } = req.body;
    const finalImage = Array.isArray(image) ? image : [image];
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        sku,
        name,
        size,
        image: finalImage,
        price,
        description,
        category,
        stock,
        status,
      },
      { new: true },
    );
    if (!product) throw new Error("Product not found");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true },
      { new: true },
    );
    if (!product) throw new Error("Product not found");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.checkStock = async (item) => {
  const product = await Product.findById(item.productId);
  if (!product) throw new Error("Product not found");
  const actualStock = product.stock[item.size];

  if (actualStock < item.qty) {
    return {
      isVerify: false,
      productId: product._id,
      productName: product.name,
      image: product.image[0],
      size: item.size,
      actualStock: actualStock,
      message: actualStock === 0 ? "OUT OF STOCK" : "LOW ON STOCK",
    };
  }

  return { isVerify: true };
};

productController.reduceStock = async (itemList) => {
  for (const item of itemList) {
    const product = await Product.findById(item.productId);
    const newStock = { ...product.stock };
    newStock[item.size] -= item.qty;
    product.stock = newStock;

    product.markModified("stock");
    await product.save();
  }
};

productController.checkItemListStock = async (itemList) => {
  const insufficientStockItems = [];
  for (const item of itemList) {
    const stockCheck = await productController.checkStock(item);
    if (!stockCheck.isVerify) {
      insufficientStockItems.push(stockCheck);
    }
  }

  return insufficientStockItems;
};

module.exports = productController;
