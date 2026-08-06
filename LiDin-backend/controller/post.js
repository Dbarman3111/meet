const PostModel = require('../models/post');


exports.addPost= async (req, res) => {
    try {
        const { desc , imageLink } = req.body;
        const userId = req.user._id;

        const addPost = new PostModel({
            user: userId,
            desc, 
            imageLink
    });
      
    if(!addPost){
        return res.status(400).json({error:'Something went wrong'});
    }
    await addPost.save()
    return res.status(200).json({
        message: "Post Successfully",
        post: addPost
    })


    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
    }
}

exports.likeDislikePost = async(req, res) =>{
     try {

        let selfId = req.user._id;
        let { postId } = req.body;
        let post = await PostModel.findById(postId);


        if(!post){
            return res.status(400).json({error: 'post can not found'});
        }
        const index = post.likes.findIndex(id => id.equals(selfId));

        if(index !== -1){
            // User already liked the post, remove like
            post.likes.splice(index, 1);
        } else {
            // user has not liked the post, add like
            post.likes.push(selfId);
        }
         await post.save();
         res.status(200).json({message: index !== -1 ? 'Post unliked' : 'post liked', 
            likes: post.likes });
        
     } catch (error) {
         console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message });
     }

}

exports.getAllPosts = async (req, res)=>{
    try {
        const posts = await PostModel.find().sort({createdAt: -1}).populate("user", "-password");
        res.status(200).json({message: 'fetched data',
            posts: posts
        })


    } catch (error) {
         console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
}


exports.getPostById = async(req, res)=>{
    try {
        const {postId} = req.params;
        const post = await PostModel.findById(postId).populate("user", "-password");

        if(!post){
            return res.status(400).json({
                error: "No post found"
            });
        }

        return res.status(200).json({
            message: 'Fetched Data',
            post : post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
}


exports.getTop5Post = async(req, res)=>{
    try {
        const {userId} = req.params;
        
        const posts = await PostModel.find({user:userId}).sort({createdAt: -1}).populate("user", "-password").limit(5);
        return res.status(200).json({
            message:'Fetched Data',
            posts: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
}


exports.getAllPostForUser = async (req, res)=>{
   try {
      const {userId} = req.params;
        const posts = await PostModel.find({user:userId}).sort({createdAt: -1}).populate("user", "-password");
        return res.status(200).json({
            message:'Fetched Data',
            posts: posts
        });
   } catch (error) {
     console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   }
}