import userSevices from "../services/userServices";

let handleLogin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "vui lòng điền đầy đủ thông tin",
    });
  }

  let userData = await userSevices.handleLogin(username, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing require parameters",
      users: [],
    });
  }
  let users = await userSevices.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateUser = async (req, res) => {
  let message = await userSevices.createUser(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters !",
    });
  }
  let message = await userSevices.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let handleUpdateUser = async (req, res) => {
  let data = req.body;
  let message = await userSevices.updateUser(data);
  return res.status(200).json(message);
};

let handleGetAllCodes = async (req, res) => {
  try {
    let data = await userSevices.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Get allcode error", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateUser: handleCreateUser,
  handleUpdateUser: handleUpdateUser,
  handleDeleteUser: handleDeleteUser,
  handleGetAllCodes: handleGetAllCodes,
};
