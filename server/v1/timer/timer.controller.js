
// const Schedule =  require('../../../modules/schedule.schema');
const { ObjectId } = require('mongodb');


async function addTimer(req, res) {
    try {
        const currentTime = new Date(); 
        const newData = { ...req.body, createdAt: currentTime };

        const mongo = req.app.get('db');
        const newTimer = await mongo.collection('timer').insertOne(newData);

        const insertedTimer = await mongo.collection('timer').findOne({ _id: newTimer.insertedId });

        if (!newTimer) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to save timer details to Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Timer successfully cerated to the Database`
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
    }
};


async function updateTimer(req, res){
    try {
        const {status} = req.body;
        const { timerId } = req.params;

        const currentTime = new Date();
        let timerStatusKey;

        switch (status) {
            case 'START':
                console.log("status START", status);
                timerStatusKey = 'startedAt';
                break;
            case 'PAUSED':
                console.log("status PAUSED", status);
                timerStatusKey = 'pausedAt';
                break;
            case 'RESUMED':
                console.log("status RESUMED", status);
                timerStatusKey = 'resumedAt';
                break;
            case 'DONE':
                console.log("status DONE", status);
                timerStatusKey = 'doneAt';
                break;
            case 'STOPPED':
                console.log("status STOPPED", status);
                timerStatusKey = 'stoppedAt';
                break;
            default:
                console.log("status default", status);
                timerStatusKey = 'updateAt';
        }


        const newData = { ...req.body, [timerStatusKey]: currentTime };

        const mongo = req.app.get('db');

        const timer = await mongo.collection('timer').findOne({ _id: new ObjectId(timerId) });
        if (timer.status === status) {
            return res.status(300).json({
                "meta": {
                    "success": false,
                    "message": `can not be ${status.toLowerCase()} this timer`
                },
                "data": null,
            })
        }

        const updatedTimeStatus = await mongo.collection('timer').updateOne(
            { _id: new ObjectId(timerId) },
            { $set: newData },
            (err, result) => {
                console.log("err", err,)
                console.log("result", result);
            }
        );

        if (!updatedTimeStatus.modifiedCount) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to change timer status details to Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Timer status updated successfully to the Database`
                },
                "data": updatedTimeStatus,
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
}


async function pauseTimer(req, res) {
    try {
        const { timerId } = req.params;
        const currentTime = new Date();
        const newData = { ...req.body, pausedAt: currentTime };

        const mongo = req.app.get('db');

        const timer = await mongo.collection('timer').findOne({ _id: new ObjectId(timerId) });

        if(timer.status !== 'START'){
            return  res.status(300).json({
                "meta": {
                    "success": false,
                    "message": `can not be paused this timer`
                },
                "data": null,
            })
        }

       
        const updatedTimeStatus = await mongo.collection('timer').updateOne(
            { _id: new ObjectId(timerId) },
            { $set: newData },
            (err, result) => {
                console.log("err",err, ) 
                console.log("result", result);
           }
        );


        if (!updatedTimeStatus.modifiedCount) {
            return  res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to change timer status details to Database`
                },
                "data": null,
            })
        } else {
            return  res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Timer status updated successfully to the Database`
                },
                "data": updatedTimeStatus,
            })
        }

    } catch (error) {
        console.log("Error", error)
        return  res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
    }
};


async function resumeTimer(req, res) {
    try {
        const { timerId } = req.params;
        const currentTime = new Date();
        const newData = { ...req.body, resumeAt: currentTime };

        const mongo = req.app.get('db');

        const timer = await mongo.collection('timer').findOne({ _id: new ObjectId(timerId) });

        if (timer.status === 'START' ||  timer.status === 'DONE' ) {
            return res.status(300).json({
                "meta": {
                    "success": false,
                    "message": `can not be resume this timer`
                },
                "data": null,
            })
        }


        const updatedTimeStatus = await mongo.collection('timer').updateOne(
            { _id: new ObjectId(timerId) },
            { $set: newData },
            (err, result) => {
                console.log("err", err,)
                console.log("result", result);
            }
        );


        if (!updatedTimeStatus.modifiedCount) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to change timer status details to Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Timer status updated successfully to the Database`
                },
                "data": updatedTimeStatus,
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


async function doneTimer(req, res) {
    try {
        const { timerId } = req.params;
        const currentTime = new Date();
        const timeFromBody = req.body.timer;
        const newData = { ...req.body, status: "DONE",  doneAt: currentTime };

        const mongo = req.app.get('db');

        const timer = await mongo.collection('timer').findOne({ _id: new ObjectId(timerId) });

        if (timer.status === 'DONE' || (+timer.timer) > (+timeFromBody) ) {
            return res.status(300).json({
                "meta": {
                    "success": false,
                    "message": `can not be done this timer`
                },
                "data": null,
            })
        }

        if ((+timer.timer) == (+timeFromBody)){
            const updatedTimeStatus = await mongo.collection('timer').updateOne(
                { _id: new ObjectId(timerId) },
                { $set: newData },
                (err, result) => {
                    console.log("err", err,)
                    console.log("result", result);
                }
            );

            if (!updatedTimeStatus.modifiedCount) {
                return res.status(400).json({
                    "meta": {
                        "success": false,
                        "message": `unable to change timer status details to Database`
                    },
                    "data": null,
                })
            } else {
                return res.status(201).json({
                    "meta": {
                        "success": true,
                        "message": `Timer status updated successfully to the Database`
                    },
                    "data": updatedTimeStatus,
                })
            }
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


async function getAllTimers(req, res) {
    try {
        const mongo = req.app.get('db');
        const query = req.query;

        const filterQuery = {
            createdAt: {
                $gte: new Date(query.startDate),
                $lte: new Date(query.endDate),
            }
        };

        const PAGE_SIZE = +req.query.pageSize || 5; 
        const pageNumber = +req.query.pageNumber || 1;
        const skipCount = (pageNumber - 1) * PAGE_SIZE;

        const allTimers = await mongo.collection('timer')
            .find(filterQuery ? filterQuery : {})
            .sort({ _id: -1 })
            .skip(skipCount) 
            .limit(PAGE_SIZE) 
            .toArray();

        if (!allTimers) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `Unable to get all timers details from Database`
                },
                "data": null,
            })
        } else {
            return res.status(200).json({
                "meta": {
                    "success": true,
                    "message": `Get all timers successfully`
                },
                "data": allTimers,
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


async function getTimerByTimerId(req, res) {
    try {
        const { timerId } = req.params;
        const mongo = req.app.get('db');

        const timer = await mongo.collection('timer').findOne({ _id: new ObjectId(timerId) });

        if (!timer) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `Unable to get timer details from Database`
                },
                "data": null,
            })
        } else {
            return res.status(200).json({
                "meta": {
                    "success": true,
                    "message": `Get timer details successfully`
                },
                "data": timer,
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


async function deleteTimerByTimerId(req, res) {
    try {
        const { timerId } = req.params;
        const mongo = req.app.get('db');

        const deletedTimer = await mongo.collection('timer').deleteOne({ _id: new ObjectId(timerId) });

        if (!deletedTimer) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `Unable to delete timer details from Database`
                },
                "data": null,
            })
        } else {
            return res.status(200).json({
                "meta": {
                    "success": true,
                    "message": `deleted timer details successfully`
                },
                "data": deletedTimer,
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
    addTimer,
    updateTimer,

    pauseTimer,
    resumeTimer,
    doneTimer,

    getAllTimers,
    getTimerByTimerId,
    deleteTimerByTimerId
}