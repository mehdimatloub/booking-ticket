const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');
const sequelize = new Sequelize(sequelizeConfig.development);

class Ville extends Model {
  static associate(models) {
    Ville.hasMany(models.Evenement, { foreignKey: 'villeId', as: 'evenements' });
    Ville.hasMany(models.Salle, { foreignKey: 'villeId', as: 'salles' });

  }
}

Ville.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ville: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code_postal: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Ville',
    tableName: 'Ville',
    timestamps: false ,
  }
);

module.exports = Ville;
