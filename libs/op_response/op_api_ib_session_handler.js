'use strict';

const apiSessionService = require('../../services/api_inbound_session/api_ib_session.service');
const opLogger = require('../op_logger/op_logger.js');
const opErrorCodes = require('../op_errors/op_error_codes');
const { extractToken } = require('../../utils/helpers');

module.exports.updateApiSession = async function (
    apiIbSessionId,
    resp,
    status,
    isSuccess = false
) {
    try {
        let updateData = {};
        if (isSuccess) {
            updateData = {
                status: status,
                resp_op_success: isSuccess
            };
        } else {
            updateData = { status: status };
        }

        const updatedApiSessionData = await apiSessionService.updateSession(
            apiIbSessionId,
            updateData,
            resp
        );
        if (updatedApiSessionData.success) {
            return updatedApiSessionData.data;
        }
        return false;
    } catch (err) {
        opLogger.logServiceError(
            'OP_RESPONSE_API_IB_SESSION_UPDATE',
            'apiIbSessionUpdate',
            err
        );
        throw opErrorCodes.OP_ERR_SERVICE(
            'OP_RESPONSE_API_IB_SESSION_UPDATE',
            'apiIbSessionUpdate'
        );
    }
};
