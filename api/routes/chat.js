const express = require('express');
const router = express.Router();

const { getChatRoom } = require('../controllers/chat');
const authCommon = require('../middleware/auth');

router.get("/room/:roomId", authCommon, getChatRoom);

module.exports = router;