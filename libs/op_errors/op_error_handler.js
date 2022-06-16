'use strict';
const {
    opDevLogger,
    opLogger,
    logFileLogger
} = require('../op_logger/op_logger.js');
const opFailedResp = require('../op_response/op_failed_resp');

function opErrorHandler(err, req, res, next) {
    var statusCode = null;
    var errCode = null;
    var message = null;
    var stack = null;

    const oauthErrorCode = err.oauthErrorCode;

    if (oauthErrorCode) {
        res.headers = {
            'Cache-Control': 'no-store',
            Pragma: 'no-cache'
        };
        switch (err.error) {
            case 'invalid_client':
                res.headers['WWW-Authenticate'] = 'Basic realm="Service"';
                statusCode = 401;
                errCode = 'OP_ERR_INVALID_API_CRED';
                message = 'API Credentials are invalid';
                break;
            case 'invalid_grant':
                res.headers['WWW-Authenticate'] = 'Basic realm="Service"';
                statusCode = 401;
                errCode = 'OP_ERR_INVALID_API_CRED';
                message = 'API Credentials are invalid';
                break;
            case 'invalid_request':
                statusCode = 400;
                errCode = 'OP_ERR_INVALID_REQUEST';
                message = 'Invalid Request';
                break;
            case 'invalid_token':
                res.headers['WWW-Authenticate'] = 'Basic realm="Service"';
                statusCode = 401;
                errCode = 'OP_ERR_INVALID_ACCESSTOKEN';
                message = 'Invalid Access Token';
                break;
            case 'server_error':
                statusCode = 503;
                errCode = 'OP_ERR_SERVER_ERROR';
                message = 'Server Error';
                break;
            default:
                statusCode = 500;
                errCode = 'OP_ERR_SERVER_ERROR';
                message = 'Server Error';
        }
    } else {
        statusCode = err.statusCode || 500;
        errCode = err.opErrCode;
        message = err.message;
        logFileLogger(err.message, 'token.log');
    }

    const errors = [
        {
            code: errCode,
            message: message
        }
    ];

    if (process.env.NODE_ENV === 'production') {
        opFailedResp.OP_FAILED(res, errors, statusCode);
    } else {
        opFailedResp.OP_FAILED_DEV(res, errors, statusCode);
    }
}

module.exports = opErrorHandler;
