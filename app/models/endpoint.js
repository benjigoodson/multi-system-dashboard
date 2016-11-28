// endpoint model file
'use strict'

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

// define our endpoint model
var EndpointSchema = new Schema({
    name : {
        type : String, 
        required: true, 
        unique: true
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
    requiresBody : {
        type : Boolean,
        default : false,
        required: true
    },
    body : {
        type : String,
        default : ''
    },
    description : {
        type : String,
        default : '',
        required: true
    },
    createdDate : { 
        type : String,
    },
    createdBy : { 
        type : String ,
        default : '' 
    }
},
{
    collection : "endpoint"
});


// use module exports so it can be used my other files
module.exports = mongoose.model("Endpoint", EndpointSchema);