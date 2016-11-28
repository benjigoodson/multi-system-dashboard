// dashboard model file

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our user model
var DashboardSchema = new Schema({
    id : { type : String , default : '' },
    name : { type : String , default : '' },
    createdDate : { type : String , default : '' },
    status : { type : String , default : '' },
    contact : { type : String , default : '' }
}, { collection : "dashboard" } );


// use module exports so it can be used my other files
module.exports = mongoose.model("Dashboard", DashboardSchema);