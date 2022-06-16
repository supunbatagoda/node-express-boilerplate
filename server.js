'use strict';

// =========================================
const express = require('express');
const router = express.Router();
const app = express();
const opErrorHandler = require('./libs/op_errors/op_error_handler');
app.use(express.static('client'));
// =========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//=============================================
const oAuth2Server = require('node-oauth2-server');
const oAuth2Model = require('./libs/op_oauth2/op_oauth2.server.model');

app.oauth = oAuth2Server({
    model: oAuth2Model,
    grants: ['client_credentials'],
    clientIdRegex: /^[a-z0-9-_]{3,80}$/i,
    accessTokenLifetime: 3600,
    debug: true //CHWALK CWTODO debug true only if this is development env
});

//=============================================
const routes = require('./router.js')(app);
app.use(routes);

// =========================================
app.disable('x-powered-by');
app.disable('etag');

// =========================================
app.use(opErrorHandler);

// =========================================
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
    //CHWALK CWTODO op_logger
    console.log(`server is started on port ${port}`)
);
