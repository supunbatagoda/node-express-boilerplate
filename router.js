'use strict';

const opErrorCodes = require('./libs/op_errors/op_error_codes');
const oauth2Controller = require('./api/v1/oauth2/oauth2.controller');

const router = require('express').Router();

const apiEndpointPrefix = '/api';
const apiVersion = '/v1';
const apiEndpoint = apiEndpointPrefix + apiVersion;

module.exports = (app) => {
    //oauth2 Routes
    router.post(`${apiEndpoint}/oauth2/register`, oauth2Controller.register);

    //oauth2 Get Access Token
    router.post(
        `${apiEndpoint}/oauth2/token`,
        app.oauth.grant(),
        oauth2Controller.token
    );

    // API route Test
    router.get(`${apiEndpoint}`, (req, res) => {
        res.status(200);
        res.json({ api_ver: '1' });
    });
    // API get client ip
    router.get(`${apiEndpoint}/get-ip`, (req, res) => {
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const reqData = { raw_ip: ip, ip: ip.split(':').pop() };
        res.status(200);
        res.json(reqData);
    });

    router.get(`${apiEndpoint}/error`, (req, res) => {
        res.status(400).json({ data: false });
    });

    // Sample Router
    router.use(
        `${apiEndpoint}/sample`,
        require('./api/v1/sample/sample.router')(app.oauth.authorise())
    );

    router.use('*', (req, res, next) => {
        throw opErrorCodes.OP_ERR_INVALID_URL(req.path);
    });

    return router;
};
