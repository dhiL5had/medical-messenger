const express = require('express');
const router = express.Router();

const { getChatInfo } = require('../controllers/chat');
const authCommon = require('../middleware/auth');

router.get("/room/:roomId", authCommon, getChatInfo);

module.exports = router;