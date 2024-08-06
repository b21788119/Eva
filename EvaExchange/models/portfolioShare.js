const Sequelize = require('sequelize');
const db = require('../util/database');
const Portfolio = require('./portfolio');
const Share = require('./share');

const PortfolioShare = db.define('portfolio_share', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    validate: {
      len: [3, 3] // Ensure symbol is exactly 3 characters long
    }
  },
  portfolioId: {
    type: Sequelize.INTEGER,
    references: {
      model: db.models.portfolio,
      key: 'id'
    }
  },
  shareSymbol: {
    type: Sequelize.STRING(3),
    references: {
      model: db.models.share,
      key: 'symbol'
    }
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false
});

Portfolio.hasMany(PortfolioShare, { foreignKey: 'portfolioId', as: 'shares' });
Share.hasMany(PortfolioShare, { foreignKey: 'shareSymbol', as: 'portfolios' });
PortfolioShare.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
PortfolioShare.belongsTo(Share, { foreignKey: 'shareSymbol', as: 'share' });

module.exports = PortfolioShare;