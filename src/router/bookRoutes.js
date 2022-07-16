const router = require('express').Router();
const BookCtrl = require('../controller/bookController');
const {authenticateUser} = require('../middleware/authentication');

router
.get("/", authenticateUser, BookCtrl.getAllBooks)
.get("/:id", BookCtrl.getBook)
.post("/", BookCtrl.createBook)
.put("/:id", BookCtrl.updateBook)
.delete("/:id", BookCtrl.deleteBook);

module.exports = router;