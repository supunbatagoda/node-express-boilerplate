'use strict';
const API_NAME = 'SAMPLE_API';
const Joi = require('joi');
const { validateApiRequest } = require('../../utils/validation.helpers');

module.exports.create = function (data) {
    const schema = Joi.object({
        firstName: Joi.string().required().allow(false),
        lastName: Joi.string().required().allow(false),
        email: Joi.string().email().required().max(125).allow(false),
        userName: Joi.string().required().max(50).allow(false)
    });

    return validateApiRequest(data, schema);
};
module.exports.find = function (data) {
    const schema = Joi.number().messages({
        number: `user ID must be a valid id`
    });
    return validateApiRequest(data, schema);
};
