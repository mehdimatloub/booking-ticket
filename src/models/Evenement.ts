
import Ville from './Ville';
import Session from './Session';
import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize/types/associations/belongs-to';
import { HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from 'sequelize/types/associations/has-many';
import { DataTypes,Model } from 'sequelize';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
});



interface EvenementAttributes {
  id: number;
  nom: string;
  date: Date;
  lieu: string;
  villeId: number;
}

class Evenement extends Model<EvenementAttributes> implements EvenementAttributes {
  public id!: number;
  public nom!: string;
  public date!: Date;
  public lieu!: string;
  public villeId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getVille!: BelongsToGetAssociationMixin<Ville>;
  public setVille!: BelongsToSetAssociationMixin<Ville, number>;
  public createVille!: BelongsToCreateAssociationMixin<Ville>;

  public getSessions!: HasManyGetAssociationsMixin<Session>;
  public addSession!: HasManyAddAssociationMixin<Session, number>;
  public hasSession!: HasManyHasAssociationMixin<Session, number>;
  public countSessions!: HasManyCountAssociationsMixin;
  public createSession!: HasManyCreateAssociationMixin<Session>;
}

Evenement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lieu: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    villeId: {
      type: DataTypes.INTEGER,
      field: 'ville_id',
    },
  },
  {
    sequelize,
    modelName: 'Evenement',
    tableName: 'Evenement',
    timestamps: true,
  }
);

Evenement.belongsTo(Ville, { foreignKey: 'ville_id' });
Evenement.hasMany(Session, { foreignKey: 'evenement_id' });

export default Evenement;
