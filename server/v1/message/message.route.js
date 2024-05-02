const express = require('express');
const AuthMiddleware = require('../../../middlewares/auth')

const router = express.Router();
const messageController = require('./message.controller');

router.route('/').get(AuthMiddleware.authenticate, messageController.searchAutoCompleteSubject);
router.route('/').post(AuthMiddleware.authenticate, messageController.addMessage);


module.exports = router;