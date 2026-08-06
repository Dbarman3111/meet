const express = require('express');
const router = express.Router();
const Authentication = require('../authentication/auth');

const ConversationController = require('../controller/conversation');


router.post('/addConversation', Authentication.auth, ConversationController.addConversation)
router.get('/getConversation', Authentication.auth, ConversationController.getConversation)




module.exports = router;