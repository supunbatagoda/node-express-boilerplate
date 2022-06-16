'use strict';
const Joi = require('@hapi/joi');

function createValidate(authKey) {
    const schema = Joi.object({
        api_key: Joi.string().required().max(80),
        api_secret: Joi.string().required().max(80),
        api_client_id: Joi.string().required().max(20),
        api_client_name: Joi.string().required().max(200)
    });

    return Joi.validate(authKey, schema, {
        abortEarly: false
    });
}

module.exports = {
    createValidate
};
