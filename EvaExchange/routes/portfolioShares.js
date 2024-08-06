// portfolioShareRoutes.js
const express = require('express');
const portfolioShareController = require('../controllers/portfolioShares');
const Router = express.Router({ mergeParams: true })

Router.get('/', portfolioShareController.getPortfolioShares);
Router.get('/:symbol', portfolioShareController.getPortfolioSharesByPortfolioIdAndSymbol);
Router.post('/', portfolioShareController.createPortfolioShare);
Router.put('/:symbol', portfolioShareController.updatePortfolioShareByPortfolioIdAndSymbol);
Router.delete('/:symbol', portfolioShareController.deletePortfolioShareByPortfolioIdAndSymbol);
module.exports = Router;