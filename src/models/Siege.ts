
import Salle from './Salle';
import Reservation from './Reservation';
import Utilisateur from './Utilisateur';
import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin } from 'sequelize';

import { DataTypes,Model } from 'sequelize';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
});


interface SiegeAttributes {
  id: number;
  numero: number;
  statut: string;
  salleId: number;
}

class Siege extends Model<SiegeAttributes> implements SiegeAttributes {
  public id!: number;
  public numero!: number;
  public statut!: string;
  public salleId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSalle!: BelongsToGetAssociationMixin<Salle>;
  public setSalle!: BelongsToSetAssociationMixin<Salle, number>;
  public createSalle!: BelongsToCreateAssociationMixin<Salle>;

  public getReservations!: HasManyGetAssociationsMixin<Reservation>;
  public setReservations!: HasManySetAssociationsMixin<Reservation, number>;
  public addReservation!: HasManyAddAssociationMixin<Reservation, number>;
  public addReservations!: HasManyAddAssociationsMixin<Reservation, number>;
  public createReservation!: HasManyCreateAssociationMixin<Reservation>;

  public getUtilisateurs!: BelongsToManyGetAssociationsMixin<Utilisateur>;
  public setUtilisateurs!: BelongsToManySetAssociationsMixin<Utilisateur, number>;
  public addUtilisateur!: BelongsToManyAddAssociationMixin<Utilisateur, number>;
  public addUtilisateurs!: BelongsToManyAddAssociationsMixin<Utilisateur, number>;
}

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
  },
  {
    sequelize,
    modelName: 'Siege',
    tableName: 'Siege',
    timestamps: true,
  }
);

Siege.belongsTo(Salle, { foreignKey: 'salleId' });
Siege.hasMany(Reservation, { foreignKey: 'siegeId' });



export default Siege;
