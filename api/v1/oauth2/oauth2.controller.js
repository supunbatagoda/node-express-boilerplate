'use strict';

const CONTROLLER_NAME = 'OAuth2';

const { json } = require('body-parser');
const { randomString } = require('../../../utils/helpers');

const opLogger = require('../../../libs/op_logger/op_logger');
const errorCodes = require('../../../libs/op_errors/op_error_codes');
const opSuccessResp = require('../../../libs/op_response/op_success_resp');
const opFailedResp = require('../../../libs/op_response/op_failed_resp');

const oauth2Service = require('../../../services/oauth2/oauth2.service');
const {
    validateOauthRegisterApi
} = require('./oauth2_api_definition.validator');

// const merchantService = require('../../../services/merchant/merchant.service');
const {
    API_CLIENT_TYPE_MERCHANT
} = require('../../../services/oauth2/oauth2_enum');

const Encrypter = require('../../../libs/op_encrypter/encrypter');
const encrypter = new Encrypter();

//=====================================================================================
async function register(req, res, next) {
    try {
        const isRefreshOauth = req.body.refresh_oauth
            ? req.body.refresh_oauth
            : false;
        const validationErrors = validateOauthRegisterApi(req);
        if (!validationErrors) {
            const retIsRegisteredApiClient =
                await oauth2Service.isRegisteredApiClient(
                    req.body.api_client_id
                );

            if (
                !isRefreshOauth &&
                retIsRegisteredApiClient.success &&
                retIsRegisteredApiClient.data
            ) {
                opFailedResp.OP_ERR_AUTH_CLIENT_EXIST(
                    res,
                    req.body.api_client_id
                );
            } else {
                var apikey = null;
                var retApiKeyExist = null;
                var apiKeyExist = true;
                do {
                    apikey = randomString(80);
                    retApiKeyExist =
                        await oauth2Service.doesAuthKeyExistForApiKey(apikey);
                    if (retApiKeyExist.success && retApiKeyExist.data) {
                        apiKeyExist = true;
                    } else {
                        apiKeyExist = false;
                    }
                } while (apiKeyExist);

                var apiSecret = randomString(80);

                const attr = {
                    api_key: apikey,
                    api_secret: apiSecret,
                    api_client_id: req.body.api_client_id,
                    api_client_name: req.body.api_client_name,
                    api_client_type: req.body.api_client_type
                };

                if (req.body.api_client_type === API_CLIENT_TYPE_MERCHANT) {
                    const mchAccData =
                        await merchantService.getMerchantAccountIDFromMchAccUid(
                            req.body.api_client_id
                        );
                    if (mchAccData.success && mchAccData.data) {
                        attr['mch_acc_uuid'] = req.body.api_client_id;
                        attr['mch_acc_id'] = mchAccData.data.mch_acc_id;
                        attr['mch_id'] = mchAccData.data.mch_id;
                        attr['tnt_id'] = mchAccData.data.tnt_id;
                    } else {
                        opFailedResp.OP_FAILED(res, mchAccData.errors);
                        return null;
                    }
                }
                if (!isRefreshOauth) {
                    await createAuthKey(res, req, attr);
                } else {
                    const oauthUpdateStatus =
                        await oauth2Service.InvalidateApiClient(
                            req.body.api_client_id
                        );
                    if (oauthUpdateStatus.success) {
                        await createAuthKey(res, req, attr);
                    } else {
                        opFailedResp.OP_FAILED(res, oauthUpdateStatus.errors);
                    }
                }
            }
        } else {
            opFailedResp.OP_FAILED(res, validationErrors);
        }
    } catch (err) {
        opLogger.logControllerError(CONTROLLER_NAME, 'register', err.message);
        err = errorCodes.OP_ERR_INTERNAL_SERVER();
        next(err);
    }
}

async function createAuthKey(res, req, attr) {
    const retCreateAuthKey = await oauth2Service.createAuthKey(attr);
    if (retCreateAuthKey.success) {
        opSuccessResp.OP_SUCCESS_OAUTH_CLIENT_REG(
            res,
            req.body.api_client_id,
            null,
            null,
            {
                api_key: encrypter.encrypt(retCreateAuthKey.data.api_key),
                api_secret: encrypter.encrypt(retCreateAuthKey.data.api_secret),
                api_client_id: retCreateAuthKey.data.api_client_id,
                api_client_name: retCreateAuthKey.data.api_client_name
            }
        );
    } else {
        opFailedResp.OP_FAILED(res, retCreateAuthKey.errors);
    }
}

function token(req, res, next) {}

//=====================================================================================
module.exports = {
    register: register,
    token: token
};
