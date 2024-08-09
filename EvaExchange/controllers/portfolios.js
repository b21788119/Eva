const User = require('../models/user');
const Portfolio = require('../models/portfolio');
const PortfolioShare = require('../models/portfolioShare');
const Share = require('../models/share');
const Transaction = require('../models/transaction');

// Get all portfolios
exports.getPortfolios = (req, res, next) => {
    Portfolio.findAll()
        .then(portfolios => {
            res.status(200).json({ portfolios: portfolios });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch portfolios.' });
        });
};

// Get portfolio by Id(Some stats included)
exports.getPortfolio = (req, res, next) => {
    const portfolioId = req.params.portfolioId;
    Portfolio.findByPk(req.params.portfolioId, {
      include: [{
        model: PortfolioShare,
        as: 'shares',
        include: [{
          model: Share,
          as: 'share'
        }]
      }]
    })
    .then(portfolio => {
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found!' });
      }
      const portfolioShares = portfolio.shares;
      const sharePromises = portfolioShares.map( portfolioShare => {
        return Transaction.findAll({
          where: {
            portfolioId: portfolioId,
            shareSymbol: portfolioShare.shareSymbol
          }
        })
        .then(transactions => {
          let totalQuantity = 0;
          transactions.forEach(transaction => {
            if (transaction.buyOrSell === 'BUY') {
              totalQuantity += transaction.quantity;
            } else {
              totalQuantity -= transaction.quantity;
            }
          });
          return {
            id:portfolioShare.id,
            shareSymbol: portfolioShare.shareSymbol,
            currentPrice: portfolioShare.share.currentPrice,
            totalQuantity: totalQuantity,
            value: parseFloat((totalQuantity * portfolioShare.share.currentPrice).toFixed(2))
          };
        });
      });
      Promise.all(sharePromises)
      .then(sharesDto => {
        const totalPortfolioValue = sharesDto.reduce((acc, share) => acc + share.value, 0);
        res.status(200).json({ portfolio:{
          id:portfolio.id,name:portfolio.name,updatedAt:portfolio.updatedAt,createdAt:portfolio.createdAt,
          totalPortfolioValue: parseFloat(totalPortfolioValue.toFixed(2)),
          shares: sharesDto},
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch portfolio shares.' });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch portfolio.' });
    });
  };


// Get portfolio by userId
exports.getPortfolioByUserId = (req, res, next) => {

    Portfolio.findOne({
        where: { userId: req.params.userId },
        include: [{
          model: PortfolioShare,
          as: 'shares',
          include: [{
            model: Share,
            as: 'share'
          }]
        }]
      })
      .then(portfolio => {
        if (!portfolio) {
          return res.status(404).json({ message: 'Portfolio not found!' });
        }
        const portfolioShares = portfolio.shares;
        const sharePromises = portfolioShares.map( portfolioShare => {
          return Transaction.findAll({
            where: {
              portfolioId: portfolio.id,
              shareSymbol: portfolioShare.shareSymbol
            }
          })
          .then(transactions => {
            let totalQuantity = 0;
            transactions.forEach(transaction => {
              if (transaction.buyOrSell === 'BUY') {
                totalQuantity += transaction.quantity;
              } else {
                totalQuantity -= transaction.quantity;
              }
            });
            return {
              id:portfolioShare.id,
              shareSymbol: portfolioShare.shareSymbol,
              currentPrice: portfolioShare.share.currentPrice,
              totalQuantity: totalQuantity,
              value: parseFloat((totalQuantity * portfolioShare.share.currentPrice).toFixed(2))
            };
          });
        });
        Promise.all(sharePromises)
        .then(sharesDto => {
          const totalPortfolioValue = sharesDto.reduce((acc, share) => acc + share.value, 0);
          res.status(200).json({ portfolio:{
            id:portfolio.id,name:portfolio.name,updatedAt:portfolio.updatedAt,createdAt:portfolio.createdAt,
            totalPortfolioValue: parseFloat(totalPortfolioValue.toFixed(2)),
            shares: sharesDto},
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Failed to fetch portfolio shares.' });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch portfolio.' });
      });
   
};

// Create a new portfolio
exports.createPortfolio = (req, res, next) => {
    const userId = req.body.userId;
    Portfolio.create({
        userId: userId,
        name:req.body.name
    })
        .then(result => {
            console.log('Created Portfolio');
            res.status(201).json({
                message: 'Portfolio created successfully!',
                portfolio: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Failed to create portfolio.' });
        });
};

// Update portfolio
exports.updatePortfolio = (req, res, next) => {
    const name = req.body.name;
    Portfolio.findByPk(req.params.portfolioId)
        .then(portfolio => {
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found!' });
            }
            portfolio.name = name;
            return portfolio.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Portfolio updated!', portfolio: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Failed to update portfolio.' });
        });
};

// Delete portfolio
exports.deletePortfolio = (req, res, next) => {
    const portfolioId = req.params.portfolioId;
    Portfolio.findByPk(portfolioId)
        .then(portfolio => {
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found!' });
            }
            return Portfolio.destroy({
                where: {
                    id: portfolioId
                }
            });
        })
        .then(result => {
            res.status(200).json({ message: 'Portfolio deleted!' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Failed to delete portfolio.' });
        });
};


exports.getPortfolioStatistics = (req, res, next) => {
    const portfolioId = req.params.portfolioId;
    Portfolio.findByPk(req.params.portfolioId, {
      include: [{
        model: PortfolioShare,
        as: 'shares',
        include: [{
          model: Share,
          as: 'share'
        }]
      }]
    })
    .then(portfolio => {
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found!' });
      }
      const portfolioShares = portfolio.shares;
      const sharePromises = portfolioShares.map(portfolioShare => {
        return Transaction.findAll({
          where: {
            portfolioId: portfolioId,
            shareSymbol: portfolioShare.shareSymbol
          }
        })
        .then(transactions => {
          let totalQuantity = 0;
          let totalCost = 0;
          transactions.forEach(transaction => {
            if (transaction.buyOrSell === 'BUY') {
              totalQuantity += transaction.quantity;
              totalCost += transaction.quantity * transaction.price;
            } else {
              totalQuantity -= transaction.quantity;
              totalCost -= transaction.quantity * transaction.price;
            }
          });
          const currentPrice = portfolioShare.share.currentPrice;
          const currentValue = totalQuantity * currentPrice;
          const profitLoss = currentValue - totalCost;
          const profitLossPercentage = (profitLoss / totalCost) * 100;
          return {
            id: portfolioShare.id,
            shareSymbol: portfolioShare.shareSymbol,
            currentPrice: currentPrice,
            totalQuantity: totalQuantity,
            value: parseFloat((totalQuantity * currentPrice).toFixed(2)),
            profitLoss: parseFloat(profitLoss.toFixed(2)),
            profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2))
          };
        });
      });
      Promise.all(sharePromises)
      .then(sharesDto => {
        const totalPortfolioValue = sharesDto.reduce((acc, share) => acc + share.value, 0);
        const totalPortfolioCost = sharesDto.reduce((acc, share) => acc + share.totalCost, 0);
        const totalPortfolioProfitLoss = totalPortfolioValue - totalPortfolioCost;
        const totalPortfolioProfitLossPercentage = (totalPortfolioProfitLoss / totalPortfolioCost) * 100;
        res.status(200).json({
          portfolio: {
            id: portfolio.id,
            name: portfolio.name,
            updatedAt: portfolio.updatedAt,
            createdAt: portfolio.createdAt,
            totalPortfolioValue: parseFloat(totalPortfolioValue.toFixed(2)),
            totalPortfolioProfitLoss: parseFloat(totalPortfolioProfitLoss.toFixed(2)),
            totalPortfolioProfitLossPercentage: parseFloat(totalPortfolioProfitLossPercentage.toFixed(2)),
            shares: sharesDto
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch portfolio shares.' });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch portfolio.' });
    });
  };