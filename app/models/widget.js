// widget model file

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our widget model
var WidgetSchema = new Schema({
    name : { 
        type : String,
        required : true, 
        default : '' 
    },    
    description : { 
        type : String,
        default : ''
    },
    endpoint : {
        type : String,
        required : true
    },
    authToken : { 
        type : String, 
        default : '' 
    },
    displayHome : {
        type : String , 
        default : 'FALSE',
        required : true
    },
    method : {
        type : String , 
        default : 'GET',
        required : true
    },
    apiURL : {
        type : String ,
        required : true
    },
    body : { 
        type : String , 
        default : '' 
    },
    graphType : { 
        type : String,
        required : true
    },
    field : { 
        type : String
    },
    createdDate : {
        type : String
    },
    createdBy : {
        type : String
    }
},
{ 
    collection : "widget" 
});


// use module exports so it can be used my other files
module.exports = mongoose.model("Widget", WidgetSchema);