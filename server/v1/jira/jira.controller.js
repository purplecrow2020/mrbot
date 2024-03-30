const jiraService = require('./jira.service')



async function createIntegration(req, res) {
    try {
        const {
            name,
        } = req.body;

        const mongo = req.app.get('db')
        await mongo.collection('jiraintegrations').insertOne({
            name,
        })

        const config = req.app.get('config');
        const redirectUrl = jiraService.getJiraRedirectUri(config.jira.clientId, 'http://localhost:9000/v1/jira/callback', 'state');
        return res.json({
            "meta": {
                "success": true,
            }, 
            "data": {
                redirectUrl,
            },
        })
    } catch (err) {
        console.log(err);
    }
}


async function handleJiraIntCallback(req, res) {
    const { code } = req.query;
    console.log(code);

    try {
        const config = req.app.get('config');
        const token = await jiraService.getAccessToken(config.jira.clientId, config.jira.clientSecret, code);
        console.log(token);
        return res.json({
            "meta": {
                "success": true,
            }, 
            "data": {
                token,
            },
        })
    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    createIntegration,
    handleJiraIntCallback,
}