const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SECRET, expiry} = process.env;

// create a token
exports.createToken = (user) => {
    try{
        const payload = { //do not add sensitive info to the payload
            id: user._id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
        let token = jwt.sign(
            payload, 
            SECRET, 
            {expiresIn: expiry}
            );
        return token;
    }catch(err){
        console.error(err);
        return null;
    }
}

// decode a token
exports.decodeToken = (token) => {
    try{
        let decodedToken = jwt.verify(token, SECRET);
        return decodedToken;
    }catch(err){
        console.error(err);
        return null;
    }
}