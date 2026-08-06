 
const NotificationModel = require('../models/notification')



exports.getNotification = async(req, res)=> {
    try {
        let ownId = req.user._id;
        let notification = await NotificationModel.find({receiver: ownId}).sort({createdAt: -1}).populate("sender receiver");
        
        return res.status(200).json({
            message: 'Notifications fetched Successfully',
            notifications: notification
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
}


exports.updateRead = async (req, res)=>{
    try {
       const {notification} = req.body;
       const notifocation = await NotificationModel.findByIdAndUpdate(notification, {isRead:true});
       if(!notification){
        return res.status(404).json({error: 'Notification not found'})

       }
       return res.status(200).json({
        message: " Read Notification Successfully"
       })

    } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Server error', message: error.message }); 
    }
}

exports.activeNotify = async(req, res)=>{
    try {
         let ownId = req.user._id;
         let notifications = await NotificationModel.find({receiver:ownId, isRead:false});

         return res.status(200).json({message: "Notification Number Fetched Successfully", 
            count: notifications.length
         })
    } catch (error) {
         console.error(error);
       res.status(500).json({ error: 'Server error', message: error.message }); 
    
    }
}