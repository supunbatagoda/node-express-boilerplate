/*
Client Credentials Grant
See Section 4.4 of RFC 6749.
*/

'use strict';

const { opDevLogger, opLogger } = require('../op_logger/op_logger');
const opErrorCodes = require('../op_errors/op_error_codes');

const {
    opSuccessResponse,
    opFailedResponse
} = require('../op_response/op_response_handler');

const oauth2Handler = require('./op_oauth2.server.handler');

function getClient(clientId, clientSecret, cbFunc) {
    const client = {
        clientId,
        clientSecret,
        grants: ['client_credentials'],
        redirectUris: null
    };
    cbFunc(false, client);
}

function getUserFromClient(clientId, clientSecret, cbFunc) {
    oauth2Handler.getUserFromClient(clientId, clientSecret, cbFunc);
}

function getUser(clientId, clientSecret, cbFunc) {
    oauth2Handler.getUserFromClient(clientId, clientSecret, cbFunc);
}

function grantTypeAllowed(clientId, grantType, cbFunc) {
    cbFunc(false, true);
}

function saveAccessToken(accessToken, clientId, expires, user, cbFunc) {
    oauth2Handler.saveAccessToken(accessToken, user, cbFunc);
}

function getAccessToken(bearerToken, cbFunc) {
    oauth2Handler.getAccessTokenRec(bearerToken, cbFunc);
}

module.exports = {
    getClient: getClient,
    getUserFromClient: getUserFromClient,
    getUser: getUser,
    grantTypeAllowed: grantTypeAllowed,
    saveAccessToken: saveAccessToken,
    getAccessToken: getAccessToken
};
