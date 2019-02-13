var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ladItemModel = new Schema({
    masterId:String,
    name: String,
    caption: String,
    rate : Number,
    state:Number
});
module.exports = mongoose.model('LadItem',ladItemModel);

