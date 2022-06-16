'use strict';

const SERVICE_NAME = 'OAuth2';

const { isNotEmpty, extractToken } = require('../../utils/helpers');
const { API_CLIENT_TYPE_MERCHANT } = require('./oauth2_enum');

const dbConnection = require('../../libs/op_dba/mysql2.class');
const opLogger = require('../../libs/op_logger/op_logger.js');
const opErrorCodes = require('../../libs/op_errors/op_error_codes');

const opValidationCodes = require('../../libs/op_errors/op_validation_code');

const authKeyModel = require('./oauth2.apikey.model');
const accessTokenModel = require('./oauth2.accesstoken.model');
// const merchantService = require('../merchant/merchant.service');
const constant = require('../../config/constant');
const moment = require('moment');
const dbInstance = new dbConnection();

//====================================== AUTH KEY ==================================/
async function createAuthKey(data) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };

    try {
        const { error } = authKeyModel.validateForInsert(data);

        if (!error) {
            const dbQuery = await authKeyModel.createQuery();
            const dbTrn = await dbInstance.create(dbQuery, data);
            if (dbTrn.success) {
                returnData.success = true;
                returnData.data = {
                    api_key: data.api_key,
                    api_secret: data.api_secret,
                    api_client_id: data.api_client_id,
                    api_client_name: data.api_client_name
                };
            } else {
                returnData.success = false;
            }
        } else {
            let validationErrors = error.details.map(({ message }) => message);
            returnData.success = false;
            returnData.errors = validationErrors;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'createAuthKey',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'createAuthKey');
    }
}

async function getAuthKeyIdForCredentials(apikey, apiSecret) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };

    try {
        const dbQuery = await authKeyModel.queryGetAuthKeyIdForCredentials(
            apikey,
            apiSecret
        );
        const dbTrn = await dbInstance.queryExecute(dbQuery);
        if (dbTrn.success && isNotEmpty(dbTrn.data)) {
            returnData.success = true;
            returnData.data = dbTrn.data[0].auth_key_id;
        } else {
            returnData.success = false;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'getAuthKeyIdForCredentials',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(
            SERVICE_NAME,
            'getAuthKeyIdForCredentials'
        );
    }
}

async function doesAuthKeyExistForApiKey(apikey) {
    let returnData = {
        success: false,
        data: false,
        error_message: null,
        errors: []
    };

    try {
        const dbQuery = await authKeyModel.queryDoesAuthKeyExistForApiKey(
            apikey
        );
        const dbTrn = await dbInstance.queryExecute(dbQuery);
        if (dbTrn.success && isNotEmpty(dbTrn.data)) {
            if (dbTrn.data[0].CHECK_EXIST == 1) {
                returnData.success = true;
                returnData.data = true;
            }
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'doesAuthKeyExistForApiKey',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(
            SERVICE_NAME,
            'doesAuthKeyExistForApiKey'
        );
    }
}

async function isRegisteredApiClient(apiClientId) {
    let returnData = {
        success: false,
        data: false,
        error_message: null,
        errors: []
    };

    try {
        const dbQuery = await authKeyModel.queryDoesAuthKeyExistForApiClientId(
            apiClientId
        );
        const dbTrn = await dbInstance.queryExecute(dbQuery);

        if (dbTrn.success && isNotEmpty(dbTrn.data)) {
            if (dbTrn.data[0].CHECK_EXIST == 1) {
                returnData.success = true;
                returnData.data = true;
            }
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'isRegisteredApiClient',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(
            SERVICE_NAME,
            'isRegisteredApiClient'
        );
    }
}

//====================================== AccessToken  ==================================/
async function getAccessTokenRec(accessToken) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };

    try {
        const dbQuery = await accessTokenModel.queryGetAccessTokenRec(
            accessToken
        );
        const dbTrn = await dbInstance.queryExecute(dbQuery);
        if (dbTrn.success && isNotEmpty(dbTrn.data)) {
            returnData.success = true;
            returnData.data = dbTrn.data[0];
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'getAccessTokenRec',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'getAccessTokenRec');
    }
}

async function getAuthKeyIdForAccessToken(accessToken) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };

    try {
        const dbQuery = await accessTokenModel.queryGetAuthKeyIdForAccessToken(
            accessToken
        );
        const dbTrn = await dbInstance.queryExecute(dbQuery);

        if (dbTrn.success && isNotEmpty(dbTrn.data)) {
            returnData.success = true;
            returnData.data = dbTrn.data[0].auth_key_id;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'getAuthKeyIdForAccessToken',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(
            SERVICE_NAME,
            'getAuthKeyIdForAccessToken'
        );
    }
}

async function saveAccessToken(token, authKeyId) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const dbQuery = await accessTokenModel.queryCreateAccessToken(
            token,
            authKeyId
        );
        const dbTrn = await dbInstance.queryExecute(dbQuery);
        if (dbTrn.success) {
            returnData.success = true;
            returnData.data = token;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'saveAccessToken',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'createAccessToken');
    }
}

async function InvalidateApiClient(apiClientId) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const dbQuery = await authKeyModel.updateQuery('api_client_id');
        const dbTrn = await dbInstance.update(dbQuery, [
            { status: 'INVALID' },
            `${apiClientId}`
        ]);
        if (dbTrn.success) {
            if (dbTrn.data.affectedRows > 0) {
                const dbQuery2 =
                    await accessTokenModel.queryDeleteInvalidAccessTokens();
                const dbTrn2 = await dbInstance.queryExecute(dbQuery2);

                if (dbTrn2.success) {
                    //
                }
                returnData.success = true;
                returnData.data = dbTrn.data;
            } else {
                returnData.errors.push({
                    code: opValidationCodes.OP_FIELD_INVALID_VALUE,
                    message: `'${apiClientId}' is not valid api_client_id`
                });
            }
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'InvalidateApiClient', err);
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'InvalidateApiClient');
    }
}

async function getAuthDataForAuthKeyId(authKeyId) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };

    try {
        const dbQuery = await authKeyModel.findByColumnQuery(
            'auth_key_id',
            `mch_acc_id, mch_acc_uuid, mch_id, tnt_id, api_key, api_secret, api_client_type`
        );
        const dbTrn = await dbInstance.find(dbQuery, authKeyId);

        if (dbTrn.success && isNotEmpty(dbTrn.data)) {
            returnData.success = true;
            returnData.data = dbTrn.data;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'getAuthDataForAuthKeyId', err);
        throw opErrorCodes.OP_ERR_SERVICE(
            SERVICE_NAME,
            'getAuthDataForAuthKeyId'
        );
    }
}

async function getMerchantDetailsForToken(req) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };

    try {
        const bearerToken = extractToken(req);

        if (bearerToken) {
            const retAuthKey = await getAuthKeyIdForAccessToken(bearerToken);
            if (retAuthKey.success) {
                const authKeyId = retAuthKey.data;

                const authDetails = await getAuthDataForAuthKeyId(authKeyId);

                if (
                    authDetails.success &&
                    isNotEmpty(authDetails.data) &&
                    authDetails.data.api_client_type == API_CLIENT_TYPE_MERCHANT
                ) {
                    const merchantAccId = authDetails.data.mch_acc_id;
                    const merchantId = authDetails.data.mch_id;
                    const tntId = authDetails.data.tnt_id;
                    const merchantAccData =
                        await merchantService.getMerchantAccPersonalDetailsForMchAccID(
                            merchantAccId,
                            merchantId,
                            tntId
                        );

                    if (merchantAccData.success) {
                        returnData.success = true;
                        returnData.data = {
                            merchantAccCountryCode:
                                merchantAccData.data.country_code,
                            merchantAccName: merchantAccData.data.mch_acc_name,
                            merchantAccId,
                            merchantId,
                            tntId,
                            authKeyId
                        };
                    } else {
                        returnData.errors.push({
                            code: opValidationCodes.OP_INVALID_MERCHANT,
                            message: `Requested merchant is not active status`
                        });
                    }
                } else {
                    returnData.errors.push({
                        code: opValidationCodes.OP_INVALID_TOKEN,
                        message: `Bearer Token is not valid for merchant client type`
                    });
                }
            }
        }

        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'getMerchantDetailsForToken',
            err
        );
        throw opErrorCodes.OP_ERR_SERVICE(
            SERVICE_NAME,
            'getMerchantDetailsForToken'
        );
    }
}

async function deleteExpiredAccessToken() {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const dbQuery = await accessTokenModel.queryDeleteExpiredAccessToken();
        const dbTrn = await dbInstance.queryExecute(dbQuery);
        if (dbTrn.success && isNotEmpty(dbTrn.data)) {
            returnData.success = true;
            returnData.data = dbTrn.data[0];
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(
            SERVICE_NAME,
            'deleteExpiredAccessToken',
            err.opErrMessage
        );
        throw opErrorCodes.OP_ERR_SERVICE(
            SERVICE_NAME,
            'deleteExpiredAccessToken'
        );
    }
}
//=========================================================================

module.exports = {
    createAuthKey,
    getAuthKeyIdForCredentials,
    doesAuthKeyExistForApiKey,
    isRegisteredApiClient,
    getAccessTokenRec,
    getAuthKeyIdForAccessToken,
    saveAccessToken,
    InvalidateApiClient,
    getAuthDataForAuthKeyId,
    getMerchantDetailsForToken,
    deleteExpiredAccessToken
};
