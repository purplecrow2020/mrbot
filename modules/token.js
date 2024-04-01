const jwt = require('jsonwebtoken');

function generateToken(payload, privateKey, expiry) {
    return jwt.sign(payload, privateKey, expiry);
}

function verify(token, privateKey) {
    return jwt.verify(token, privateKey);
}

module.exports = {
    generateToken,
    verify,
}