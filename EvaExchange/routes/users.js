const express = require('express');
const userController = require('../controllers/users');
var userRouter = express.Router();

// CRUD Routes /users
userRouter.get('/', userController.getUsers); // /users
userRouter.get('/:userId', userController.getUser); // /users/:userId
userRouter.post('/', userController.createUser); // /users
userRouter.put('/:userId', userController.updateUser); // /users/:userId
userRouter.delete('/:userId', userController.deleteUser); // /users/:userId

module.exports = userRouter;