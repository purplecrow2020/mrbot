
// const Schedule =  require('../../../modules/schedule.schema');
const { ObjectId } = require('mongodb');


async function searchAutoCompleteSubject(req, res) {
    try {
        const queryString = req.query;
        const mongo = req.app.get('db');

        if (!queryString.subject) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to filter the subjects details from Database`
                },
                "data": [],
            })
        } 

        const filterQuery = {
            subject: {
                $regex: queryString.subject,
                // $options: 'i'
            }
        };

        const filteredSubjects = await mongo.collection('message').find(filterQuery).toArray();
        if (filteredSubjects){
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Subjects successfully filtered from the Database`
                },
                "data": filteredSubjects,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};

async function addMessage(req, res) {
    try {
        const mongo = req.app.get('db');
        const createdAt = new Date();
        const dataToAdd = {
           ...req.body, 
           createdAt
        } 

        const newMessage = await mongo.collection('message').insertOne(dataToAdd);

        const insertedMessage = await mongo.collection('message').findOne({ _id: newMessage.insertedId });

        if (!newMessage) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to save new message details to Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Message successfully cerated to the Database`
                },
                "data": insertedMessage,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};



module.exports = {
    searchAutoCompleteSubject,
    addMessage,
}