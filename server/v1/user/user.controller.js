const Token = require('../../../modules/token')
async function signup(req, res) {
    try {
        const {
            fullName,
            emailId,
            password,
        } = req.body;


        const config = req.app.get('config');
        const mongo = req.app.get('db')
        const user = await mongo.collection('users').findOne({
            emailId,
            password,
        });

        if (user) {
            return res.json({
                "meta": {
                    "success":"false",
                    "message": "user already exist, signin"
                },
                "data": null
            })
        }
        const newUser = await mongo.collection('users').insertOne({
            fullName,
            emailId,
            password,
        });


        const token = await Token.generateToken(
            {
                id: newUser.insertedId.toString(),
            },
            config.jwtSecret,
            { expiresIn: 60 * 60 }
        )

        return res.json({
            "meta": {
                "success":"true",
                "message": "sign up success"
            },
            "data": {
                "authToken": token
            }
        })

        
    } catch (err) {
        console.log(err);
    } 
}

async function signin(req, res) {
    try {
        const {
            emailId,
            password,
        } = req.body;

        const mongo = req.app.get('db')
        const config = req.app.get('config');
        const user = await mongo.collection('users').findOne({
            emailId,
            password,
        });

        if (!user) {
            return res.json({
                "meta": {
                    "success":"false",
                    "message": "incorrect credentials"
                },
                "data": null
            })
        }
       
        const {
            _id,
        } = user;

        const token = await Token.generateToken(
            {
                id: _id.toString(),
            },
            config.jwtSecret,
            { expiresIn: 60 * 60 }
        )

        return res.json({
            "meta": {
                "success":"true",
                "message": "sign up success"
            },
            "data": {
                "authToken": token
            }
        })


    } catch (err) {
        console.log(err);
    }

}


module.exports = {
    signup,
    signin,
}