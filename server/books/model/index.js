import { DataTypes } from 'sequelize';

import { sequelize } from '../../../config/dbConnections/postgresqlConnection.js';

const Book = sequelize.define(
  'Book',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uniqueReadPages: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    intervals: {
      type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)),
      allowNull: true,
      defaultValue: []
    }
  },
  {
    tableName: 'books',
    timestamps: false,
    indexes: [
      {
        fields: [
          {
            attribute: 'uniqueReadPages',
            order: 'DESC'
          }
        ],
        name: 'idx_unique_read_pages_desc'
      }
    ]
  }
);

export default Book;
