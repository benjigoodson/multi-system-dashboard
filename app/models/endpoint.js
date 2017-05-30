// endpoint model file
'use strict'

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our endpoint model
var EndpointSchema = new Schema({
    name : {
        type : String, 
        required: true, 
        unique: true,
        index : true
    },
    parentSystem : {
        type : String, 
        required: true
    },
    url : {
        type : String,
        required: true
    },
    requestType : {
        type : String,
        required: true
    },
    description : {
        type : String,
        default : "",
        required: true
    },
    requiresParam : {
        type : Boolean,
        default : false
    },
    apiKey : {
        type: String,
        default : ""
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
    collection : "endpoint"
});


// use module exports so it can be used my other files
module.exports = mongoose.model("Endpoint", EndpointSchema);