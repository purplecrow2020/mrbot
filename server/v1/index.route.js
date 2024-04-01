const express = require('express');

const router = express.Router();

// route requiremets
const userRoutes = require('./user/user.route');
const jiraRoutes = require('./jira/jira.route');

// router usages
router.get('/health-check', (req, res) => res.send('OK2'));
router.use('/user', userRoutes);
router.use('/jira', jiraRoutes);

module.exports = router;