"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Toppings extends Model {
    static associate(models) {
      // Define associations here if needed
      Toppings.belongsTo(models.Categories, {
        foreignKey: "CategoryID",
        targetKey: "id",
        as: "idCateData2",
      });
      Toppings.hasMany(models.OrderDetailsToppings, {
        foreignKey: "ToppingID",
        as: "idOrderDetailToppingsData2",
      });
      Toppings.belongsToMany(models.OrderDetailsToppings, { through: "toppings_list_toppings", foreignKey: 'ToppingID', targetKey: 'id', as: 'idOrderData5', })
    }
  }

  Toppings.init(
    {
      //ToppingID: DataTypes.INTEGER,
      CategoryID: DataTypes.INTEGER,
      ToppingName: DataTypes.STRING,
      Price: DataTypes.DECIMAL,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Toppings",
      // Ensure the table name in the database matches the model name exactly
      freezeTableName: true,
    }
  );

  return Toppings;
};
