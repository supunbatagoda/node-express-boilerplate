'use strict';

const router = require('express').Router();
const SampleController = require('./sample.controller');

module.exports = (auth) => {
    router.get('/all', auth, SampleController.getAllUsers);
    router.get('/find/:id', auth, SampleController.findUserByID);
    router.post('/create', auth, SampleController.createUser);
    router.put('/update/:id', auth, SampleController.updateUser);
    router.delete('/delete/:id', auth, SampleController.deleteUser);
    return router;
};
