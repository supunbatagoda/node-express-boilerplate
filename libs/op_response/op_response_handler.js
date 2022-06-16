'use strict';

/**
 * @desc Send any success response
 * @param {string} message
 * @param {object | array} results
 * @returns
 */
module.exports.opSuccessResponse = (message, results) => {
    return {
        success: 1,
        message,
        code: 200,
        results
    };
};

/**
 * @desc    Send any failed response
 * @param {string} message
 * @param {object | array} errors
 * @param {number} statusCode
 * @returns
 */
module.exports.opFailedResponse = (message, errors, statusCode = 500) => {
    return {
        success: 0,
        message,
        code: statusCode,
        errors
    };
};

// TODO: OP warning response
module.exports.opWarningResponse = () => {};
