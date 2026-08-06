const mongoose = require('mongoose');



const ConversationSchema = new mongoose.Schema({

    member :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
    ]

},{
    timestamps : true
})


const ConversationModel= mongoose.model('conversation', ConversationSchema);
module.exports = ConversationModel;