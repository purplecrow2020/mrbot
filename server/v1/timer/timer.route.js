const express = require('express');
// const paramValidation = require('./jira.validation');
const validate = require('express-validator');
const AuthMiddleware = require('../../../middlewares/auth')

const router = express.Router();
const timerController = require('./timer.controller');

router.route('/').post(AuthMiddleware.authenticate, timerController.addTimer);
router.route('/pause/:timerId').patch(AuthMiddleware.authenticate, timerController.pauseTimer);
router.route('/resume/:timerId').patch(AuthMiddleware.authenticate, timerController.resumeTimer);
router.route('/done/:timerId').patch(AuthMiddleware.authenticate, timerController.doneTimer);
router.route('/').get(AuthMiddleware.authenticate, timerController.getAllTimers);
router.route('/:timerId').get(AuthMiddleware.authenticate, timerController.getTimerByTimerId);


module.exports = router;