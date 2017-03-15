// widget model file

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our widget model
var WidgetSchema = new Schema({
    name : { 
        type : String,
        required : true, 
        default : '',
        unique : true,
        index : true
    },    
    description : { 
        type : String,
        default : ''
    },
    endpoint : {
        type : String,
        required : true
    },
    displayHome : {
        type : String , 
        default : 'FALSE',
        index : true,
        required : true
    },
    requestParam : {
        type : String,
        default : ""
    },
    graphType : { 
        type : String,
        required : true
    },
    datasetPath : { 
        type : [String] , 
        default : [] 
    },
    fieldPath : { 
        type : [String] , 
        default : [],
        required : true
    },
    value : {
        type : String,
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
    collection : "widget" 
});


// use module exports so it can be used my other files
module.exports = mongoose.model("Widget", WidgetSchema);