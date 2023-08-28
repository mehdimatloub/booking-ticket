import Evenement from './Evenement';
import Salle from './Salle';
import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize/types/associations/belongs-to';
import { DataTypes,Model } from 'sequelize';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
});


interface SessionAttributes {
  id: number;
  heureDebut: string;
  heureFin: string;
  salleId: number;
  evenementId: number;
}

class Session extends Model<SessionAttributes> implements SessionAttributes {
  public id!: number;
  public heureDebut!: string;
  public heureFin!: string;
  public salleId!: number;
  public evenementId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getEvenement!: BelongsToGetAssociationMixin<Evenement>;
  public setEvenement!: BelongsToSetAssociationMixin<Evenement, number>;
  public createEvenement!: BelongsToCreateAssociationMixin<Evenement>;

  public getSalle!: BelongsToGetAssociationMixin<Salle>;
  public setSalle!: BelongsToSetAssociationMixin<Salle, number>;
  public createSalle!: BelongsToCreateAssociationMixin<Salle>;

}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    heureDebut: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    heureFin: {
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
  },
  {
    sequelize,
    modelName: 'Session',
    tableName: 'Session',
    timestamps: true,
  }
);

Session.belongsTo(Evenement, { foreignKey: 'evenement_id'});
Session.belongsTo(Salle, { foreignKey: 'salle_id' });

export default Session;
