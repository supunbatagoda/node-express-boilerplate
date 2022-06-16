'use strict';

const mainModel = require('../../libs/op_dba/main_model.class');
const Joi = require('joi');
const { validateDbParams } = require('../../utils/validation.helpers');
class accessTokenModel extends mainModel {
    insertValidationSchema;

    constructor() {
        super('OAUTH2_ACCESS_TOKEN_TB');
    }

    _init() {
        this.insertValidationSchema = Joi.object({
            apikey_id: Joi.int().required(),
            token: Joi.string().required().max(50)
        });
    }

    validateForInsert(data) {
        return validateDbParams(data, this.insertValidationSchema);
    }

    queryGetAuthKeyIdForAccessToken(accessToken) {
        return (
            `SELECT auth_key_id FROM OAUTH2_ACCESS_TOKEN_TB WHERE token ='` +
            accessToken +
            `'`
        );
    }

    queryGetAccessTokenRec(accessToken) {
        return (
            `SELECT auth_key_id, token, expires FROM OAUTH2_ACCESS_TOKEN_TB WHERE token ='` +
            accessToken +
            `'`
        );
    }

    queryCreateAccessToken(token, authKeyId) {
        return (
            `INSERT INTO OAUTH2_ACCESS_TOKEN_TB (token, auth_key_id, expires) VALUES ('` +
            token +
            `','` +
            authKeyId +
            `',` +
            `NOW()+ INTERVAL 3600 SECOND ` +
            `);`
        );
    }

    queryDeleteExpiredAccessToken() {
        return `DELETE FROM OAUTH2_ACCESS_TOKEN_TB WHERE expires < CURRENT_TIMESTAMP`;
    }

    queryDeleteInvalidAccessTokens(currentTime) {
        return `DELETE FROM OAUTH2_ACCESS_TOKEN_TB act
                 WHERE act.auth_key_id IN (
                     SELECT auth_key_id 
                       FROM OAUTH2_KEY_TB ak
                      WHERE ak.status = 'INVALID')`;
    }
}

module.exports = new accessTokenModel();
