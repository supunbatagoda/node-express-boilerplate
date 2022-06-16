'use strict';
const { formatMessage } = require('../../utils/helpers');
const { updateApiSession } = require('./op_api_ib_session_handler');
const {
    API_SESSION_STATUS,
    API_SESSION_RESP_STATUS
} = require('../../services/api_inbound_session/api_ib_session.enum');

function OP_SUCCESS(res, message, data = [], apiIbSessionId = false) {
    res.headers = {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache'
    };
    const resp = {
        success: 1,
        code: 'OP_SUCCESS',
        message: message,
        results: data,
        errors: []
    };
    if (apiIbSessionId) {
        updateApiSession(apiIbSessionId, resp, API_SESSION_STATUS.CLOSED, 1);
    }

    res.status(200).json(resp);
}

function OP_RESPONSE(res, response, httpCode = 500, apiIbSessionId) {
    res.headers = {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache'
    };
    updateApiSession(apiIbSessionId, false, API_SESSION_STATUS.CLOSED);

    res.status(httpCode).json(response);
}

function OP_SUCCESS_OAUTH_CLIENT_REG(
    res,
    a,
    b,
    c,
    data = [],
    apiIbSessionId = false
) {
    let message = 'Client having id %s is successfully registered';
    let msg = formatMessage(message, a, b, c);

    OP_SUCCESS(res, msg, data, apiIbSessionId);
}

function OP_SUCCESS_API_REG(res, data = [], apiIbSessionId = false) {
    let message = 'OpusPAY registration successful!';

    OP_SUCCESS(res, message, data, apiIbSessionId);
}
function OP_SUCCESS_REG_STATUS(res, a, data = [], apiIbSessionId = false) {
    let message = 'OpusPAY registration status for %s';
    let msg = formatMessage(message, a);

    OP_SUCCESS(res, msg, data, apiIbSessionId);
}
function OP_SUCCESS_WEB_PAYMENT(res, data = [], apiIbSessionId = false) {
    let message = 'OpusPAY web payment successfully';

    OP_SUCCESS(res, message, data, apiIbSessionId);
}
function OP_SUCCESS_MERCHANT_DETAILS(
    res,
    a,
    data = [],
    apiIbSessionId = false
) {
    let message = 'Details for merchant id - %s';
    let msg = formatMessage(message, a);

    OP_SUCCESS(res, msg, data, apiIbSessionId);
}

module.exports = {
    OP_SUCCESS,
    OP_RESPONSE,
    OP_SUCCESS_OAUTH_CLIENT_REG,
    OP_SUCCESS_API_REG,
    OP_SUCCESS_REG_STATUS,
    OP_SUCCESS_WEB_PAYMENT,
    OP_SUCCESS_MERCHANT_DETAILS
};
