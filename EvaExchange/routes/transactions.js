const express = require('express');
const transactionController = require('../controllers/transactions');
const Router = express.Router();

Router.post('/', transactionController.createTransaction);
Router.get('/', transactionController.getTransactions);
Router.get('/:id', transactionController.getTransaction);
Router.put('/:id', transactionController.updateTransaction);
Router.delete('/:id', transactionController.deleteTransaction);

module.exports = Router;