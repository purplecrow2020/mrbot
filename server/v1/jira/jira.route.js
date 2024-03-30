const express = require('express');
const paramValidation = require('./jira.validation');
const validate = require('express-validator');


const router = express.Router();
const jiraController = require('./jira.controller')

router.route('/integration').post(validate(paramValidation.jira.createIntegration), jiraController.createIntegration);
router.route('/callback').get(validate(paramValidation.jira.createIntegration), jiraController.handleJiraIntCallback);

module.exports = router;