const Sequelize = require('sequelize');
const db = require('../util/database');
const User = require('./user'); 

const Portfolio = db.define('Portfolio', {
  // Primary key
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  // Foreign key to reference related user
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: Sequelize.STRING(255)
  }
});

// Create a one-to-one relationship between User and Portfolio
User.hasOne(Portfolio, { foreignKey: 'userId', as: 'portfolio' });
Portfolio.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Portfolio;