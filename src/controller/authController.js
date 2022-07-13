const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SECRET} = process.env;
const expiry = 3600; //secs

// test - create a token
exports.createToken = (req, res) => {
                    // create jwt token for user
                    const payload = { //do not add sensitive info to the payload
                        id: req.body.id,
                        userName: req.body.userName
                    };
                    jwt.sign(
                        payload, 
                        SECRET, 
                        {expiresIn: expiry},
                        (err,token) => {
                            if(err){
                                return res.status(500).json({err});
                            }
                            // send token to user
                            return res.status(200).json({
                                message: "Token Created Successfully",
                                token,
                                id: req.body.id,
                                userName: req.body.userName
                            })
                        }
                        );
      
}

// test - decode a token
exports.decodeToken = (req, res) => {
    console.log(req.headers);
    // pick authorization header
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(403).json({message: 'Authentication Token is required'});
    }
    // extract token
    const splittedStr = authHeader.split(' ');
    const token = splittedStr[1];
    console.log(token);
    // decode token
    jwt.verify(token, 
        SECRET,
        (err, decodedToken) => {
            if(err){
                return res.status(500).json({err});
            }
            return res.status(200).json({user: decodedToken});
        }
        )
}

// register a user
exports.registerNewUser = (req, res) => {
    // try{
        let userObj = req.body; // get user details from request body
        // check if a user with this username exists
        User.findOne({userName: userObj.userName}, (err, existingUser) => {
            if(err){
                return res.status(500).json({err});
            }
            if(existingUser){
                return res.status(400).json({message: "A user with this username already exists!!"});
            }
        })
         // create a new user
        let created = User.create(userObj, (err, newUser) => {
            if(err){
                return res.status(500).json({err});
            }
            // hash user's password
            bcrypt.genSalt(10, (err, salt) =>{
                if(err){
                    return res.status(500).json({err});
                }
                bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                    if(err){
                        return res.status(500).json({err});
                    }
                    // save password to db
                    newUser.password = hashedPassword;
                    newUser.save((err, savedUser) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                    })
                    // create jwt token for user
                    const payload = { //do not add sensitive info to the payload
                        id: newUser._id,
                        userName: newUser.userName,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,

                    };
                    jwt.sign(
                        payload, 
                        SECRET, 
                        {expiresIn: expiry},
                        (err,token) => {
                            if(err){
                                return res.status(500).json({err});
                            }
                            // send token to user
                            return res.status(200).json({
                                message: "User Registration Successful",
                                token: token
                            })
                        }
                        );
                })
            })
        });
        
      
}

// get all users
exports.getAllUsers = async(req, res) => {
    try{
        let listed = await User.find();
        if(listed.length === 0){
            return res.status(404).json({
                success: false,
                message: "No User was found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Users Found!",
            users: listed
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        })
    }
}