var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var userModel = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    token:String,
    status:Number,//{(-1) Deleted user (0)-non activated new (1)-activated 2,3,4,5 statu 9- (10) Administrator }
    activateCode:String
});

module.exports = mongoose.model('User',userModel);