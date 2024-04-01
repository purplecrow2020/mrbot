const axios = require('axios');

function getJiraRedirectUri(clientId, redirectUri, state) {

    const scopes = getScopesNeededForJiraIntegration()
    const scopesNeeded = scopes.join("%20")
    return `https://auth.atlassian.com/authorize?` +
    `audience=api.atlassian.com&` +
    `client_id=${clientId}&` +
    `scope=${scopesNeeded}&` +
    `redirect_uri=${redirectUri}&` +
    `state=${state}&` +
    `response_type=code&` +
    `prompt=consent`
}

async function getAccessToken(clientId, clientSecret, code) {
    const response = await axios.post('https://auth.atlassian.com/oauth/token', {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:9000/v1/jira/callback',
    });
    return response.data;
}

function getScopesNeededForJiraIntegration() {
    return [
        "write:jira-work",
        "read:jira-work",
        "read:jira-user",
        "read:issue:jira",
       "manage:jira-project"
    ]
}

function extractInfoFromCode(code) {
    const [userId, integrationId] = code.split(":")
    return {
        userId,
        integrationId,
    }
}

async function listProjects(token) {
    const response = await axios.get('https://akshat-sandhaliya16.atlassian.net/rest/api/2/project/search', {
        headers: {
            'Authorization': `Basic ${token}`,
            'Accept': 'application/json'
        },
    })
    console.log("response", response)
}   

module.exports = {
    getJiraRedirectUri,
    getScopesNeededForJiraIntegration,
    getAccessToken,
    extractInfoFromCode,
    listProjects,
}