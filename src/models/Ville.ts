import Evenement from './Evenement';
import Salle from './Salle';
import { HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from 'sequelize/types/associations/has-many';
import { DataTypes,Model } from 'sequelize';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
});


interface VilleAttributes {
  id: number;
  nom: string;
  adresse: string;
  code_postal: string;
}

class Ville extends Model<VilleAttributes> implements VilleAttributes {
  public id!: number;
  public nom!: string;
  public adresse!: string;
  public code_postal!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getEvenements!: HasManyGetAssociationsMixin<Evenement>;
  public addEvenement!: HasManyAddAssociationMixin<Evenement, number>;
  public hasEvenement!: HasManyHasAssociationMixin<Evenement, number>;
  public countEvenements!: HasManyCountAssociationsMixin;
  public createEvenement!: HasManyCreateAssociationMixin<Evenement>;

  public getSalles!: HasManyGetAssociationsMixin<Salle>;
  public addSalle!: HasManyAddAssociationMixin<Salle, number>;
  public hasSalle!: HasManyHasAssociationMixin<Salle, number>;
  public countSalles!: HasManyCountAssociationsMixin;
  public createSalle!: HasManyCreateAssociationMixin<Salle>;
}

Ville.init(
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
    adresse: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code_postal: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Ville',
    tableName: 'Ville',
    timestamps: true,
  }
);

Ville.hasMany(Evenement, { foreignKey: 'ville_id' });
Ville.hasMany(Salle, { foreignKey: 'ville_id' });

export default Ville;
