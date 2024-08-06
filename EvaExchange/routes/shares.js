const express = require('express');
const shareController = require('../controllers/shares');
const Router = express.Router();

// CRUD Routes /shares
Router.get('/', shareController.getShares); // GET /shares - Fetch all shares
Router.get('/:symbol', shareController.getShare); // GET /shares/:symbol - Fetch a specific share by symbol
Router.post('/', shareController.createShare); // POST /shares - Create a new share
Router.put('/:symbol', shareController.updateShare); // PUT /shares/:symbol - Update a specific share by symbol
Router.delete('/:symbol', shareController.deleteShare); // DELETE /shares/:symbol - Delete a specific share by symbol

module.exports = Router;