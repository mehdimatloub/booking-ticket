const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelizeConfig = require('../config/config.json');

const sequelize = new Sequelize(sequelizeConfig.development);

class Category extends Model {
  static associate(models) {
    Category.hasMany(models.Evenement, { foreignKey: 'category', as: 'evenements' });
  }
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'Category',
    timestamps: false,
  }
);


module.exports = Category;
