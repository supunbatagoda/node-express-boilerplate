'use strict';

const Joi = require('joi');
const opValidationCodes = require('../libs/op_errors/op_validation_code');

var validateApiRequest = (module.exports.validateApiRequest = function (
    data,
    schema
) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: false, // ignore unknown props
        stripUnknown: false, // remove unknown props
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    const { error } = schema.validate(data, options);
    if (error) {
        var errorList = [];
        for (var key in error.details) {
            errorList.push({
                code: getOpValidateCode(error.details[key].type),
                message: error.details[key].message
            });
        }

        return errorList;
    } else {
        return false;
    }
});

module.exports.validateDbParams = function (data, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: false, // ignore unknown props
        stripUnknown: false, // remove unknown props
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    const { error } = schema.validate(data, options);
    if (error) {
        var errorList = [];
        for (var key in error.details) {
            errorList.push({
                code: getOpValidateCode(error.details[key].type),
                message: error.details[key].message
            });
        }

        return errorList;
    } else {
        return false;
    }
};

module.exports.validateUUID = function (uuid, uuidReference) {
    const schema = Joi.string()
        .guid()
        .messages({
            'string.guid': `${uuidReference} must be a valid uuid`
        });
    return validateApiRequest(uuid, schema);
};

function getOpValidateCode(code) {
    let returnOpCode = '';
    switch (code) {
        case 'any.required':
            returnOpCode = opValidationCodes.OP_FIELD_REQUIRED;
            break;
        case 'string.email':
            returnOpCode = opValidationCodes.OP_FIELD_INVALID_EMAIL;
            break;
        case 'string.empty':
            returnOpCode = opValidationCodes.OP_FIELD_EMPTY;
            break;
        case 'string.base':
        case 'number.base':
        case 'boolean.base':
        case 'string.guid':
            returnOpCode = opValidationCodes.OP_FIELD_INVALID_TYPE;
            break;
        case 'string.uri':
            returnOpCode = opValidationCodes.OP_FIELD_INVALID_URL;
            break;
        case 'string.max':
            returnOpCode = opValidationCodes.OP_FIELD_MAX_LENGTH;
            break;
        case 'any.only':
        case 'string.uppercase':
            returnOpCode = opValidationCodes.OP_FIELD_INVALID_VALUE;
            break;
        case 'object.unknown':
            returnOpCode = opValidationCodes.OP_FIELD_NOT_ALLOWED;
            break;

        default:
            returnOpCode = opValidationCodes.OP_FIELD_ERROR_UNKNOWN;
    }

    return returnOpCode;
}

// NOTE: given joi validation messages//
// messages: {
//     'string.alphanum': '{{#label}} must only contain alpha-numeric characters',
//     'string.base': '{{#label}} must be a string',
//     'string.base64': '{{#label}} must be a valid base64 string',
//     'string.creditCard': '{{#label}} must be a credit card',
//     'string.dataUri': '{{#label}} must be a valid dataUri string',
//     'string.domain': '{{#label}} must contain a valid domain name',
//     'string.email': '{{#label}} must be a valid email',
//     'string.empty': '{{#label}} is not allowed to be empty',
//     'string.guid': '{{#label}} must be a valid GUID',
//     'string.hex': '{{#label}} must only contain hexadecimal characters',
//     'string.hexAlign': '{{#label}} hex decoded representation must be byte aligned',
//     'string.hostname': '{{#label}} must be a valid hostname',
//     'string.ip': '{{#label}} must be a valid ip address with a {{#cidr}} CIDR',
//     'string.ipVersion': '{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR',
//     'string.isoDate': '{{#label}} must be in iso format',
//     'string.isoDuration': '{{#label}} must be a valid ISO 8601 duration',
//     'string.length': '{{#label}} length must be {{#limit}} characters long',
//     'string.lowercase': '{{#label}} must only contain lowercase characters',
//     'string.max': '{{#label}} length must be less than or equal to {{#limit}} characters long',
//     'string.min': '{{#label}} length must be at least {{#limit}} characters long',
//     'string.normalize': '{{#label}} must be unicode normalized in the {{#form}} form',
//     'string.token': '{{#label}} must only contain alpha-numeric and underscore characters',
//     'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
//     'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern',
//     'string.pattern.invert.base': '{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}',
//     'string.pattern.invert.name': '{{#label}} with value {:[.]} matches the inverted {{#name}} pattern',
//     'string.trim': '{{#label}} must not have leading or trailing whitespace',
//     'string.uri': '{{#label}} must be a valid uri',
//     'string.uriCustomScheme': '{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern',
//     'string.uriRelativeOnly': '{{#label}} must be a valid relative uri',
//     'string.uppercase': '{{#label}} must only contain uppercase characters'
// }
