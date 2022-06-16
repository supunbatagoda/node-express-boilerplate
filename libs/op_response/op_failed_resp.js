'use strict';
const { formatMessage } = require('../../utils/helpers');
const { updateApiSession } = require('./op_api_ib_session_handler');
// s

function OP_FAILED(res, errors = [], httpCode = 401, apiIbSessionId = false) {
    res.headers = {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache'
    };
    const resp = {
        success: 0,
        errors: errors,
        code: 'OP_FAILED'
    };
    if (apiIbSessionId) {
        updateApiSession(apiIbSessionId, resp, API_SESSION_STATUS.CLOSED, 0);
    }
    res.status(httpCode).json(resp);
}

function OP_FAILED_DEV(
    res,
    errors = [],
    httpCode = 401,
    stack = [],
    apiIbSessionId = false
) {
    res.headers = {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache'
    };
    res.status(httpCode).json({
        success: 0,
        errors: errors,
        stack: stack
    });
}

function OP_ERR_AUTH_CLIENT_EXIST(res, a, b, c, apiIbSessionId = false) {
    let message = 'Client having id %s already registered';
    let msg = formatMessage(message, a, b, c);
    let errors = [{ code: 'OP_ERR_AUTH_CLIENT_EXIST', message: msg }];

    OP_FAILED(res, errors, 401, apiIbSessionId);

    // res.status(401).json({
    //     success: 0,
    //     errors: [{ code: 'OP_ERR_AUTH_CLIENT_EXIST', message: msg }]
    // });
}

function OP_ERR_GET_REG_STATUS_FAILED(res, error, apiIbSessionId = false) {
    let errorList = [{ code: 'OP_ERR_GET_REG_STATUS_FAILED', message: error }];

    OP_FAILED(res, errorList, 400, apiIbSessionId);
}

function OP_ERR_CONNECTION_TIME_OUT(res, a, b, c, apiIbSessionId = false) {
    let message = 'Connection Timeout: %s seconds';
    let msg = formatMessage(message, a, b, c);
    let errors = [{ code: 'OP_ERR_CONNECTION_TIME_OUT', message: msg }];
    OP_FAILED(res, errors, 408, apiIbSessionId);
}

module.exports = {
    OP_FAILED,
    OP_FAILED_DEV,
    OP_ERR_AUTH_CLIENT_EXIST,
    OP_ERR_GET_REG_STATUS_FAILED,
    OP_ERR_CONNECTION_TIME_OUT
};
