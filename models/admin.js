const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Admin Schema
const AdminSchema = mongoose.Schema({
    name: {
        type : String
    },
    email: {
        type : String,
        required: true
    },
    username: {
        type : String,
        required: true
    },
    password: {
        type : String,
        required: true
    },
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.getUserById = function(id, callback){
    
    Admin.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    console.log(username)
    const query = {username : username};
    Admin.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10,(err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    console.log(candidatePassword);
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

