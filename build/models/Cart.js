'use strict';

const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');
const sequelize = new Sequelize(sequelizeConfig.development);

class Cart extends Model {
  static associate(models) {
    Cart.belongsTo(models.Utilisateur, { foreignKey: 'userId', as: 'user' });
    Cart.belongsTo(models.Evenements, { foreignKey: 'eventId', as: 'event' });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Utilisateur', // Change this to match the actual model name
        key: 'id',
      },
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Evenements', // Change this to match the actual model name
        key: 'id',
      },
      allowNull: false,
    },
    sessions: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    salles: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sieges: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts', // Make sure this matches your table name
    timestamps: false,
  }
);

module.exports = Cart;
