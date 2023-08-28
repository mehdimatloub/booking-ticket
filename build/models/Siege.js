
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');
const sequelize = new Sequelize(sequelizeConfig.development);

class Siege extends Model {
  static associate(models) {
    Siege.belongsTo(models.Salle, { foreignKey: 'salleId' });
    Siege.belongsTo(models.Utilisateur, { foreignKey: 'utilisateurId' });
    Siege.hasMany(models.Reservation, { foreignKey: 'siegeId' });
    
  }
};

Siege.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statut: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    salleId: {
      type: DataTypes.INTEGER,
      field: 'salle_id',
    },
    prix: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Siege',
    tableName: 'siege',
    timestamps: false,
  }
);

module.exports = Siege;
