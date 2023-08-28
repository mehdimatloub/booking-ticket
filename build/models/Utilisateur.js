"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

Object.defineProperty(exports, "__esModule", { value: true });
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');
const sequelize = new Sequelize(sequelizeConfig.development);
const Reservation=require('./Reservation');
class Utilisateur extends Model {
    static associate(models) {
        Utilisateur.hasMany(models.Siege, { through:'Reservation',as: 'sieges', foreignKey: 'utilisateurId' });
        
      }
    getReservations() {
            return Reservation.findAll({
                where: {
                    utilisateurId: this.id,
                },
            });
        }
    }

Utilisateur.init({
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    mot_de_passe: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'Utilisateur',
    timestamps: false,
});

module.exports = Utilisateur;
