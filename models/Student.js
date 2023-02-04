const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    middleName:{
        type:String,
        // required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    className:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    rollNumber:{
        type:String,
        required:true
    },
    addressLine1:{
        type:String,
        required:true
     },
     addressLine2:{
        type:String,
        required:true
     },
     landMark:{
        type:String,
        required:true
     },
     city:{
        type:String,
        required:true
     },
     pincode:{
        type:String,
        required:true
     },
    
    date:{
        type:Date,
        default:Date.now
    },
    image:{
        public_id:{
            type:String,
            // require:true
        },
        url:{
            type:String,
            // require:true
        }
    },
    role:{
        type:String,
        default:"student"
    }

})

module.exports = mongoose.model('student',StudentSchema);