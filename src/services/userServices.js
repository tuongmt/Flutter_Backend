import bcryptjs from "bcryptjs";
import db from "../models/index";
const { randomUUID } = require("crypto");
const { writeFile } = require("fs/promises");
const path = require("path");
const dirpath = "./content/images/";

const salt = bcryptjs.genSaltSync(10);

let hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcryptjs.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleLogin = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUsername(username);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "username",
            "roleId",
            "password",
            "fullName",
            "phoneNumber",
            "email",
            "address",
            "image",
            "id",
          ],
          where: { username: username },
          raw: true,
        });
        if (user) {
          //Compare password
          let checkPassword = await bcryptjs.compareSync(
            password,
            user.password
          );
          if (checkPassword) {
            (userData.errCode = 0), (userData.errMessage = "oke");
            delete user.password; // Delete password from API
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Mật khẩu sai";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "Người dùng không tồn tại";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage =
          "Username không tồn tại, vui lòng đăng kí hoặc kiểm tra lại";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUsername = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { username: username },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId == "ALL") {
        users = db.User.findAll({
          attributes: {
            // Hide password
            exclude: ["password"],
          },
          order: [["createdAt", "DESC"]],
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUsername(data.username);
      if (check == true) {
        resolve({
          errCode: 1,
          errMessage:
            "Tên người dùng đã tồn tại, vui lòng nhập tên người dùng khác",
        });
      } else {
        let hashPasswordFromBcrypt = await hashPassword(data.password);
        
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
        let user = await db.User.create({
          username: data.username,
          password: hashPasswordFromBcrypt,
          fullName: data.fullName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          email: data.email,
          roleId: data.roleId,
          image: data.image,
        });
        user.password = null;
        // if (data && data.image) {
        //   data.image = Buffer.from(data.image, "base64").toString("binary");
        // }
        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: user,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      resolve({
        errCode: 2,
        errMessage: "User isn't exist !",
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });
    resolve({
      errCode: 0,
      errMessage: "User is deleted !",
    });
  });
};

let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        attributes: {
          // Hide password
          exclude: ["password"],
        },
        raw: false,
      });
      if (user) {
        user.fullName = data.fullName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.email = data.email;
        user.roleId = data.roleId;
        if (data.image) {
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
          user.image = data.image;
        }
        await user.save(); //Nếu bị lỗi TypeError: user.save is not a function thì vào config.json đổi raw: true --> false là đc
        resolve({
          errCode: 0,
          errMessage: "Cap nhat nguoi dung thanh cong",
          data : user
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Khong tim thay nguoi dung",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Vui lòng điền đủ Thông tin",
        });
      } else {
        let res = {};
        let allCode = await db.AllCode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allCode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleLogin: handleLogin,
  getAllUsers: getAllUsers,
  createUser: createUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  getAllCodeService: getAllCodeService,
};
