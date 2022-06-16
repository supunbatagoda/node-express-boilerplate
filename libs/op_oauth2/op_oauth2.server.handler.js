'use strict';
const { isNotEmpty } = require('../../utils/helpers');
const { opDevLogger, opLogger } = require('../op_logger/op_logger');

const {
    opSuccessResponse,
    opFailedResponse
} = require('../op_response/op_response_handler');

const oauth2Service = require('../../services/oauth2/oauth2.service');

async function getUserFromClient(clientId, clientSecret, next) {
    // Note: clientId >> apiKey,
    //       clientSecret >> apiSecret

    try {
        const retAuthKeyId = await oauth2Service.getAuthKeyIdForCredentials(
            clientId,
            clientSecret
        );
        next(false, retAuthKeyId.data !== null ? retAuthKeyId.data : null);
    } catch (err) {
        opLogger.error(
            'OAuth2.server.handler::getUserFromClient()' + err.opErrMessage
        );
        next(null);
    }
}

async function saveAccessToken(token, authKeyId, next) {
    try {
        const accessToken = await oauth2Service.saveAccessToken(
            token,
            authKeyId
        );
        next(false, accessToken !== null ? accessToken[0] : null);
    } catch (err) {
        opLogger.error('OAuth2.server.handler::saveAccessToken()');
        next(null);
    }
}

async function getAccessTokenRec(bearerToken, next) {
    try {
        const retAccesssTokenRec = await oauth2Service.getAccessTokenRec(
            bearerToken
        );

        var accessToken = null;

        if (retAccesssTokenRec.success && isNotEmpty(retAccesssTokenRec.data)) {
            accessToken = {
                token: retAccesssTokenRec.data.token,
                user: {
                    id: retAccesssTokenRec.data.auth_key_id
                },
                expires: retAccesssTokenRec.data.expires
            };
        }

        next(false, accessToken);
    } catch (err) {
        opLogger.error(
            'OAuth2.server.handler::getAccessTokenRec()::' + err.message
        );
        next(null);
    }
}

module.exports = {
    getAccessTokenRec: getAccessTokenRec,
    getUserFromClient: getUserFromClient,
    saveAccessToken: saveAccessToken
};
