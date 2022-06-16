'use strict';

const OpErrorClass = require('./op_error.class.js');

//=========================== INTERNAL SERVER ERRORS 500 ===========================//
function OP_ERR_VALIDATION_FIELDS(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_VALIDATION_FIELDS',
        'Field Validation Failed: %s',
        a,
        b,
        c,
        500
    );
}

function OP_ERR_SERVICE(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_SERVICE',
        'SERVICE_ERROR::%s::%s() Execution Error %s',
        a,
        b,
        c,
        500
    );
}

function OP_ERR_CONTROLLER(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_SERVICE',
        'CONTROLLER_ERROR::%s::%s() Execution Error %s',
        a,
        b,
        c,
        500
    );
}

function OP_ERR_CLASS(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_SERVICE',
        'CLASS_ERROR::%s::%s() Execution Error %s',
        a,
        b,
        c,
        500
    );
}
//=========================== INTERNAL SERVER ERRORS 500 ===========================//

function OP_ERR_INTERNAL_SERVER(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_INTERNAL_SERVER',
        'Internal Server Error',
        a,
        b,
        c,
        500
    );
}

function OP_ERR_DB_CONNECTION(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_DB_CONNECTION',
        'DB Connection Error',
        a,
        b,
        c,
        500
    );
}

function OP_ERR_DB_EXECUTION(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_DB_EXECUTION',
        'DB Query Execution Error',
        a,
        b,
        c,
        404
    );
}

//=========================== URL ERRORs ===========================//
function OP_ERR_NOT_FOUND(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_NOT_FOUND',
        'Not Found',
        a,
        b,
        c,
        404
    );
}

function OP_ERR_INVALID_URL(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_INVALID_URL',
        'Invalid URL %s',
        a,
        b,
        c,
        404
    );
}

//========================= OAUTH2 ERRORS ===========================//
function OP_ERR_UNAUTHORIZED(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_UNAUTHORIZED',
        'Unauthorized Access: %s',
        a,
        b,
        c,
        401
    );
}

function OP_ERR_INVALID_ACCESSTOKEN(a, b, c) {
    return OpErrorClass.createError(
        'OP_ERR_INVALID_ACCESSTOKEN',
        'Invalid Access Token',
        a,
        b,
        c,
        401
    );
}

module.exports = {
    OP_ERR_VALIDATION_FIELDS,
    OP_ERR_SERVICE,
    OP_ERR_CONTROLLER,
    OP_ERR_CLASS,
    OP_ERR_INTERNAL_SERVER,
    OP_ERR_DB_CONNECTION,
    OP_ERR_DB_EXECUTION,
    OP_ERR_NOT_FOUND,
    OP_ERR_INVALID_URL,
    OP_ERR_UNAUTHORIZED,
    OP_ERR_INVALID_ACCESSTOKEN
};
