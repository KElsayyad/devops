import { DataTypes } from 'sequelize';

import { sequelize } from '../../../config/dbConnections/postgresqlConnection.js';
import { USER_ROLES } from '../helpers/constants.js';

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: USER_ROLES.READER
    }
  },
  {
    tableName: 'users',
    timestamps: false
  }
);

export default User;
