const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');

const sequelize = new Sequelize(sequelizeConfig.development);

class Evenement extends Model {
  static associate(models) {
    Evenement.belongsTo(models.Ville, { foreignKey: 'villeId', as: 'ville' });
    Evenement.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Evenement.hasMany(models.Session, { foreignKey: 'evenement_id', as: 'sessions' });
  }
}

Evenement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    adresse: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    villeId: {
      type: DataTypes.INTEGER,
      field: 'ville_id',
      allowNull: false,
    },
    category: {
      type: DataTypes.INTEGER,
      field: 'category_id',
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Evenement',
    tableName: 'Evenement', // The table name should be in lowercase (convention)
    timestamps: false,
  }
);

module.exports = Evenement;
