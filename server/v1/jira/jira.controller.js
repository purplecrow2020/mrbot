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

        console.log("_____", _id, name)

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

async function updateIntegration(req, res) {
    try {
        const {
            name,
            integrationId
        } = req.body;

        const {
            _id,
        } = req.user;

        console.log("_____", _id, req.body)

        const mongo = req.app.get('db')

        const filter = { _id: new ObjectId(integrationId) };
        const update = { $set: { name: name, success: "success" } };

        const newIntegration = await mongo.collection('jiraintegrations').findOneAndUpdate(filter, update, { new: true } )

        console.log("newIntegration+++++++", newIntegration)
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

async function deleteIntegrationBySelectedIntegrationId(req, res){
    try {
        const {
            integrationId,
        } = req.params;

        const mongo = req.app.get('db')
        const deletedIntegration = await mongo.collection('jiraintegrations').deleteOne({
            _id: new ObjectId(integrationId),
        })
        return res.json({
            "meta": {
                "status": 204,
                "success": true,
                "message" : "Integration deleted successfully"
            },
            "data": null,
        })
    } catch (err) {
        return res.json({
            "status": 404,
            "meta": {
                "success": false,
                "error": ""
            },
        })
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

async function updateJiraProjectByProjectId(req, res){
    try {
        // const { projectId } = req.params;
        const { integrationId, projectId } = req.query;
        const dataToUpdate = req.body;

        console.log(projectId, integrationId, dataToUpdate)

        const mongo = req.app.get('db')
        const jiraintegration = await mongo.collection('jiraintegrations').findOne({
            _id: new ObjectId(integrationId),
        })

        const apiToken = jiraintegration.token.access_token;
        const updatedProjects = await jiraService.selectedProjectToUpdate(apiToken, projectId, dataToUpdate)
        console.log("updatedProjects", updatedProjects)

        return res.json({
            "meta": {
                "success": true,
            },
            "data": {
                updatedProjects,
            },
        })
        // get the access toke of integration id
        // go to jira service 
        // find the project based on integration id and project id
        // update the project details

    } catch (error) {
        console.log("error-------", error)
    }
}

async function getAllIssuesOfSelectedProject(req, res){
    try {
        const projectId = req.params.projectId;
        let dummyData = {};
        if (projectId){
            dummyIssuesData = {
                "projectId": "10000",
                "projectKey": "TA",
                "issues": [
                    {
                        "issueId" : 'iss01',
                        "title": "form validation testing 1",
                        "ticketNumber": "ABC121",
                        "commentCount": "1",
                        "assignedUser": "airKing05",
                        "status": "not-done"
                    },
                    {
                        "issueId": 'iss02',
                        "title": "form validation testing 2",
                        "ticketNumber": "ABC122",
                        "commentCount": "2",
                        "assignedUser": "gyanTherapy",
                        "status": "done"
                    },
                    {
                        "issueId": 'iss03',
                        "title": "form validation testing 3",
                        "ticketNumber": "ABC123",
                        "commentCount": "3",
                        "assignedUser": "tg",
                        "status": "in-progress"
                    },
                    {
                        "issueId": 'iss04',
                        "title": "form validation testing 4",
                        "ticketNumber": "ABC124",
                        "commentCount": "4",
                        "assignedUser": "burner",
                        "status": "in-progress"
                    },
                    {
                        "issueId": 'iss05',
                        "title": "form validation testing 5",
                        "ticketNumber": "ABC125",
                        "commentCount": "5",
                        "assignedUser": "mao",
                        "status": "not-done"
                    },

                ]
            }

            return res.json({
                "meta": {
                    "success": true,
                },
                "data": {
                    ...dummyIssuesData,
                },
            })
        }else{
            return res.json({
                "meta": {
                    "success": false,
                },
                "data": {
                    dummyData,
                },
            }) 
        }
        
    } catch (err) {
        console.log(err);
    }
}

async function getDetailsOfSelectedIssuesOfSelectedProject(req, res){
    try {
        const {projectId, issueId} = req.params;
        let dummyIssueData = {};
        if (issueId) {
            dummyIssueData = {
                "title": "form validation testing 1",
                "ticketNumber": "ABC121",
                "commentCount": "1",
                "assignedUser": "airKing05",
                "status": "not-done",
                "tags" : ["Not attempted", "Watched"],
                "assignedAt" : "15PM, 01 APRIL 2024",
                "description": "includes and Set.has() both used for searching for a specific value within an array or set.",
                "comments": [
                    {
                        "comment": "this is the first comment for this issue",
                        "user": "blueSky",
                        "commentedAt": "20PM, 01 APRIL 2024",
                        "assignedUser": "airKing05",
                    },
                    {
                        "comment": "this is the first comment for this issue",
                        "user": "prakashRaj",
                        "commentedAt": "10AM, 02 APRIL 2024",
                        "assignedUser": "airKing05",
                    },
                    {
                        "comment": "this is the first comment for this issue",
                        "user": "airKing05",
                        "commentedAt": "13PM, 02 APRIL 2024",
                        "assignedUser": "airKing05",
                    },
                ]
            }
            return res.json({
                "meta": {
                    "success": true,
                },
                "data": {
                    ...dummyIssueData,
                },
            })
        } else {
            return res.json({
                "meta": {
                    "success": false,
                },
                "data": {
                    dummyIssueData,
                },
            })
        }

    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    createIntegration,
    handleJiraIntCallback,
    getJiraProjects,
    getAllIntegrations,
    getAllIssuesOfSelectedProject,
    getDetailsOfSelectedIssuesOfSelectedProject,
    deleteIntegrationBySelectedIntegrationId,
    updateJiraProjectByProjectId,
    updateIntegration
}