const mongoose = require('mongoose');


const userschema = mongoose.Schema ({
    username: {
        type: String ,
        required : true,
        min :3,
        max: 20,
        unique: true
    },
    email: {
        type: String ,
        required : true,
        
        max: 50,
        unique: true
    },

password: {
        type: String ,
        required : true,
      
    },

    profilepic: {
        type: String ,
        default : ''
    },
    coverpic: {
        type: String ,
        default : ''
    },
    followers : {
      type: Array,
      default: []
    },
    city: {
        type:String,
        max:50
    },
    following  : {
        type: Array,
        default: []
      },
      isadmin :{
        type: Boolean,
        default : false
      },
      
        description: {
            type:String,
            max:50
        },
       
        from: {
            type:String,
            max:50
        },
        relashinship :{
         type:Number,
         enum :[1,2,3]
        }

      
}, {timestamps: true}
)


module.exports = mongoose.model('User', userschema)