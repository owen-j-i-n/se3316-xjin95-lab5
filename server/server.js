const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const config = require("./src/config")
const path = require("path");

const port = 3000

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://books:books@ninghan.2r13x.mongodb.net/timetable?retryWrites=true&w=majority").then(() => {
    console.log('connection established')
}).catch((err) => {
    console.log(err);
});

//middle ware
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
app.use(cors({
    origin:"*",
    credentials: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    req.passport = passport // 为了在中间件中可以调用到 passport
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Credentials",true);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});



require('./src/common/passport-local')(passport);

// Route Section
require('./src/routes/authRouter')(app);
// app.use(express.static(path.join(__dirname,"views")));




app.listen(port, () => console.log(`Example app listening on port ${port}!`))