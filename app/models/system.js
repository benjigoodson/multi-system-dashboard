// system model file
'use strict'

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

// define our system model
var SystemSchema = new Schema({
    name : { 
        type : String , 
        required: true, 
        unique: true
    },
    status : { 
        type : String , 
        default : '' 
    },
    contact : { 
        type : String , 
        default : '' 
    },
    description : { 
        type : String , 
        default : '' 
    },
    url : {
        type : String , 
        default : ''
    },
    createdDate : { 
        type : String
    },
    createdBy : { 
        type : String ,
        default : '' 
    }
}, 
{ 
    collection : "system" 
});

// use module exports so it can be used my other files
module.exports = mongoose.model("System", SystemSchema);