'use strict';

const mainModel = require('../../libs/op_dba/main_model.class');
const Joi = require('joi');
const { validateDbParams } = require('../../utils/validation.helpers');
class authKeyModel extends mainModel {
    insertValidationSchema;

    constructor() {
        super('OAUTH2_KEY_TB');
        this._init();
    }

    _init() {
        this.insertValidationSchema = Joi.object({
            api_key: Joi.string().required().max(80),
            api_secret: Joi.string().required().max(80),
            api_client_id: Joi.string().required().max(20),
            api_client_name: Joi.string().required().max(200)
        });
    }

    validateForInsert(data) {
        return validateDbParams(data, this.insertValidationSchema);
    }

    queryGetAuthKeyIdForCredentials(api_key, api_secret) {
        return (
            `SELECT auth_key_id FROM OAUTH2_KEY_TB ` +
            `WHERE api_key ='` +
            api_key +
            `'` +
            ` AND api_secret = '` +
            api_secret +
            `'` +
            ` AND status = 'VALID' `
        );
    }

    queryDoesAuthKeyExistForApiKey(api_key) {
        return (
            `SELECT 1 as CHECK_EXIST FROM OAUTH2_KEY_TB ` +
            `WHERE api_key ='` +
            api_key +
            `' ` +
            `limit 1`
        );
    }

    queryDoesAuthKeyExistForApiClientId(api_client_id) {
        return `SELECT 1 as CHECK_EXIST 
        FROM OAUTH2_KEY_TB 
        WHERE api_client_id = '${api_client_id}' AND status = 'VALID'
        LIMIT 1`;
    }
}

module.exports = new authKeyModel();
