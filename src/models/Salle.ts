import Ville from './Ville';
import Siege from './Siege';
import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize/types/associations/belongs-to';
import { HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from 'sequelize/types/associations/has-many';
import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

interface SalleAttributes {
  id: number;
  nom: string;
  capacite: number;
  etat: string;
  villeId: number;
  plan: string;
}

class Salle extends Model<SalleAttributes> implements SalleAttributes {
  public id!: number;
  public nom!: string;
  public capacite!: number;
  public etat!: string;
  public villeId!: number;
  public plan!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getVille!: BelongsToGetAssociationMixin<Ville>;
  public setVille!: BelongsToSetAssociationMixin<Ville, number>;
  public createVille!: BelongsToCreateAssociationMixin<Ville>;

  public getSieges!: HasManyGetAssociationsMixin<Siege>;
  public addSiege!: HasManyAddAssociationMixin<Siege, number>;
  public hasSiege!: HasManyHasAssociationMixin<Siege, number>;
  public countSieges!: HasManyCountAssociationsMixin;
  public createSiege!: HasManyCreateAssociationMixin<Siege>;
}

Salle.init(
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
    capacite: {
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
  },
  {
    sequelize,
    modelName: 'Salle',
    tableName: 'Salle',
    timestamps: true,
  }
);

Salle.belongsTo(Ville, { foreignKey: 'ville_id' });
Salle.hasMany(Siege, { foreignKey: 'salle_id'});

export default Salle;
