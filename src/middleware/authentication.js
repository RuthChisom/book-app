const { decodeToken } = require("../services/jwtService");

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
    let decodedToken = decodeToken(token); 
    if(!decodedToken){
        return res.status(500).json({message: 'Not Authorized'});
    }
    req.user = decodedToken; //to make user details available throughout the request lifecycle
    //if token is valid, allow the user to continue with request
    next();
}

exports.checkIfAdmin = (req, res, next) => { //next calls the next function after this function has executed
    // check if there is an authorization token
    if(req.user.role!='admin'){
        return res.status(401).json({message: "This route is restricted to admin users"});
    }
    next();
}