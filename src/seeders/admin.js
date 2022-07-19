const User = require("../model/User");
const bcrypt = require("bcrypt");
require('dotenv').config();
const {genPass} = process.env;

exports.seedAdmin = () => {
    // check if there is an admin account
    // User.findOne({role: "admin"}, (err, admin) => {
    //     if(err) throw err;
    //     if(admin) return "Admin account already exists";
    //     // if there is no admin account, create one
    //     User.create({
    //         firstName: "Nathaniel",
    //         lastName: "Obidike",
    //         userName: "nathobi",
    //         role: "admin"
    //     }, (err, newUser) => {{
    //         if(err) throw err;
    //         // hash password
    //         // bcrypt.genSalt(10, (err, salt) => {
    //         //     if(err) throw err;
    //         //     bcrypt.hash(genPass, salt, (err, hash) => {
    //         //         if(err) throw err;
    //         //         newUser.password = hash;
    //         //         newUser.save((err, savedUser) => {
    //         //             if(err) throw err;
    //         //             return "Admin account created";
    //         //         })
    //         //     })
    //         // })
    //     }}
    //     )
    // })

}