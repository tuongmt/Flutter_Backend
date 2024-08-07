import db from "../models/index";
const { randomUUID } = require("crypto");
const { writeFile } = require("fs/promises");
const path = require("path");
const dirpath = "./content/images/";

let checkCart = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Cart = await db.Cart.findOne({
        where: { iduser: data.iduser, name: data.name },
      });
      if (Cart) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let CreateCart = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check username is exist??
      let check = await checkCart(data);
      if (check == true) {
        resolve({
          errCode: 1,
          errMessage: " Sản phẩm này đã tồn tại trong giỏ hàng",
        });
      } else {
        if (data && data.image) {
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
        await db.Cart.create({
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          image: data.image,
          iduser: data.iduser,
          idproduct: data.idproduct,
        });
        // if (data && data.image) {
        //   data.image = Buffer.from(data.image, "base64");
        // }
        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: data,
        });

        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteCart = (CartId) => {
  return new Promise(async (resolve, reject) => {
    let category = await db.Cart.findOne({
      where: { id: CartId },
    });
    if (!category) {
      resolve({
        errCode: 2,
        errMessage: " sản phẩm  không tồn tại",
      });
    }
    await db.Cart.destroy({
      where: { id: CartId },
    });
    resolve({
      errCode: 0,
      errMessage: " sản phẩm đã bị xóa !",
    });
  });
};

let updateCartData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let Cart = await db.Cart.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (Cart) {
        Cart.quantity = data.quantity;
        Cart.price = data.price;
        await Cart.save();
        resolve({
          errCode: 0,
          errMessage: "update Cart succeeds !",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cart not found !",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCart = (CartId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Cart = "";

      Cart = db.Cart.findAll({
        where: { iduser: CartId },
      });

      resolve(Cart);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllCart: getAllCart,
  CreateCart: CreateCart,
  deleteCart: deleteCart,
  updateCartData: updateCartData,
};
