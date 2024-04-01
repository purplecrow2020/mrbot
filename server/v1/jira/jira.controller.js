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
            name,
        })
        const config = req.app.get('config');
        const redirectUrl = jiraService.getJiraRedirectUri(config.jira.clientId, 'http://localhost:9000/v1/jira/callback', `${_id.toString()}:${newIntegration.insertedId.toString()}`);
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
    try {
        const config = req.app.get('config');
        const mongo = req.app.get('db')
        // TODO: add check for is code valid
        const token = await jiraService.getAccessToken(config.jira.clientId, config.jira.clientSecret, code);
        const {
            userId,
            integrationId,
        } = jiraService.extractInfoFromCode(code);

        await mongo.collection('jiraintegrations').updateOne({
            _id: new ObjectId(integrationId),
        },{
            $set: {
                token,
            }
        });

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


async function getJiraProjects(req, res) {
    try {
        const apiToken = `eyJraWQiOiJhdXRoLmF0bGFzc2lhbi5jb20tQUNDRVNTLWE5Njg0YTZlLTY4MjctNGQ1Yi05MzhjLWJkOTZjYzBiOTk0ZCIsImFsZyI6IlJTMjU2In0.eyJqdGkiOiJmNGIyNTE2NC00NmE4LTRhYjUtYjcwOS1jZjBkYmNiNzEyYjkiLCJzdWIiOiI1ZGRhNzhjODc1MmMxYjBkMTE0ZTYxYjkiLCJuYmYiOjE3MTE3ODU2MzEsImlzcyI6Imh0dHBzOi8vYXV0aC5hdGxhc3NpYW4uY29tIiwiaWF0IjoxNzExNzg1NjMxLCJleHAiOjE3MTE3ODkyMzEsImF1ZCI6IkhGZzAxWDNrM0FwZWtYRUNxVEd6OUhNS1E5NkFkNXhIIiwiaHR0cHM6Ly9pZC5hdGxhc3NpYW4uY29tL3Nlc3Npb25faWQiOiI4ZDViOWQyOC1iNDY2LTQ0NmUtYjFlMy1hZThhMjE3NWY2YTYiLCJodHRwczovL2lkLmF0bGFzc2lhbi5jb20vYXRsX3Rva2VuX3R5cGUiOiJBQ0NFU1MiLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudElkIjoiNzEyMDIwOmY3MTIzZWVlLTJiOGUtNGNhNC1hZDEyLWVmM2Q2ZmQxZWY3OCIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS9maXJzdFBhcnR5IjpmYWxzZSwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL3ZlcmlmaWVkIjp0cnVlLCJjbGllbnRfaWQiOiJIRmcwMVgzazNBcGVrWEVDcVRHejlITUtROTZBZDV4SCIsImh0dHBzOi8vaWQuYXRsYXNzaWFuLmNvbS91anQiOiJjYzYzZThiZi1jMzRhLTRmYjAtYjBlMS0zZTc0ZGU5YzBkNjUiLCJodHRwczovL2lkLmF0bGFzc2lhbi5jb20vcHJvY2Vzc1JlZ2lvbiI6InVzLWVhc3QtMSIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS9zeXN0ZW1BY2NvdW50RW1haWwiOiI0YzQzNDlhNy03NzI1LTRmN2YtYWNiZS1hYzhkOTU4ODEwOGJAY29ubmVjdC5hdGxhc3NpYW4uY29tIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2VtYWlsRG9tYWluIjoiZ21haWwuY29tIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tLzNsbyI6dHJ1ZSwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL29hdXRoQ2xpZW50SWQiOiJIRmcwMVgzazNBcGVrWEVDcVRHejlITUtROTZBZDV4SCIsImh0dHBzOi8vaWQuYXRsYXNzaWFuLmNvbS92ZXJpZmllZCI6dHJ1ZSwic2NvcGUiOiJ3cml0ZTpqaXJhLXdvcmsgcmVhZDpqaXJhLXVzZXIiLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudEVtYWlsRG9tYWluIjoiY29ubmVjdC5hdGxhc3NpYW4uY29tIn0.FLeD878VLmvkSwdrD2iBrQt0ulhhktnhC-goFmdMWGkzAxt8ZUjeO8qFfqydl5OF2T9hDSXE2fpTUsD6J9WfYYrQB9jNmtWPIIIp_YYo6uE-khPVJoTVjA3mWfIZsbpcVAqrf2vPDvWxzNp_eJLF8Yl4DoDpdiAWQ16rZe2ymshXTWV3cebVCdP7BzxOeuz7BfWEC0EN9Z43MfwU464fr8RF2MfivmKgUUSXS0tOuCkCjvU9D3BMx1smfQnvM_rYl3Ev5lidJB-1oexC3AEO0sjF58EO6fyhjSrW2uw-rn6hTDQTMEs0Kvrp2NmictuBXwhxxY510oqkWu_hIwkxBg`
        const projects = await jiraService.listProjects(apiToken)
        console.log(projects)
    } catch (err) { 
        console.log(err);
    }
}



module.exports = {
    createIntegration,
    handleJiraIntCallback,
    getJiraProjects,
}