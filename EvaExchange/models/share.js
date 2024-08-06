const Sequelize = require('sequelize');
const db = require('../util/database');

const Share = db.define('share', {
  symbol: {
    type: Sequelize.STRING(3),
    primaryKey: true,
    allowNull: false,
    validate: {
        len: [3, 3] // Ensure symbol is exactly 3 characters long
      }
  },
  currentRate: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true
    }
  },
  lastRate: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true
    }
  }

}, {
  timestamps: true
});

module.exports = Share;