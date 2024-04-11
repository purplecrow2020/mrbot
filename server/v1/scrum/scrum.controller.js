
// const Schedule =  require('../../../modules/schedule.schema');
const { ObjectId } = require('mongodb');


async function createSchedule(req, res){
    try {
        // const schedule = await Schedule(req.body);
        // const newSchedule = await schedule.save();

        const mongo = req.app.get('db');
        const newSchedule = await mongo.collection('schedules').insertOne(req.body);

        const insertedSchedule = await mongo.collection('schedules').findOne({ _id: newSchedule.insertedId });

        if(!newSchedule){
            res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to save schedule details to Database`
                },
                "data": null,
            })
        }else{
            res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `schedule successfully cerated to the Database`
                },
                "data": insertedSchedule,
            })
        }

    } catch (error) {
        res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};

async function getAllSchedules(req, res) {
    try {
        const mongo = req.app.get('db');
        const allSchedules = await mongo.collection('schedules').find().toArray();
        
        if (!allSchedules) {
            res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to get all schedules details`
                },
                "data": null,
            })
        } else {
            res.status(200).json({
                "meta": {
                    "success": true,
                    "message": ` get all schedules successfully`
                },
                "data": allSchedules,
            })
        }

    } catch (error) {
        res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};

async function updateSchedule(req, res) {
    try {
        const {scheduleId} = req.params;
        const scheduleDataToUpdate = req.body;

        const mongo = req.app.get('db');
        const updatedSchedule = await mongo.collection('schedules').updateOne(
            { _id: new ObjectId(scheduleId)}, 
            { $set: scheduleDataToUpdate },
            // { returnOriginal: false }
        );

        if (!updatedSchedule.modifiedCount) {
            res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to update schedule details to Database`
                },
                "data": null,
            })
        } else {
            res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `schedule successfully updated to the Database`
                },
                "data": updatedSchedule,
            })
        }

    } catch (error) {
        res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};

async function deleteSchedule(req, res) {
    try {
        const { scheduleId } = req.params;

        const mongo = req.app.get('db');
        const deletedSchedule = await mongo.collection('schedules').deleteOne({ _id: new ObjectId(scheduleId) });


        if (!deletedSchedule) {
            res.status(404).json({
                "meta": {
                    "success": false,
                    "message": `unable to delete schedule details from Database`
                },
                "data": null,
            })
        } else {
            res.status(200).json({
                "meta": {
                    "success": true,
                    "message": `schedule successfully delete from the Database`
                },
                "data": deletedSchedule,
            })
        }

    } catch (error) {
        res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};


async function getScheduleByScrumId(req, res) {
    try {
        const {scrumId} = req.params;
        const mongo = req.app.get('db');
        const selectedScrum = await mongo.collection('schedules').findOne({ _id: new ObjectId(scrumId) });

        if (!selectedScrum) {
            res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to get all schedules details`
                },
                "data": null,
            })
        } else {
            res.status(200).json({
                "meta": {
                    "success": true,
                    "message": ` get all schedules successfully`
                },
                "data": selectedScrum,
            })
        }

    } catch (error) {
        res.status(500).json({
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
    createSchedule,
    getAllSchedules,
    updateSchedule,
    deleteSchedule,
    getScheduleByScrumId
}