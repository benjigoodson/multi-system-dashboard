// user model file

// require the mongoose module
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

// define our user model
var UserSchema = new Schema({
    forename : { 
        type : String , 
        default : '',
        index : true,
        required: true
    },
    surname : { 
        type : String ,
        default : '',
        required: true
    },
    email : { 
        type : String , 
        required: true, 
        unique: true,
        index : true,
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
    },
    location : { 
        type : String ,
        default : '' 
    },
    company : { 
        type : String ,
        default : '' 
    },
    website : { 
        type : String ,
        default : '' 
    },
    resetPasswordToken : { 
        type : String,
        default : '' 
    },
    resetPasswordExpires : {
        type : Date
    }
}, 
{ 
    collection : "user" 
});


// use module exports so it can be used my other files
module.exports = mongoose.model("User", UserSchema);