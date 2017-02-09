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
        enum : [
            "offline",
            "online"
        ],
        default : 'online' 
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
        type : String,
        required: true
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
    collection : "system" 
});

// use module exports so it can be used my other files
module.exports = mongoose.model("System", SystemSchema);