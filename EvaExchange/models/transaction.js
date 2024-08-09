const Sequelize = require('sequelize');
const db = require('../util/database');
const Portfolio = require('./portfolio');
const Share = require('./share');
const PortfolioShare = require('./portfolioShare');

const Transaction = db.define('Transaction', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  portfolioId: {
    type: Sequelize.INTEGER,
    references: {
      model: Portfolio,
      key: 'id'
    }
  },
  shareSymbol: {
    type: Sequelize.STRING(3),
    references: {
      model: Share,
      key: 'symbol'
    }
  },
  buyOrSell: {
    type: Sequelize.ENUM('BUY', 'SELL'),
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  timestamp: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false
});

Transaction.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
Transaction.belongsTo(Share, { foreignKey: 'shareSymbol', as: 'share' });

module.exports = Transaction;