const { model } = require("mongoose");
const Book = require("../model/Book")

// get all books
exports.getAllBooks = async(req, res) => {
    try{
        let listed = await Book.find();
        if(listed.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Book was found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Books Found!",
            books: listed
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        })
    }
}

// get single book
exports.getBook = async(req, res) => {
    try{
        let id = {_id: req.params.id};
        let found = await Book.findOne(id);
        if(!found){
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }
        res.status(200).json({
            success: true,
            id:id,
            message: "Book Found!",
            book: found
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        })
    }
}

// create a book
exports.createBook = async(req, res) => {
    try{
        let bookObj = await req.body;
        let created = await Book.create(bookObj);
        if(!created){
            return res.status(404).json({
                success: false,
                message: "Book Creation Failed"
            });
        }
        res.status(201).json({
            success: true,
            message: "Book Created Successfully!",
            book: created
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        })
    }
}

// update a book
exports.updateBook = async(req, res) => {
    try{
        let id = {_id: req.params.id};
        let bookObj = req.body;
        let updated = await Book.findOneAndUpdate(id, bookObj ,{new: true});
        if(!updated){
            return res.status(404).json({
                success: false,
                message: "Book not Updated"
            });
        }
        res.status(200).json({
            success: true,
            message: "Book Updated!",
            book: updated
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        })
    }
}

// delete book
exports.deleteBook = async(req, res) => {
    try{
        let id = {_id: req.params.id};
        let deleted = await Book.findOneAndRemove(id);
        if(!deleted){
            return res.status(404).json({
                success: false,
                message: "Book not Deleted"
            });
        }
        res.status(200).json({
            success: true,
            message: "Book Successfully Deleted!",
            book: deleted
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        })
    }
}