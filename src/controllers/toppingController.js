import toppingServices from "../services/ToppingsServices";


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



const handlegetAllToppings = async (req, res) => {
  const id = req.query.id;
  const cate_id = req.query.cate_id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing require parameters",
      products: [],
    });
  }
  const categories = await toppingServices.getAllTopping(id, cate_id);
  console.log(categories);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    data: categories,
  });
};

const handleCreateTopping = async (req, res) => {
  const message = await toppingServices.createTopping(req.body);
  return res.status(200).json(message);
};

const handleDeleteTopping = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters !",
    });
  }
  const message = await toppingServices.deleteTopping(req.body.id);
  return res.status(200).json(message);
};

const handleEditTopping = async (req, res) => {
  const data = req.body;
  const message = await toppingServices.updateTopping(data);
  return res.status(200).json(message);
};

module.exports = {

  handlegetAllToppings: handlegetAllToppings,
  handleCreateTopping: handleCreateTopping,
  handleDeleteTopping: handleDeleteTopping,
  handleEditTopping: handleEditTopping,
  handleDetailProduct: handleDetailProduct,
};
