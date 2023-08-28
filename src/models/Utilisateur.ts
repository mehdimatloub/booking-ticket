import { Model, DataTypes } from 'sequelize';
import Siege from './Siege';
import Reservation from './Reservation';
import {
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
} from 'sequelize';

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('pfe', 'root', '160220', {
  host: 'localhost',
  dialect: 'sqlite',
});

interface UtilisateurAttributes {
  nom: string;
  motDePasse: string;
  email: string;
}

class Utilisateur extends Model<UtilisateurAttributes> implements UtilisateurAttributes {
  public id!: number;
  public nom!: string;
  public motDePasse!: string;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSieges!: HasManyGetAssociationsMixin<Siege>;
  public setSieges!: HasManySetAssociationsMixin<Siege[], number>;
  public addSiege!: HasManyAddAssociationMixin<Siege, number>;
  public addSieges!: HasManyAddAssociationsMixin<Siege[], number>;
  public createSiege!: HasManyCreateAssociationMixin<Siege>;

  // Custom method implementation to retrieve reservations
  public async getReservations() {
    return Reservation.findAll({
      where: {
        utilisateurId: this.id,
      },
    });
  }
}

Utilisateur.init(
  {
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    motDePasse: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: 'Utilisateur',
    tableName: 'Utilisateur',
    timestamps: true,
  }
);

Utilisateur.hasMany(Reservation, { as: 'sieges', foreignKey: 'utilisateurId' });

export default Utilisateur;