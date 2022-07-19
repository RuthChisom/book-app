const User = require("../model/User");
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
                                console.err(err);
                                return res.status(500).json({message: "Failed to sign token!"});
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
                console.error(err);
                return res.status(500).json({message: "Failed to verify token"});
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
                console.error(err);
                return res.status(500).json({message: "An error occured! Please try again later!"});
            }
            if(existingUser){
                return res.status(400).json({message: "A user with this username already exists!!"});
            }
        })
         // create a new user
        let created = User.create(userObj, (err, newUser) => {
            if(err){
                console.error(err);
                return res.status(500).json({message: "An error occured! Please try again later!"}); //returns error once username is repeated even after correcting it
            }
            // hash user's password
            bcrypt.genSalt(10, (err, salt) =>{
                if(err){
                    console.error(err);
                    return res.status(500).json({message: "Failed to salt password!"});
                }
                bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                    if(err){
                        console.error({err});
                        return res.status(500).json({message: "Failed to hash password!"});
                    }
                    // save password to db
                    newUser.password = hashedPassword;
                    newUser.save((err, savedUser) => {
                        if(err){
                            console.error({err});
                            return res.status(500).json({message: "Failed to save user password!"});
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
                                console.error({err});
                                return res.status(500).json({message: "Failed to sign token!"});
                            }
                            // send token to user
                            console.log(token)
                            return res.status(200).json({
                                message: "User Registration Successful",
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
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

exports.loginUser = (req, res) =>{
    // check if user exists
    User.findOne({userName: req.body.userName}, (err, foundUser) => {
        if(err){
            console.error({err});
            return res.status(500).json({message: "Failed to sign token!"});
        }
        if(!foundUser){
            return res.status(401).json({message: "Username Not Found!!"})
        }
        // check if password is correct - we cannot compare the password with equals because it is hashed
        let match = bcrypt.compareSync(req.body.password, foundUser.password);
        if(!match){
            return res.status(401).json({message: "Incorrect Password"})
        }
        // create token and send to user
        jwt.sign(
            { 
                id: foundUser.id,
                userName: foundUser.userName,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                role: foundUser.role,
            },
            SECRET, 
            {expiresIn: expiry},
            (err, token) => {
                if(err){
                    console.error({err});
                    return res.status(500).json({message: "Failed to sign token!"});
                }
                return res.status(200).json({
                    message: "User Logged In Successfully",
                    token
                })
            }
        )
    })
    
}