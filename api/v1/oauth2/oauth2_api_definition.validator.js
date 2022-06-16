'use strict';

const API_NAME = 'OAUTH_TOKEN_REGISTER';
const Joi = require('joi');
const { validateApiRequest } = require('../../../utils/validation.helpers');
const {
    API_CLIENT_TYPE_MERCHANT,
    API_CLIENT_TYPE_APP
} = require('../../../services/oauth2/oauth2_enum');

module.exports.validateOauthRegisterApi = function (req) {
    const data = req.body;
    const schema = Joi.object({
        api_client_id: Joi.string().required().guid().messages({
            'string.guid': `api_client_id must be a valid uuid`
        }),
        api_client_name: Joi.string().required(),
        api_client_type: Joi.string()
            .required()
            .valid(API_CLIENT_TYPE_MERCHANT, API_CLIENT_TYPE_APP)
            .messages({
                'any.only': `api_client_type must be equal to 'MERCHANT_ACC' or 'APP'`
            }),
        refresh_oauth: Joi.boolean()
    });

    return validateApiRequest(data, schema);
};
