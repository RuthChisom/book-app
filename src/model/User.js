const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    userName: {type: String, required:true},
    password: {type: String, required:true},
},
{timestamps:true}
);

const userModel = model("users", userSchema);

module.exports = userModel;