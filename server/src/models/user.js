const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    role: String,
    state:String,
    email:String,
    from:String
}, {
    timestamps: true
});

var User = mongoose.model("user",userSchema);


module.exports = User;