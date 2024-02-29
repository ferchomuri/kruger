'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
      Employees.belongsTo(models.Vaccines, { foreignKey: 'vaccineID' });
    }
  }
  Employees.init({
    employeeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    vaccinationStatus: DataTypes.INTEGER,
    vaccineDate: DataTypes.DATE,
    numberOfDose: DataTypes.INTEGER,
    vaccineID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Vaccines',
        key: 'vaccineID'
      }
    },
  }, {
    sequelize,
    modelName: 'Employees',
    tableName: 'Employees'
  });
  return Employees;
};