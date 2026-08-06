const ConversationModel = require('../models/conversation')
const MessageModel = require('../models/message')





exports.addConversation = async(req, res)=>{
    try {
        let senderId =req.user._id;
        let { receiverId , message} = req.body;
        let isConvExist = await ConversationModel.findOne({
            member:{$all : [senderId, receiverId]}
        });
        if(!isConvExist){

            let newConversation = new ConversationModel({
                member:[senderId, receiverId]
            })
            await newConversation.save();
            let addMessage = new MessageModel({sender: req.user._id, conversation:newConversation._id, message});
            await addMessage.save();
        }else{
            let addMessage =  new MessageModel({sender: req.user._id, conversation:isConvExist._id, message});
            await addMessage.save();
        }

         return res.status(200).json({
            message: 'Message Sent'
         })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message }); 
    
    }
}




exports.getConversation = async(req, res)=>{
    try {
        let loggedinId =req.user._id;
        let conversation = await ConversationModel.find({
            member: {$in: [loggedinId]}
        }).sort({createdAt : -1}).populate('member', '-password');
        
        return res.status(200).json({
            message: 'Fetched Successfully',
            conversations: conversation
        })
        
    } catch (error) {
         console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message }); 
    
    }
}