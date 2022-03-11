'use strict';
module.exports = (sequelize, DataTypes) => {
  var posts = sequelize.define(
    'posts',
    {
      PostId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      PostTitle: DataTypes.STRING,
      PostBody: DataTypes.STRING,
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'UserId'
        }
      },
      Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {}
  );

  return posts;
};