// user model file

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our user model
var UserSchema = new Schema({
    forename : { 
        type : String , 
        default : '' 
    },
    surname : { 
        type : String ,
        default : '' 
    },
    email : { 
        type : String , 
        required: true, 
        unique: true,
        default : '' 
    },
    password : { 
        type : String , 
        required: true,
        default : '' 
    },
    image : { 
        type : String ,
         default : 'default'
    }
}, 
{ 
    collection : "user" 
});


// use module exports so it can be used my other files
module.exports = mongoose.model("User", UserSchema);