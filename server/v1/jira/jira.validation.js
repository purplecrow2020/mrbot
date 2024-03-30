const Joi = require('joi');

module.exports = {
    jira: {
        createIntegration: {
            body: {
                name: Joi.string().required(),
            },
        },
    },
};