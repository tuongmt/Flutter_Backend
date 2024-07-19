import { all } from "sequelize/lib/operators";
import db from "../models/index";
const { Sequelize, Op } = require("sequelize");

let getAllOders = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = "";

      if (orderId == "ALL") {
        orders = db.Orders.findAll({
          order: [["createdAt", "DESC"]],
        });
      } else if (orderId && orderId !== "ALL") {
        orders = await db.Orders.findAll({
          where: { order_idUser: orderId },
        });
      }

      resolve(orders);
    } catch (e) {
      reject(e);
    }
  });
};

const locdonhang = (orderId, selectedDate, statusFilter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = "";
      const queryOptions = {
        order: [["createdAt", "DESC"]],
        where: {},
      };

      if (orderId && orderId !== "ALL") {
        queryOptions.where.order_idUser = orderId;
      }

      if (selectedDate) {
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0); // Đặt giờ, phút và giây thành 00:00:00

        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999); // Đặt giờ, phút và giây thành 23:59:59:999

        queryOptions.where.createdAt = {
          [Op.between]: [startDate, endDate],
        };
      }

      if (statusFilter) {
        queryOptions.where.order_status = statusFilter;
      }

      orders = await db.Orders.findAll(queryOptions);
      resolve(orders);
    } catch (e) {
      reject(e);
    }
  });
};

let CreateOrders = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm đơn hàng mới nhất để xác định ID tiếp theo
      const latestOrder = await db.Orders.findOne({
        order: [["createdAt", "DESC"]],
      });

      let nextOrderId;
      if (latestOrder) {
        const latestOrderIdNumber = parseInt(
          latestOrder.id_order.substr(2),
          10
        );
        nextOrderId = `HD${(latestOrderIdNumber + 1)
          .toString()
          .padStart(2, "0")}`;
      } else {
        // Nếu không có đơn hàng trước đó, bắt đầu bằng HD01
        nextOrderId = "HD01";
      }

      // Tạo đơn hàng mới
      let order = await db.Orders.create({
        id_order: nextOrderId,
        receiver: data.receiver,
        order_status: data.order_status,
        receiving_point: data.receiving_point,
        phoneNumber: data.phoneNumber,
        total_value: data.total_value,
        note: data.note,
        payment: data.payment,
        order_idUser: data.order_idUser,
      });

      const productListWithOrderId = data.productList.map((item) => ({
        ...item,
        order_id: order.id,
      }));
      await db.OrderDetails.bulkCreate(productListWithOrderId);
      // Assuming db.OrderDetails.findAll() is the correct method to get multiple order details
      const orderDetails = await db.OrderDetails.findAll({
        where: { order_id: order.id },
      });

      // Ensure orderDetails is an array before proceeding
      if (!Array.isArray(orderDetails)) {
        throw new Error("orderDetails is not an array");
      }
      if (data && data.toppings) {
        const orderDetailToppingsWithCorrectOrderDetailId = data.toppings.map(
          (topping) => {
            // Find the corresponding OrderDetail based on product_id
            const matchingOrderDetail = orderDetails.find(
              (orderDetail) => orderDetail.product_id === topping.product_id
            );

            return {
              ToppingID: topping.ToppingID,
              OrderDetailID: matchingOrderDetail
                ? matchingOrderDetail.id
                : null, // Use the ID of the found OrderDetail or null
              order_id: order.id,
            };
          }
        );

        await db.OrderDetailsToppings.bulkCreate(
          orderDetailToppingsWithCorrectOrderDetailId
        );
      }
      // Assuming orderDetails is an array and has the same length as data.toppings

      let OrderDetails = await db.OrderDetails.findAll({
        where: { order_id: order.id },
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

      resolve({
        errCode: 0,
        message: "OK",
        data: {
          ...order.dataValues,
          //...OrderDetails,
          id_order: nextOrderId,
        },
        productListWithOrderId: { order_id: nextOrderId },
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteOrders = (orderId) => {
  return new Promise(async (resolve, reject) => {
    let orders = await db.Orders.findOne({
      where: { id: orderId },
    });
    if (!orders) {
      resolve({
        errCode: 2,
        errMessage: "orders isn't exist !",
      });
    }
    await db.Orders.destroy({
      where: { id: orderId },
    });
    resolve({
      errCode: 0,
      errMessage: "orders is deleted !",
    });
  });
};

let updateOrderData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let Order = await db.Orders.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (Order) {
        //Order.order_status = "Đã xác nhận";
        Order.set(data);
        await Order.save();
        resolve({
          errCode: 0,
          errMessage: "update Order succeeds !",
          data: Order,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Order not found !",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateOrderStatus = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let Order = await db.Orders.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (Order) {
        Order.order_status = data.order_status;
        //Order.set(data);
        await Order.save();
        resolve({
          errCode: 0,
          errMessage: "update Order succeeds !",
          data: Order,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Order not found !",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllOders: getAllOders,
  CreateOrders: CreateOrders,
  deleteOrders: deleteOrders,
  updateOrderData: updateOrderData,
  updateOrderStatus: updateOrderStatus,
  locdonhang: locdonhang,
};
