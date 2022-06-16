'use strict';

const fetch = require('node-fetch');

module.exports.callAPI = function (path, method, type, fetchOptions) {
    return fetch(`${path}`, {
        method,
        ...fetchOptions,
        headers: {
            'Content-Type': type,
            ...(fetchOptions.headers || {})
        }
    });
};

module.exports.callAPIOauth2 = function (
    path,
    method,
    authorizationHeaderString,
    contentType,
    apiBody
) {
    return fetch(`${path}`, {
        method,
        headers: {
            Authorization: authorizationHeaderString,
            'Content-Type': contentType
        },
        body: apiBody
    });
};
