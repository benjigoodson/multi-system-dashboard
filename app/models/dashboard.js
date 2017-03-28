// dashboard model file
'use strict'

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our system model
var DashboardSchema = new Schema({
    name : { 
        type : String, 
        required: true, 
        unique: true,
        index : true
    },
    description : { 
        type : String,
        default : '' 
    },
    widgets : { 
        type : [String], 
        default : [] 
    },
    createdDate : { 
        type : String
    },
    createdBy : { 
        id : {
            type : Schema.ObjectId,
            required: true
        },
        forename : {
            type : String,
            required: true 
        }
    }
}, 
{ 
    collection : "dashboard" 
});

// use module exports so it can be used my other files
module.exports = mongoose.model("Dashboard", DashboardSchema);