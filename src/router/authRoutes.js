const router = require('express').Router();
const controller = require('../controller/authController');

router
.get("/", controller.getAllUsers)
.post("/signup", controller.registerNewUser) //auth/signup
.post("/login", controller.loginUser)
// .put("/:id", controller.updateBook)
// .delete("/:id", controller.deleteBook);

module.exports = router;