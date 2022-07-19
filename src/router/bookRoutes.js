const router = require('express').Router();
const BookCtrl = require('../controller/bookController');
const {authenticateUser, checkIfAdmin} = require('../middleware/authentication');

router
.get("/", authenticateUser, BookCtrl.getAllBooks)
.get("/:id", authenticateUser, BookCtrl.getBook)
.post("/", authenticateUser, checkIfAdmin, BookCtrl.createBook)
.put("/:id", authenticateUser, BookCtrl.updateBook)
.delete("/:id", authenticateUser, checkIfAdmin,BookCtrl.deleteBook);

module.exports = router;