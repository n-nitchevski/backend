const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    user_name:{
        type : String
    },
    full_name:{
        type : String,
        required: true
    },
    email:{
        type : String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    password:{
        type : String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// console.log("----------Schema-----------");
// console.log(UserSchema);

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback) {
    console.log(email);
    const query = { email };
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10,(err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
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

module.exports.resetPassword = function(phone, password, callback) {
    bcrypt.genSalt(10,(err, salt)=> {
        bcrypt.hash(password, salt, (err, hash)=>{
            if(err) throw err;
            password = hash;
            User.findOneAndUpdate({ email : phone }, { $set : { password }}, callback);
        });
    });
}