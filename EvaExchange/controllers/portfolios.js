const User = require('../models/user');
const Portfolio = require('../models/portfolio');

// Get all portfolios
exports.getPortfolios = (req, res, next) => {
    Portfolio.findAll({ include: User })
        .then(portfolios => {
            res.status(200).json({ portfolios: portfolios });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch portfolios.' });
        });
};

// Get portfolio by ID
exports.getPortfolio = (req, res, next) => {
    const portfolioId = req.params.portfolioId;
    Portfolio.findByPk(portfolioId, { include: User })
        .then(portfolio => {
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found!' });
            }
            res.status(200).json({ portfolio: portfolio });
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
        userId: userId
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
    const portfolioId = req.params.portfolioId;
    const userId = req.body.userId;

    Portfolio.findByPk(portfolioId)
        .then(portfolio => {
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found!' });
            }
            portfolio.userId = userId;
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