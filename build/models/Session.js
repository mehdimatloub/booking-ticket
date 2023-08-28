"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');
const sequelize = new Sequelize(sequelizeConfig.development);



class Session extends Model {
    static associate(models) {
        Session.belongsTo(models.Evenement, { foreignKey: 'evenement_id' });
        Session.belongsTo(models.Salle, { foreignKey: 'salle_id' });
      }
}
Session.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    heure_debut: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    heure_fin: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    salleId: {
        type: DataTypes.INTEGER,
        field: 'salle_id',
    },
    evenementId: {
        type: DataTypes.INTEGER,
        field: 'evenement_id',
    },
}, {
    sequelize:sequelize,
    modelName: 'Session',
    tableName: 'Session',
    timestamps: false,
});

module.exports = Session;
