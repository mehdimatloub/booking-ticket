Object.defineProperty(exports, "__esModule", { value: true });
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');
const sequelize = new Sequelize(sequelizeConfig.development);

class Salle extends Model {
    static associate(models) {
        Salle.belongsTo(models.Ville, { foreignKey: 'villeId',as:'ville' });
        Salle.hasMany(models.Siege, { foreignKey: 'salle_id' });

        
      }
}
Salle.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    capacité: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    etat: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    villeId: {
        type: DataTypes.INTEGER,
        field: 'ville_id',
    },
    plan: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Salle',
    tableName: 'Salle',
    timestamps: false,
});



module.exports = Salle;