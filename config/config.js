require('dotenv').config();

const Joi = require('joi');

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').default('development'),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required().description('mongo db url'),
    MONGO_DB: Joi.string().required().description('mongo db name'),
    JWT_SECRET: Joi.string().required().description('jwt secret'),
    JIRA_CLIENT_ID: Joi.string().required().description('jira client id'),
    JIRA_CLIENT_SECRET: Joi.string().required().description('jira client secret'),
}).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const appConfig = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongo: {
        host: envVars.MONGO_URI,
        dbname: envVars.MONGO_DB
    },
    versions: {
        'Version 1': '/v1',
    },
    jwtSecret: envVars.JWT_SECRET,
    jira: {
        clientId: envVars.JIRA_CLIENT_ID,
        clientSecret: envVars.JIRA_CLIENT_SECRET,
    }
};

module.exports = { ...appConfig };