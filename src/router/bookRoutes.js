const router = require('express').Router();
const controller = require('../controller/bookController');

router
.get("/", controller.getAllBooks)
.get("/:id", controller.getBook)
.post("/", controller.createBook)
.put("/:id", controller.updateBook)
.delete("/:id", controller.deleteBook);

module.exports = router;