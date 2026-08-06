const express = require('express');
const cookieParser = require("cookie-parser")

require('dotenv').config({path:"./config.env"});
require('./connection')  // Connect to MongoDB

const cors = require('cors')
const {Server} = require('socket.io')
const http  = require("http");


 
 



const PORT = process.env.PORT || 4000;


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: "http://localhost:5173"
}))

const server = http.createServer(app);

const  io = new Server(server,{
    cors:{
        origin: " http://localhost:5173",
        methods:['GET', 'POST'],
    }
})


io.on('connection',(socket)=>{
    console.log("✅user Connected")
    socket.on("joinConversation", (conversationId)=> {
        console.log(`User joined Conversation ID of ${conversationId}`)
        socket.join(conversationId)
    })

    socket.on("sendMessage", (convId, messageDetail) =>{
        console.log("Message send")
        io.to(convId).emit("receiveMessage", messageDetail)
    })
})




const UserRoutes = require('./routes/user');
const PostRoutes = require('./routes/post')
const NotificationRoutes = require('./routes/notification')
const CommentRoutes = require('./routes/comment')
const ConversationRoutes = require('./routes/conversation')
const MessageRoutes = require('./routes/message')



app.use('/api/auth', UserRoutes);
app.use('/api/post', PostRoutes);
app.use('/api/notification', NotificationRoutes);
app.use('/api/comment', CommentRoutes )
app.use('/api/conversation',ConversationRoutes )
app.use('/api/message', MessageRoutes)

 

server.listen(PORT, ()=> {
    console.log("Backend server is running on Port", PORT)
})