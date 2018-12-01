
require('babel-register')({
    presets: ['env']
})

const express=require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

// MongoDb connection
const mongo = require('./config/mongo');

const app = express();

const users = require('./routes/users');

const admins = require('./routes/admins');

const item = require('./routes/item');

//Port Number
const port = 3000;

//Cors Middleware
app.use(cors());

//Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/user', users);

app.use('/admin', admins);

app.use('/item', item);

//Index Route
app.get('/', (req, res)=>{
    res.send('Invalid Endpoint');
})

//Start Server
app.listen(port, ()=>{
    console.log('Server started on port ' + port);
});

