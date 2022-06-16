'use strict';
const Joi = require('@hapi/joi');

function createValidate(accessToken) {
    const schema = Joi.object({
        apikey_id: Joi.int().required(),
        token: Joi.string().required().max(50)
    });

    return Joi.validate(accessToken, schema, {
        abortEarly: false
    });
}

module.exports = {
    createValidate
};
