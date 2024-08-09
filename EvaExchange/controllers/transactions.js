const Transaction = require('../models/transaction');
const Portfolio = require('../models/portfolio');
const Share = require('../models/share');
const PortfolioShare = require('../models/portfolioShare');

exports.createTransaction = async (req, res, next) => {
  try {
    const { portfolioId, shareSymbol, buyOrSell, quantity } = req.body;
    const portfolio = await Portfolio.findByPk(portfolioId, {
      include: [{ model: PortfolioShare, as: 'shares' }],
    });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    const share = await Share.findByPk(shareSymbol);
    if (!share) {
      return res.status(404).json({ error: 'Share not found' });
    }
    const portfolioShare = portfolio.shares.find((share) => share.shareSymbol === shareSymbol);
    
    if(!portfolioShare && buyOrSell === 'SELL'){
      return res.status(404).json({ error: 'You should first buy this share!' });
    }
    
    if (buyOrSell === 'SELL' && portfolioShare) {
      const currentQuantity = await Transaction.sum('quantity', {
        where: {
          portfolioId,
          shareSymbol,
          buyOrSell: 'BUY',
        },
      }) - await Transaction.sum('quantity', {
        where: {
          portfolioId,
          shareSymbol,
          buyOrSell: 'SELL',
        },
      });
      if (currentQuantity < quantity) {
        return res.status(404).json({ error: 'Insufficient share quantity' });
      }
    }
    const transaction = await Transaction.create({
      portfolioId,
      shareSymbol,
      buyOrSell,
      quantity,
      price: share.currentPrice,
    });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.getTransactionsByPortfolioId = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const transactions = await Transaction.findAll({
      where: {
        portfolioId,
      },
    });
    if (!transactions) {
      return res.status(404).json({ error: 'No transactions found for this portfolio' });
    }
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { portfolioId, shareSymbol, buyOrSell, quantity } = req.body;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    await transaction.update({
      portfolioId,
      shareSymbol,
      buyOrSell,
      quantity,
    });
    await updatePortfolioShare(transaction);
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    next(err);
  }
};

