const jiraService = require('./jira.service')
const {
    ObjectId,
} = require('mongodb')
async function createIntegration(req, res) {
    try {
        const {
            name,
        } = req.body;

        const {
            _id,
        } = req.user;

        const mongo = req.app.get('db')
        const newIntegration = await mongo.collection('jiraintegrations').insertOne({
            userId: _id,
            name,
            success: false,
        })
        const config = req.app.get('config');
        const redirectUrl = jiraService.getJiraRedirectUri(config.jira.clientId, 'http://localhost:9000/v1/jira/callback', `${_id.toString()}:${newIntegration.insertedId.toString()}`);
        return res.json({
            "meta": {
                "success": true,
            }, 
            "data": {
                integrationId: newIntegration.insertedId.toString(), 
                redirectUrl,
            },
        })
    } catch (err) {
        console.log(err);
    }
}

async function getAllIntegrations(req, res) {
    try {
        const {
            _id,
        } = req.user;

        const mongo = req.app.get('db')
        const integrations = await mongo.collection('jiraintegrations').find({
            userId: new ObjectId(_id),
        }).toArray();
        return res.json({
            "meta": {
                "success": true,
            }, 
            "data": {
                integrations: integrations,
            },
        })
    } catch (err) {
        console.log(err);
    }
}

async function handleJiraIntCallback(req, res) {
    const { code, state } = req.query;
    try {
        const config = req.app.get('config');
        const mongo = req.app.get('db')
        // TODO: add check for is code valid
        const token = await jiraService.getAccessToken(config.jira.clientId, config.jira.clientSecret, code);
        const {
            userId,
            integrationId,
        } = jiraService.extractInfoFromCode(state);
        await mongo.collection('jiraintegrations').updateOne({
            _id: new ObjectId(integrationId),
        },{
            $set: {
                token,
                success: true,
            }
        });

        res.redirect(301, `http://localhost:5173/layout/jira-integration/${integrationId}`)
    } catch (err) {
        console.log(err);
    }
}


async function getJiraProjects(req, res) {
    try {
        const {
            integrationId,
        } = req.query;

        const mongo = req.app.get('db')
        const jiraintegration = await mongo.collection('jiraintegrations').findOne({
            _id: new ObjectId(integrationId),
        })

        const apiToken = jiraintegration.token.access_token;
        const projects = await jiraService.listProjects(apiToken)
        return res.json({
            "meta": {
                "success": true,
            }, 
            "data": {
                projects,
            },
        })
    } catch (err) { 
        console.log(err);
    }
}



module.exports = {
    createIntegration,
    handleJiraIntCallback,
    getJiraProjects,
    getAllIntegrations,
}