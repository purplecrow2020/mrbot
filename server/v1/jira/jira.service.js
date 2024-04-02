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
        "read:issue-jira",
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


function getJiraInstanceUrlForProject(id) {
    return `https://api.atlassian.com/ex/jira/${id}/rest/api/3/project`;
}

async function getJiraInstanceDetails(token) {
    return axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
    })
}

async function listProjects(token) {
    const instanceDetails = await getJiraInstanceDetails(token).then((res) => res.data)
    console.log("instanceDetailsinstanceDetails", instanceDetails)
    const id = instanceDetails[0].id
    const url = getJiraInstanceUrlForProject(id)
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
    })

    const data = response.data.map(({
        key,
        name,
        avatarUrls,
        id,
    }) => {
        return {
            projectKey: key,
            projectLabel: name,
            avatars: avatarUrls,
            projectId: id,
        }
    })
    return data;
}   

module.exports = {
    getJiraRedirectUri,
    getScopesNeededForJiraIntegration,
    getAccessToken,
    extractInfoFromCode,
    listProjects,
}