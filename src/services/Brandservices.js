import db from "../models/index";

let checkBrandName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let brand = await db.Brands.findOne({
        where: { name: name },
      });
      if (brand) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createBrand = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkBrandName(data.name);

      if (check == true) {
        resolve({
          errCode: 1,
          errMessage: "Tên loại sản phẩm này đã tồn tại",
        });
      } else {
        await db.Brands.create({
          name: data.name,
          image: data.avatar,
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: data,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteBrand = (brandId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Brands.findOne({
        where: { id: brandId },
      });
      if (!category) {
        resolve({
          errCode: 2,
          errMessage: "Loại sản phẩm không tồn tại",
        });
      }
      await db.Brands.destroy({
        where: { id: brandId },
      });
      resolve({
        errCode: 0,
        errMessage: "Loại sản phẩm đã bị xóa !",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateBrand = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let brand = await db.Brands.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (brand) {
        brand.name = data.name;
        if (data.avatar) {
          brand.image = data.avatar;
        }

        await brand.save();
        resolve({
          errCode: 0,
          errMessage: "Update brand succeeds !",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Brand not found !",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllBrands = (brandId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let brands = "";
      if (brandId == "ALL") {
        brands = db.Brands.findAll({
          order: [["createdAt", "DESC"]],
        });
      }
      if (brandId && brandId !== "ALL") {
        brands = await db.Brands.findOne({
          where: { id: brandId },
        });
      }
      resolve(brands);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllBrands: getAllBrands,
  createBrand: createBrand,
  deleteBrand: deleteBrand,
  updateBrand: updateBrand,
};
