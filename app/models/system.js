// system model file
'use strict'

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our system model
var SystemSchema = new Schema({
    name : { 
        type : String , 
        required: true, 
        unique: true,
        index : true
    },
    status : { 
        type : String ,
        enum : [
            "offline",
            "online"
        ],
        default : 'online',
        required : true
    },
    contact : { 
        type : String , 
        default : '',
        required : true 
    },
    description : { 
        type : String , 
        default : '' 
    },
    url : {
        type : String , 
        required : true
    },
    createdDate : { 
        type : String,
        required : true
    },
    createdBy : { 
        id : {
            type : Schema.ObjectId,
            required : true
        },
        forename : {
            type : String,
            required : true 
        }
    }
}, 
{ 
    collection : "system" 
});

// use module exports so it can be used my other files
module.exports = mongoose.model("System", SystemSchema);