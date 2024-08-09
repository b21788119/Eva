const express = require('express');
const portfolioController = require('../controllers/portfolios');
const Router = express.Router();

// CRUD Routes /portfolios
Router.get('/', portfolioController.getPortfolios);
Router.get('/:portfolioId', portfolioController.getPortfolio);
Router.post('/',portfolioController.createPortfolio);
Router.put('/:portfolioId', portfolioController.updatePortfolio);
Router.delete('/:portfolioId', portfolioController.deletePortfolio);

// Additional routes
Router.get('/:portfolioId/statistics', portfolioController.getPortfolioStatistics);
Router.get('/user/:userId', portfolioController.getPortfolioByUserId);
Router.get('/user/:userId/stats', portfolioController.getPortfolioStatsByUserId);
const portfolioShareRoutes = require('./portfolioShares');
Router.use('/:portfolioId/shares/', portfolioShareRoutes);

module.exports = Router;