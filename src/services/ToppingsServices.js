import db from "../models/index";
import { Op, where } from "sequelize";
const { randomUUID } = require("crypto");
const { writeFile } = require("fs/promises");
const path = require("path");
const dirpath = "./content/images/";

console.log(randomUUID());
const checkToppingName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Toppings.findOne({
        where: { ToppingName: name },
      });
      if (category) {
        resolve(true);
      }
      resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

// Category service

let createTopping = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkCName = await checkToppingName(data.ToppingName);
      if (checkCName) {
        resolve({
          errCode: 1,
          errMessage: "Tên sản phẩm này đã tồn tại",
        });
      } else {
        if (!data) {
          data = {};
        }
        if (data.image != null) {
          const contents = data.image.replace(
            /^data:([A-Za-z-+/]+);base64,/,
            ""
          );
          const ext = data.image.substring(
            data.image.indexOf("/") + 1,
            data.image.indexOf(";base64")
          );
          const uuidv4 = randomUUID();
          const filename = `${uuidv4}.${ext}`;
          await writeFile(
            path.join(dirpath, filename),
            Buffer.from(contents, "base64")
          );
          data.image = filename;
        }
        console.log(data);
        await db.Toppings.create({
          ToppingName: data.ToppingName,
          image: data.image,
          CategoryID: data.CategoryID,
          createdAt: new Date(Date.now()).toLocaleDateString("vi-VN"),
          Price: data.Price,
        });
        //   if (data && data.image) {
        //     data.image = Buffer.from(data.image, "base64").toString("binary");
        //   }
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

let deleteTopping = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    let category = await db.Toppings.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      resolve({
        errCode: 2,
        errMessage: "loại sản phẩm không tồn tại",
      });
    }
    await db.Toppings.destroy({
      where: { id: categoryId },
    });
    resolve({
      errCode: 0,
      errMessage: "loại sản phẩm đã bị xóa !",
    });
  });
};

let updateTopping = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Thieu tham so dau vao",
        });
      }
      let category = await db.Toppings.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (!category) {
        resolve({
          errCode: 2,
          errMessage: "Khong the tim thay loai san pham",
        });
      }
      if (data.image != null) {
        const contents = data.image.replace(
          /^data:([A-Za-z-+/]+);base64,/,
          ""
        );
        const ext = data.image.substring(
          data.image.indexOf("/") + 1,
          data.image.indexOf(";base64")
        );
        const uuidv4 = randomUUID();
        const filename = `${uuidv4}.${ext}`;
        await writeFile(
          path.join(dirpath, filename),
          Buffer.from(contents, "base64")
        );
        data.image = filename;
      }
      if (data.Price) {
        category.Price = data.Price;
      }
      if (data.image) {
        category.image = data.image;
      }
      if (data.ToppingName) {
        category.ToppingName = data.ToppingName;
      }
      if (data.CategoryID) {
        category.CategoryID = data.CategoryID;
      }
      await category.save();
      resolve({
        errCode: 0,
        errMessage: "Cap nhap thanh cong",
        data: category,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllTopping = (id, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let categories = "";
      let queryConditions = {};
      if (categoryId) {
        queryConditions.CategoryID = categoryId;
      }
      if (id && id !== "ALL") {
        queryConditions.id = id;
        categories = await db.Toppings.findOne({
          where: queryConditions,
        });
      } else {
        categories = db.Toppings.findAll({
          order: [["createdAt", "ASC"]],
          where: queryConditions,
        });
      }

      resolve(categories);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllTopping: getAllTopping,
  createTopping: createTopping,
  deleteTopping: deleteTopping,
  updateTopping: updateTopping,
};
