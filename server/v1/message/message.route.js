const express = require('express');
const AuthMiddleware = require('../../../middlewares/auth')

const router = express.Router();
const messageController = require('./message.controller');

router.route('/subjects').get(AuthMiddleware.authenticate, messageController.searchAutoCompleteSubject);
router.route('/').post(AuthMiddleware.authenticate, messageController.addMessage);
router.route('/').get(AuthMiddleware.authenticate, messageController.getAllMessage);

router.route('/templates').get(AuthMiddleware.authenticate, messageController.messageTemplates);
router.route('/templates-selection-options').get(AuthMiddleware.authenticate, messageController.messageSelectedTemplateSelectionOptions);
router.route('/:messageId').get(AuthMiddleware.authenticate, messageController.getMessage);




module.exports = router;