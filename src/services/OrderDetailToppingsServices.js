import db from "../models/index";

let createOrderDetailToppings = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.OrderDetailsToppings.create({
        OrderDetailID: data.order_detail_id,
        ToppingID: data.topping_id,
        order_id: data.order_id,
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

let deleteOrderDetailsToppings = (OrderDetailsToppingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderDetailsList = await db.OrderDetailsToppings.findAll({
        where: { id: OrderDetailsToppingId },
      });

      if (orderDetailsList.length === 0) {
        resolve({
          errCode: 2,
          errMessage: "Khong tim thay don hang",
        });
      }

      // Delete all OrderDetails with the given order_id
      await db.OrderDetailsToppings.destroy({
        where: { id: OrderDetailsToppingId },
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

let updateOrderDetailsToppingsData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let OrderDetails = await db.OrderDetailsToppings.findOne({
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

let getAllOrderDetailsToppings = (OrderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let OrderDetails = "";

      OrderDetails = db.OrderDetailsToppings.findAll({
        where: { order_id: OrderId },
        include: [
          {
            model: db.Products,
            as: "idProductData",
            attributes: ["name", "image", "price"],
          },
          {
            model: db.Orders,
            as: "idOrderData",
            attributes: ["order_status"],
          },
        ],
        raw: true,
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
  getAllOrderDetailsToppings: getAllOrderDetailsToppings,
  createOrderDetailToppings: createOrderDetailToppings,
  deleteOrderDetailsToppings: deleteOrderDetailsToppings,
  updateOrderDetailsToppingsData: updateOrderDetailsToppingsData,
  layhoadon: layhoadon,
};
