const jwt = require('jsonwebtoken');  
const {SECRET} = process.env;
// require('dotenv').config();

exports.authenticateUser = (req, res, next) => { //next calls the next function after this function has executed
    // check if there is an authorization token
    if(!req.headers.authorization){
        return res.status(401).json({message: "Authorization Header required"});
    }
    let splittedHeader = req.headers.authorization.split(' ');
    if(splittedHeader[0] !== 'Bearer'){
        return res.status(401).json({message: "Ensure that the Authorization Format is Bearer <token>"});
    }
    let token = splittedHeader[1];
    // decode the token
    jwt.verify(token, SECRET, (err, decodedToken) =>{
        if(err){
            console.error({err});
            return res.status(500).json({message: 'Not Authorized'});
        }
        if(!decodedToken){
            return res.status(401).json({message: "Invalid Authorization Token"});
        }
        req.user = decodedToken; //to make user details available throughout the request lifecycle
        //if token is valid, allow the user to continue with request
        next();
    } )

    // return res.json({message: req.headers.authorization});
}

exports.checkIfAdmin = (req, res, next) => { //next calls the next function after this function has executed
    // check if there is an authorization token
    if(req.user.role!='admin'){
        return res.status(401).json({message: "This route is restricted to admin users"});
    }
    next();
}