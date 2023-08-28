'use strict';

// Import necessary modules
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');
const sequelize = new Sequelize(sequelizeConfig.development);

// Define the Reservation model class
class Reservation extends Model {
  static associate(models) {
    // Define associations
    Reservation.belongsTo(models.Siege, { foreignKey: 'siege_id' });
    Reservation.belongsTo(models.Utilisateur, { as: 'utilisateur', foreignKey: 'utilisateur_id' });
    Reservation.belongsTo(models.Session, { as: 'session', foreignKey: 'sessionId' });
  }
}

// Initialize the Reservation model
Reservation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code_reservation: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  date_reservation: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for numbers with precision and scale
    allowNull: false,
  },
  ticket: {
    type: DataTypes.BLOB, // Adjust the data type according to your database system
    allowNull: true, // Set to false if the ticket is always required
  },
  siegeId: {
    type: DataTypes.INTEGER,
    field: 'siege_id',
  },
  utilisateurId: {
    type: DataTypes.INTEGER,
    field: 'utilisateur_id',
  },
  sessionId: {
    type: DataTypes.INTEGER,
    field: 'sessionId',
  },
}, {
  sequelize,
  modelName: 'Reservation',
  tableName: 'Reservation',
  timestamps: false,
});

// Export the Reservation model
module.exports = Reservation;
