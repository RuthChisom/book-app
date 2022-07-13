const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    title: {type: String, required:true},
    author: {type: String, required:true},
    genre: {type: String, required:true},
    cost: {type: Number, default:null},
},
{timestamps:true}
);

const bookModel = model("books", bookSchema);

module.exports = bookModel;