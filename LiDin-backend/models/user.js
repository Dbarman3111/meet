const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    googleId:{
        type: String,
    },
    email:{
        type:String,
        require:true,
    },
     password:{
        type: String,
     },

     f_name:{
        type: String,
        default: ""
     },
     headline:{
        type: String,
        default: ""
     },

     curr_company:{
        type: String,
        default:""
     },
     curr_location:{
        type:String,
        default:""
     },

     profilePic:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNwLwKdCY6Nl7RnIe_i2mWSC303aRwMUuqMu97prwSml0LIh-6oNtBaAQ&s=10"
     },

     cover_pic :{
        type:String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/074/403/401/small/a-red-rose-covered-in-snow-is-shown-in-this-photo.jpg"
     },
      
     about:{
        type: String,
        default: ""
     },
     resume:{
        type: String,
        default: ""
     },
     skills:{
        type: [String],
        default: []
     },
     experience:[
        {
            designation:{
                type: String,
            },
            company_name:{
                type: String,

            },
            duration:{
                type: String,
            },
            location:{
                type: String,
            },

        }

     ],
     friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
     ],
     pending_friends: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
     }],
      job:{
        type: String,
        
     },

},{timestamps: true});

const userModel= mongoose.model('user', UserSchema);
module.exports = userModel;