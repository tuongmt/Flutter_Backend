'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            OrderDetails.belongsTo(models.Products, { foreignKey: 'product_id', targetKey: 'id', as: 'idProductData'})
            OrderDetails.belongsTo(models.Orders, { foreignKey: 'order_id', targetKey: 'id', as: 'idOrderData'})
            
        }
    };
    OrderDetails.init({

        order_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        total_price: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'OrderDetails',
         // muốn không thêm s sau tên bảng database phải thêm thuộc tính này
       freezeTableName: true
    });
    return OrderDetails;
};