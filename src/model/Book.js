const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    title: {type: String, required:true, minlength: 3},
    author: {type: String, required:true},
    genre: {type: String, enum: ["comic","fiction","romance"], required:true},
    cost: {type: Number, default: 0},
    purchasedCount: Number,
},
{timestamps:true}
);

const bookModel = model("books", bookSchema); //books is the name of the database collecton

module.exports = bookModel;