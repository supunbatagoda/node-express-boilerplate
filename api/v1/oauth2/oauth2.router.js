'use strict';
/*
    NOTE: This logic is implemented in main rounter (router.js)
          For performance reasons
*/
const router = require('express').Router();
const oauth2Controller = require('./oauth2.controller');

module.exports = (auth) => {
    router.post('/register', oauth2Controller.register);
    router.post('/token', auth, oauth2Controller.token);
    return router;
};
