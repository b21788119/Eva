const Sequelize = require('sequelize');
const db = require('../util/database');
const Portfolio = require('./portfolio');
const Share = require('./share');

const PortfolioShare = db.define('Portfolio_Share', {
  // Primary key
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  // Foreign key to reference related portfolio
  portfolioId: {
    type: Sequelize.INTEGER,
    references: {
      model: Portfolio,
      key: 'id'
    }
  },
  // Foreign key to reference related share
  shareSymbol: {
    type: Sequelize.STRING(3),
    references: {
      model: Share,
      key: 'symbol'
    },
    // Ensure that symbol is exactly 3 chars long.
    validate: {
      len: [3, 3]
    }
  }
}, {
  timestamps: true
});

// Relationship definitons
Portfolio.hasMany(PortfolioShare, { foreignKey: 'portfolioId', as: 'shares' });
Share.hasMany(PortfolioShare, { foreignKey: 'shareSymbol', as: 'portfolios' });
PortfolioShare.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
PortfolioShare.belongsTo(Share, { foreignKey: 'shareSymbol', as: 'share' });

module.exports = PortfolioShare;