
// const Schedule =  require('../../../modules/schedule.schema');
const { ObjectId } = require('mongodb');


async function addTimerEvent(req, res) {
    try {
        const currentTime = new Date();
        const dataToAdd = {
            created_at: currentTime, 
            title: req.body.eventName,
            description: "",
            start_at: req.body.startAt,
            end_at: req.body.endAt,
            create_by: req.body.username,
            status: 'DONE',
            priority: 1,
            label: "now",
            comments: []
        } 

        const mongo = req.app.get('db');
        const newSchedule = await mongo.collection('calendar').insertOne(dataToAdd);

        const insertedTimer = await mongo.collection('calendar').findOne({ _id: newSchedule.insertedId });

        if (!newSchedule) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to save timer event details to Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Timer event successfully cerated to the Database`
                },
                "data": insertedTimer,
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

async function getAllTimerEvents(req, res) {
    try {
        const mongo = req.app.get('db');

        const timerEvents = await mongo.collection('calendar').find({}).sort({_id: -1}).toArray();

        if (!timerEvents) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to get timer events details from Database`
                },
                "data": null,
            })
        } else {
            return res.status(200).json({
                "meta": {
                    "success": true,
                    "message": `Get successfully Timer events from Database`
                },
                "data": timerEvents,
            })
        }

    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
    }
};

async function getTimerEventByEventId(req, res) {
    try {
        const {eventId} = req.params;
        const mongo = req.app.get('db');

        const timerEvent = await mongo.collection('calendar').find({_id: new ObjectId(eventId)});

        if (!timerEvent) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to get timer event details from Database`
                },
                "data": null,
            })
        } else {
            return res.status(200).json({
                "meta": {
                    "success": true,
                    "message": `Get successfully Timer event from Database`
                },
                "data": timerEvent,
            })
        }

    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
    }
};


module.exports = {
    addTimerEvent,
    getAllTimerEvents,
    getTimerEventByEventId
}