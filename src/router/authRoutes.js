const router = require('express').Router();
const controller = require('../controller/authController');

router
.get("/", controller.getAllUsers)
.post("/signup", controller.registerNewUser) //auth/signup
.post("/login", controller.loginUser) 
.post("/create-token", controller.createToken) 
.post("/decode-token", controller.decodeToken) 
// .put("/:id", controller.updateBook)
// .delete("/:id", controller.deleteBook);

module.exports = router;