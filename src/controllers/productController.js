// Singleton Pattern (Dependency Injection)
import ServiceFactory from "../services/productServices"; //Instance

const productService = ServiceFactory.createService("product");
const categoryService = ServiceFactory.createService("category");

// Separation of Concerns (SoC)
// Error Handling Patterns

const handleGetAllProducts = async (req, res) => {
  try {
    const { id, idCate, price, orderBy } = req.query;

    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing require parameters",
        products: [],
      });
    }

    const products = await productService.getAllProducts(
      id,
      idCate,
      price,
      orderBy
    );

    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      products,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 500,
      errMessage: e.message || "Internal Server Error",
      products: [],
    });
  }
};

const handleDetailProduct = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing require parameters",
        products: [],
      });
    }

    const product = await productService.getProductDetail(id);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      product,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 500,
      errMessage: e.message || "Internal Server Error",
      product: [],
    });
  }
};

const handleCreateProduct = async (req, res) => {
  const message = await productService.createProduct(req.body);
  return res.status(200).json(message);
};

const handleDeleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameters",
      });
    }
    const message = await productService.deleteProduct(id);
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({
      errCode: 500,
      errMessage: e.message || "Internal Server Error",
    });
  }
};

const handleEditProduct = async (req, res) => {
  try {
    const data = req.body;
    const message = await productService.updateProduct(data);
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({
      errCode: 500,
      errMessage: e.message || "Internal Server Error",
    });
  }
};

const handlegetAllCategories = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing require parameters",
      products: [],
    });
  }
  const categories = await categoryService.getAllCategories(id);
  console.log(categories);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    categories,
  });
};

const handleCreateCategory = async (req, res) => {
  const message = await categoryService.createCategory(req.body);
  return res.status(200).json(message);
};

const handleDeleteCategory = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters !",
    });
  }
  const message = await categoryService.deleteCategory(req.body.id);
  return res.status(200).json(message);
};

const handleEditCategory = async (req, res) => {
  const data = req.body;
  const message = await categoryService.updateCategory(data);
  return res.status(200).json(message);
};

module.exports = {
  handleGetAllProducts: handleGetAllProducts,
  handleCreateProduct: handleCreateProduct,
  handleDeleteProduct: handleDeleteProduct,
  handleEditProduct: handleEditProduct,
  handlegetAllCategories: handlegetAllCategories,
  handleCreateCategory: handleCreateCategory,
  handleDeleteCategory: handleDeleteCategory,
  handleEditCategory: handleEditCategory,
  handleDetailProduct: handleDetailProduct,
};
