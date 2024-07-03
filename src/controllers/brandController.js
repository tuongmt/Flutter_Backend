import brandServices from "../services/brandServices";

let handleGetAllBrand = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing require parameters",
      products: [],
    });
  }
  let Brand = await brandServices.getAllBrands(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    Brand,
  });
};

let handleCreateBrand = async (req, res) => {
  let message = await brandServices.createBrand(req.body);
  return res.status(200).json(message);
};

let handleDeleteBrand = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters !",
    });
  }
  let message = await brandServices.deleteBrand(req.body.id);
  return res.status(200).json(message);
};

let handleEditBrand = async (req, res) => {
  let data = req.body;
  let message = await brandServices.updateBrand(data);
  return res.status(200).json(message);
};

module.exports = {
  handleGetAllBrand: handleGetAllBrand,
  handleCreateBrand: handleCreateBrand,
  handleDeleteBrand: handleDeleteBrand,
  handleEditBrand: handleEditBrand,
};
