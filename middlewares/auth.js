const _ = require('lodash');
const Token = require('../modules/token');
const {
    ObjectId,
} = require('mongodb')
async function authenticate(req, res, next) {
    try {
        const mongo = req.app.get('db')
        const config = req.app.get('config')
        const {
            authorization,
        } = req.headers

        const payload = Token.verify(authorization, config.jwtSecret);
        const { id } = payload;
        const userDetails = await mongo.collection('users').findOne({
            "_id": new ObjectId(id),
        });
        if (!_.isEmpty(userDetails)) {
            if (userDetails) {
                req.user = userDetails;
                return next();
            }
        } else {
            const responseData = {
                meta: {
                    code: 401,
                    success: false,
                    message: 'INVALID API KEY',
                },
                data: null,
            };
            return res.status(responseData.meta.code).json(responseData);
        }
    } catch (e) {
        const responseData = {
            meta: {
                code: 401,
                success: false,
                message: e.message,
            },
            data: null,
        };
        return res.status(responseData.meta.code).json(responseData);
    }
}

module.exports = {
    authenticate,
};