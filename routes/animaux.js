/*
    responsabilité : 
    ONLY:
- define endpoint (/animaux)
- call controller

    “When /animaux (endpoint) is hit, call this function (controller)”
*/

const express = require('express');
const { getAnimaux } = require('../controllers/animaux.controller');
const {authMiddleware} = require('../authentication/authMiddleware');
const router = express.Router();

router.get('/',authMiddleware, getAnimaux);

module.exports = router;