const Sequelize = require('sequelize');
const db = require('../util/database');

const Share = db.define('Share', {
  // Primary key to uniquely identify a share
  symbol: {
    type: Sequelize.STRING(3),
    primaryKey: true,
    allowNull: false,
    // Ensure symbol is exactly 3 characters long
    validate: {
      len: [3, 3] 
    }
  },
  // Must be updated periodically
  currentPrice: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Share;