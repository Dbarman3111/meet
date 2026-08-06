const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const NotificationModel = require('../models/notification');








const cookieOptions ={
  httpOnly : true,
  secure: false,  //set to true is prodiction
  sameSite: 'Lax' // set none  in production
}


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.loginThroughGmail = async (req, res) => {
  try {
    const { token } = req.body ;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    let payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let userExist = await User.findOne({ email });
    if (!userExist) {
      // Register new User
      userExist = await User.create({
        googleId: sub,
        email,
        f_name: name,
        profilePic: picture
      });
    }

    const jwtToken = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '1d' }
    );
     
    res.cookie('token', jwtToken, cookieOptions)

    return res.status(200).json({ user: userExist, token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};


exports.register = async (req, res) => {
  try {
    const { email, password, f_name } = req.body;

    if (!email || !password || !f_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'email, password, and f_name are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Already have an account. please try another'
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log(hashedPassword)

    const newUser = new User({ email, password:hashedPassword, f_name });
    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      success: true,
      data: newUser
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Server error',
      message: err.message
    });

  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'email and password are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        error: 'Invalid your email'
      });
    }

    const passwordMatches = await bcryptjs.compare(password, existingUser.password);
    if (!passwordMatches) {
      return res.status(400).json({
        error: 'Invalid your possword'
      });
    }

    const jwtToken = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '7d' }

    );
    res.cookie('token', jwtToken, cookieOptions)

    return res.json({
      message: 'Logged in successfully',
      success: true,
      user: existingUser,
      token: jwtToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};


exports.updateUser = async(req, res) =>{
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ error: 'No user data provided' });
    }
    const isExist = await User.findById(req.user._id);
    if(!isExist) {
      return res.status(400).json({error: 'User does not exist'})
    }
    console.log(req.user._id);
    console.log(user);

    const updateData = { ...user };
    delete updateData._id;
    delete updateData.password;
    delete updateData.googleId;

    await User.findByIdAndUpdate(isExist._id, updateData, { returnDocument:'after'});

    const userData = await User.findById(req.user._id);
    res.status(200).json({
      message: "User updated Successfully",
      user: userData
    });



  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
}



exports.getProfileById = async(req , res) => {
   try {
    const {id} = req.params;

    console.log("id=" , id)
   
    const isExist = await User.findById(id);

    if(!isExist){
      return res.status(400).json({error : 'No Such User Exist'});
    }
    return res.status(200).json({
      message: "User fetch Successfully",
      user: isExist
    });


   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   }
}


exports.logout = async (req , res)=>{
   res.clearCookie('token', cookieOptions).json({message: 'logged out Successfully'});
}




exports.findUser = async (req, res)=>{
  try {
       let{query} = req.query;
       const users = await User.find({
        $and:[
          {_id : {$ne:req.user._id}},
          {
            $or:[
              { f_name: {$regex: new RegExp(`^${query}`, 'i')}},
              {email : {$regex: new RegExp(`^${query}`, 'i')}}
            ]
          }
        ]
       })

       return res.status(200).json({
        message: "Fetched Member",
        users: users
       })
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   
  }
}


exports.sendFriendRequest = async (req, res)=>{
  try {
      const { receiver } = req.body;
      const receiverId = receiver?.toString();

      if (!receiverId) {
        return res.status(400).json({ error: 'Receiver id is required' });
      }

      if (receiverId === req.user._id.toString()) {
        return res.status(400).json({ error: 'You cannot send a request to yourself' });
      }

      const userExist = await User.findById(receiverId);
      if(!userExist){
        return res.status(400).json({ error: 'No such user details' });
      }

      const alreadyFriend = req.user.friends?.some(id => id.toString() === receiverId);
      if (alreadyFriend) {
        return res.status(400).json({ error: 'Already friend' });
      }

      const alreadyPending = userExist.pending_friends?.some(id => id.toString() === req.user._id.toString());
      if (alreadyPending) {
        return res.status(400).json({ error: 'Request already sent' });
      }

      userExist.pending_friends.push(req.user._id);
      let content = `${req.user.f_name} has send you friend request`;
      const notification = new NotificationModel({sender: req.user._id, receiver: receiverId, content, type: 'friendRequest'});
      await notification.save();
      await userExist.save();

      res.status(200).json({
        message:"Friend Request sent"
      })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   
  }
}



exports.acceptFriendRequest = async(req, res)=>{
  try {

    const {friendId} = req.body;
    const selfId = req.user._id;


    const friendData = await User.findById(friendId);
    if(!friendData){
      return res.status(400).json({
        error: 'No such user Exist.'
      });
    }
      const index = req.user.pending_friends.findIndex(id => id.equals(friendId));

      if(index !== -1){
        req.user.pending_friends.splice(index, 1);
      }else{
        return res.status(400).json({
          error: 'No any request from such user'
        });
      }

      req.user.friends.push(friendId);
      friendData.friends.push(req.user._id);

      let content = `${req.user.f_name} has accepted your friend request`;
      const notification = new NotificationModel({sender: req.user._id, receiver:friendId, content, type: "friendRequest" });
      
      await notification.save();
      await friendData.save();
      await req.user.save();

      return res.status(200).json({
        message: "You both are connected now."
      });
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   
  }
}



exports.getFriendsList = async(req, res)=>{
  try {
     const friendsList = await req.user.populate('friends');
     return res.status(200).json({
      friends:friendsList.friends
     })
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   
  }
}



exports.getPendingFriendsList = async(req, res)=>{
  try {
     const pendingFriendsList = await req.user.populate('pending_friends');
     return res.status(200).json({
      pendingFriends:pendingFriendsList.pending_friends
     })
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   
  }
}



exports.removeFromFriendList = async(req, res)=>{
  try {
      
    const selfId = req.user._id;
    const { friendId } = req.params;

    const friendData = await User.findById(friendId);
    if(!friendData){
      return res.status(404).json({
        error: 'No such user Exist.'
      })
    }
     
    const index = req.user.friends.findIndex(id => id.equals(friendId));
    const friendIndex = friendData.friends.findIndex(id => id.equals(selfId));

    if(index !== -1){
      req.user.friends.splice(index, 1);
    } else{
      return res.status(400).json({
        error: 'No any request from such user'
      })
    }

    if(friendIndex !== -1){
      friendData.friends.splice(friendIndex, 1);
    }else{
      return res.status(400).json({
        error: 'No any request from such user'
      })
    }

    await req.user.save();
    await friendData.save();
     
    return res.status(200).json({
      message: 'You are both disconnected now.'
    })


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', message: error.message });
   
  }
}