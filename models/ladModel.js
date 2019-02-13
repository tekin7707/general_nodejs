var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ladModel = new Schema({
    userId:String,
    name: String,
    caption: String,
    startDate:Date,
    endDate:Date,
    ladValue:Number,
    oneLadMin:Number,
    oneLadMax:Number,
    // items : [{type:mongoose.Schema.Types.ObjectId, ref:'ladesItem'}], 
    state:Number
});

module.exports = mongoose.model('Lad',ladModel);