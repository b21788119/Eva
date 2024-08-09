const express = require('express');
const userController = require('../controllers/users');
var userRouter = express.Router();

// CRUD Routes
userRouter.get('/', userController.getUsers); 
userRouter.get('/:userId', userController.getUser); 
userRouter.post('/', userController.createUser);
userRouter.put('/:userId', userController.updateUser);
userRouter.delete('/:userId', userController.deleteUser);

module.exports = userRouter;