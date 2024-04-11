const express = require('express');
// const paramValidation = require('./jira.validation');
const validate = require('express-validator');
const AuthMiddleware = require('../../../middlewares/auth')

const router = express.Router();
const scrumController = require('./scrum.controller')

router.route('/').post(AuthMiddleware.authenticate, scrumController.createSchedule);
router.route('/').get(AuthMiddleware.authenticate, scrumController.getAllSchedules);
router.route('/:scheduleId').put(AuthMiddleware.authenticate, scrumController.updateSchedule);
router.route('/:scheduleId').delete(AuthMiddleware.authenticate, scrumController.deleteSchedule);
router.route('/:scrumId').get(AuthMiddleware.authenticate, scrumController.getScheduleByScrumId);




module.exports = router;