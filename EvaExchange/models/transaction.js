const Sequelize = require('sequelize');
const db = require('../util/database');
const Portfolio = require('./portfolio');
const Share = require('./share');
const PortfolioShare = require('./portfolioShare');

const Transaction = db.define('transaction', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
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

Transaction.belongsTo(Portfolio, { foreignKey: 'portfolioId' });
Transaction.belongsTo(Share, { foreignKey: 'shareSymbol' });

// After creating a transaction, update the corresponding portfolio share
Transaction.afterCreate((transaction) => {
  const portfolioShare = PortfolioShare.findOne({
    where: {
      portfolioId: transaction.portfolioId,
      shareSymbol: transaction.shareSymbol
    }
  });

  if (transaction.buyOrSell === 'BUY') {
    portfolioShare.then((ps) => {
      if (ps) {
        ps.quantity += transaction.quantity;
        ps.save();
      } else {
        PortfolioShare.create({
          portfolioId: transaction.portfolioId,
          shareSymbol: transaction.shareSymbol,
          quantity: transaction.quantity
        });
      }
    });
  } else if (transaction.buyOrSell === 'SELL') {
    portfolioShare.then((ps) => {
      if (ps) {
        // There must be enough share in the users portfolio to sell
        if (ps.quantity >= transaction.quantity) {
            ps.quantity -= transaction.quantity;
            ps.save();
          }
      } else {
        
      }
    });
  }
});

module.exports = Transaction;