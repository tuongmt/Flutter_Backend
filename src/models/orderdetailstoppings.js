"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderDetailsToppings extends Model {
    static associate(models) {
      // Define associations here if needed
      OrderDetailsToppings.belongsTo(models.Toppings, {
        foreignKey: "ToppingID",
        targetKey: "id",
        as: "idToppingData",
      });

      OrderDetailsToppings.belongsTo(models.OrderDetails, {foreignKey: 'OrderDetailID', targetKey: 'id', as: 'idOrderData3', })

      OrderDetailsToppings.belongsTo(models.Orders, {foreignKey: 'order_id', targetKey: 'id', as: 'idOrderData2'})
    }
  }

  OrderDetailsToppings.init(
    {
      //OrderItemToppingID: DataTypes.INTEGER,
      OrderDetailID: DataTypes.INTEGER,
      ToppingID: DataTypes.INTEGER,
      order_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderDetailsToppings",
      // Ensure the table name in the database matches the model name exactly
      freezeTableName: true,
    }
  );

  return OrderDetailsToppings;
};
