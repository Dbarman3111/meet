const CommentModel = require('../models/comment')
const PostModel = require('../models/post')
const NotificationModel = require('../models/notification')



exports.commentPost = async (req, res)=>{
    try {
        const {postId, comment} = req.body;
        const userId = req.user._id;

        const postExist = await PostModel.findById(postId).populate("user");

        if(!postExist){
          return res.status(400).json({
            error: 'No such post Found'
          })  ;

        }
        postExist.comments = postExist.comments + 1;
        await postExist.save();


        const newComment = new CommentModel({user: userId, post:postId, comment });
        await newComment.save();
        
        const populatedComment = await CommentModel.findById(newComment._id).populate('user', 'f_name headline profilePic');


        const content = ` ${req.user.f_name} has commented on your Post`;
        const notification = new NotificationModel({sender:userId, receiver:postExist.user._id, content, type:'comment', postId: postId.toString()})
        await notification.save();
        return res.status(200).json({
            message: "Commented successfully",
            comment: populatedComment
        })

    } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error', message: error.message }); 
    }

}

exports.getCommentByPostId = async(req, res)=>{
    try {
        const {postId} = req.params;
        const isPostExist = await PostModel.findById(postId);

        if(!isPostExist){
            return  res.status(400).json({error: 'No such post found'});
        }

         const comments = await CommentModel.find({post: postId}).sort({createdAt: -1}).populate('user', 'f_name headline profilePic');
         
         return res.status(201).json({
            message: "Comments Fetched",
            comments: comments
         })

    } catch (error) {
         console.error(error);
          res.status(500).json({ error: 'Server error', message: error.message }); 
    }
}