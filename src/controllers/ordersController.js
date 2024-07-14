
import OrderServices from "../services/OrderServices"
import moment from "moment";
require('dotenv').config();


let handleGetAllOrders = async (req, res) => {
  let id = req.query.id; //all, id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing require parameters",
      products: [],
    });
  }
  let orders = await OrderServices.getAllOders(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    data:orders,
  });
};

let handleLocdonhang = async (req, res) => {
  let id = req.query.id; //all, id
  let createdAt = req.query.createdAt;
  let order_status = req.query.order_status;
  if (!id) {
    return res.status(200).json({

      errCode: 1,
      errMessage: "Missing require parameters",
      products: [],
    });
  }
  let orders = await OrderServices.locdonhang(id, createdAt, order_status);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    orders,
  });
};

let handleUpdateOrderStatus = async(req, res) => {
  let data = req.body;
  let message = await OrderServices.updateOrderStatus(data);
  return res.status(200).json(message)

}

let handleCreateOrders = async(req, res) => {
    let message = await OrderServices.CreateOrders(req.body);
    console.log(message);
    return res.status(200).json(message);

}




let handleDeleteOrders = async(req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errcode: 1,
            errMessage: "Missing required parameters !"

        })
    }
    let message = await OrderServices.deleteOrders(req.body.id);
    console.log(message);
    return res.status(200).json(message);
}



let handleEditOder = async(req, res) => {
    let data = req.body;
    let message = await OrderServices.updateOrderData(data);
    return res.status(200).json(message)

}

let handleVnPayReturn = async(req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env['vnp_HashSecret'];
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    if (vnp_Params?.vnp_ResponseCode != undefined && vnp_Params.vnp_ResponseCode == "00" && secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      return res.json({ "status": 200, "message": "Đặt hàng thành công!" });
    } else {
      return res.json({ "status": 400, "message": "Lỗi tham chiếu máy chủ" });
    }
}
let handleCreatePayment = async(req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let tmnCode = process.env['vnp_TmnCode'];
    let secretKey = process.env['vnp_HashSecret'];
    let vnpUrl = process.env['vnp_Url'];
    let returnUrl = process.env['vnp_ReturnUrl'];
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.total_value;
    let bankCode = 'VNBANK';
    let locale = 'vn';
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = req.body.order_id;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = parseInt(amount) * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '123.123.123.123';
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
    res.redirect(vnpUrl)
  };
  // External function(s)
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    handleGetAllOrders: handleGetAllOrders,
    handleCreateOrders: handleCreateOrders,
    handleDeleteOrders: handleDeleteOrders,
    handleEditOder:handleEditOder,
    handleLocdonhang:handleLocdonhang,
    handleVnPayReturn:handleVnPayReturn,
    handleCreatePayment:handleCreatePayment,
    handleUpdateOrderStatus: handleUpdateOrderStatus
}
