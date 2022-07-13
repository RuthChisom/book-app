const express = require('express');
const {json} = require('express');
const connectDB = require('./config/database');
const bookRoute = require('./router/bookRoutes');
const authRoute = require('./router/authRoutes');

//you can put in the uri if you don't want to use the default
connectDB();

const app = express();
app.use(json());
app.use('/book', bookRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Book Store App")
})

app.listen(PORT, () => console.log(`Serving on port ${PORT}`));