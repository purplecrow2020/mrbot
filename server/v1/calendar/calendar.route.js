const express = require('express');
// const paramValidation = require('./jira.validation');
const validate = require('express-validator');
const AuthMiddleware = require('../../../middlewares/auth')

const router = express.Router();
const calendarController = require('./calendar.controller');

router.route('/timer').post(AuthMiddleware.authenticate, calendarController.addTimerEvent);
router.route('/timer').get(AuthMiddleware.authenticate, calendarController.getAllTimerEvents);
router.route('/timer/:eventId').get(AuthMiddleware.authenticate, calendarController.getTimerEventByEventId);


module.exports = router;