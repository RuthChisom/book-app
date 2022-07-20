const User = require("../model/User");
const bcrypt = require("bcrypt");
const { createToken, decodeToken } = require("../services/jwtService");

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
                    let token = createToken(newUser);
                    if(!token){
                        return res.status(500).json({message: "Failed to sign token!"});
                    }
                    // send token to user
                    console.log(token)
                    return res.status(200).json({
                        message: "User Registration Successful",
                    })
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
        // create jwt token for user
        let token = createToken(foundUser);
        if(!token){
            console.error({err});
            return res.status(500).json({message: "Failed to sign token!"});
        }
        return res.status(200).json({
            message: "User Logged In Successfully",
            token
        })
    })
    
}