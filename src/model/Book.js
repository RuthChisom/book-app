const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    // _id: {type: Number,required:true},
    title: {type: String, required:true},
    description: {type: String, required:true, maxlength: 500},
    isDone: {type: Boolean, default:false},
    isUrgent: {type: Boolean, default:false},
    cost: {type: Number, default:null},
},
{timestamps:true}
);

const bookModel = model("books", bookSchema);

module.exports = bookModel;