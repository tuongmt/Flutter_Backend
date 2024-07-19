import db from "../models/index";

let CreateOrderDetails = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.OrderDetails.create({
        order_id: data.order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        total_price: data,
        total_price,
      });

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
    } catch (e) {
      reject(e);
    }
  });
};

let deleteOrderDetails = (OrderDetailsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderDetailsList = await db.OrderDetails.findAll({
        where: { order_id: OrderDetailsId },
      });

      if (orderDetailsList.length === 0) {
        resolve({
          errCode: 2,
          errMessage: "No order details found with the given order_id",
        });
      }

      // Delete all OrderDetails with the given order_id
      await db.OrderDetails.destroy({
        where: { order_id: OrderDetailsId },
      });

      resolve({
        errCode: 0,
        errMessage: "Order details have been deleted!",
      });
    } catch (error) {
      reject({
        errCode: 1,
        errMessage: "Error deleting order details",
      });
    }
  });
};

let updateOrderDetailsData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let OrderDetails = await db.OrderDetails.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (OrderDetails) {
        OrderDetails.quantity = data.quantity;
        await OrderDetails.save();
        resolve({
          errCode: 0,
          errMessage: "update OrderDetails succeeds !",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "OrderDetails not found !",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllOrderDetails = (OrderDetailsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let OrderDetails = "";

      OrderDetails = await db.OrderDetails.findAll({
        where: { order_id: OrderDetailsId },
        include: [
          {
            model: db.Products,
            as: "idProductData",
            attributes: ["id", "name", "image", "price"],
          },
          {
            model: db.OrderDetailsToppings,
            as: "Toppings",
            attributes: ["ToppingID", "order_id"],
          },
          {
            model: db.Orders,
            as: "idOrderData",
            attributes: ["order_status"],
          },
        ],
        raw: false,
        nest: true,
      });

      resolve(OrderDetails);
    } catch (e) {
      reject(e);
    }
  });
};
let layhoadon = (orderId1) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders1 = "";

      if (orderId1 && orderId1 !== "ALL") {
        orders1 = await db.Orders.findOne({
          where: { id_order: orderId1 },
        });
      }

      resolve(orders1);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllOrderDetails: getAllOrderDetails,
  CreateOrderDetails: CreateOrderDetails,
  deleteOrderDetails: deleteOrderDetails,
  updateOrderDetailsData: updateOrderDetailsData,
  layhoadon: layhoadon,
};
