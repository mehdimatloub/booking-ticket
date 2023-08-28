import { DataTypes, Model } from 'sequelize';
import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize';
import Siege from './Siege';
import Utilisateur from './Utilisateur';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
});


interface ReservationAttributes {
  id: number;
  code_reservation: string;
  date_reservation: Date;
  status: string;
  paymentInfo: string;
  siegeId: number;
  utilisateurId: number;
}

class Reservation extends Model<ReservationAttributes> implements ReservationAttributes {
  public id!: number;
  public code_reservation!: string;
  public date_reservation!: Date;
  public status!: string;
  public paymentInfo!: string;
  public siegeId!: number;
  public utilisateurId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSiege!: BelongsToGetAssociationMixin<Siege>;
  public setSiege!: BelongsToSetAssociationMixin<Siege, number>;

  public getUtilisateur!: BelongsToGetAssociationMixin<Utilisateur>;
  public setUtilisateur!: BelongsToSetAssociationMixin<Utilisateur, number>;
}

Reservation.init(
  {
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
    paymentInfo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    siegeId: {
      type: DataTypes.INTEGER,
      field: 'siege_id',
    },
    utilisateurId: {
      type: DataTypes.INTEGER,
      
      field: 'utilisateur_id',
    },
  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'Reservation',
    timestamps: true,
  }
);

Reservation.belongsTo(Siege, { foreignKey: 'siegeId' });
Reservation.belongsTo(Utilisateur, { as:'utilisateur',foreignKey: 'utilisateurId' });

export default Reservation;
