const PortfolioShare = require('../models/portfolioShare');
const Portfolio = require('../models/portfolio');
const Share = require('../models/share');

// Get all portfolio shares
exports.getPortfolioShares = async (req, res, next) => {
  try {
    const portfolioShares = await PortfolioShare.findAll({ where: { portfolioId: req.params.portfolioId } });
    res.status(200).json({ portfolioShares });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch portfolio shares.' });
  }
};

// Get portfolio shares by portfolio ID and symbol
exports.getPortfolioSharesByPortfolioIdAndSymbol = async (req, res, next) => {
  const portfolioId = req.params.portfolioId;
  const symbol = req.params.symbol;
  try {
    const portfolioShares = await PortfolioShare.findAll({ where: { portfolioId:portfolioId, shareSymbol: symbol } });
    res.status(200).json({ portfolioShares });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch portfolio shares.' });
  }
};

// Create a new portfolio share
exports.createPortfolioShare = async (req, res, next) => {
  const portfolioId = req.body.portfolioId;
  const symbol = req.body.symbol;
  const quantity = req.body.quantity;
  try {
    const portfolioShare = await PortfolioShare.create({ portfolioId, shareSymbol: symbol, quantity });
    console.log('Created Portfolio Share');
    res.status(201).json({ message: 'Portfolio share created successfully!', portfolioShare });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to create portfolio share.' });
  }
};

// Update portfolio share by portfolio ID and symbol
exports.updatePortfolioShareByPortfolioIdAndSymbol = async (req, res, next) => {
  const portfolioId = req.params.portfolioId;
  const symbol = req.params.symbol;
  const quantity = req.body.quantity;
  try {
    const portfolioShare = await PortfolioShare.findOne({ where: { portfolioId, shareSymbol: symbol } });
    if (!portfolioShare) {
      return res.status(404).json({ message: 'Portfolio share not found!' });
    }
    portfolioShare.quantity = quantity;
    await portfolioShare.save();
    res.status(200).json({ message: 'Portfolio share updated!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update portfolio share.' });
  }
};

// Delete portfolio share by portfolio ID and symbol
exports.deletePortfolioShareByPortfolioIdAndSymbol = async (req, res, next) => {
  const portfolioId = req.params.portfolioId;
  const symbol = req.params.symbol;
  try {
    const portfolioShare = await PortfolioShare.findOne({ where: { portfolioId, shareSymbol: symbol } });
    if (!portfolioShare) {
      return res.status(404).json({ message: 'Portfolio share not found!' });
    }
    await portfolioShare.destroy();
    res.status(200).json({ message: 'Portfolio share deleted!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to delete portfolio share.' });
  }
};