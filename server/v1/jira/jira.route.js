const express = require('express');
const paramValidation = require('./jira.validation');
const validate = require('express-validator');
const AuthMiddleware = require('../../../middlewares/auth')

const router = express.Router();
const jiraController = require('./jira.controller')

router.route('/integration').post(validate(paramValidation.jira.createIntegration), AuthMiddleware.authenticate, jiraController.createIntegration);
router.route('/callback').get(validate(paramValidation.jira.createIntegration), jiraController.handleJiraIntCallback);
router.route('/projects').get(validate(paramValidation.jira.createIntegration), jiraController.getJiraProjects);
router.route('/integrations').get(validate(paramValidation.jira.createIntegration), AuthMiddleware.authenticate, jiraController.getAllIntegrations);
router.route('/integrations/:integrationId').delete(validate(paramValidation.jira.createIntegration), AuthMiddleware.authenticate, jiraController.deleteIntegrationBySelectedIntegrationId);

router.route('/projects/:projectId/issues').get(validate(paramValidation.jira.createIntegration), AuthMiddleware.authenticate, jiraController.getAllIssuesOfSelectedProject);
router.route('/projects/:projectId/issues/:issueId').get(validate(paramValidation.jira.createIntegration), AuthMiddleware.authenticate, jiraController.getDetailsOfSelectedIssuesOfSelectedProject);

// this is not working properly
router.route('/projects').put(validate(paramValidation.jira.createIntegration), jiraController.updateJiraProjectByProjectId);

// re-authentication integration
router.route('/integration').put(validate(paramValidation.jira.createIntegration), AuthMiddleware.authenticate, jiraController.updateIntegration);




module.exports = router;