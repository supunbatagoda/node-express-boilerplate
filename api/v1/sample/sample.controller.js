'use strict';

const CONTROLLER_NAME = 'User';

const opLogger = require('../../../libs/op_logger/op_logger');
const errorCodes = require('../../../libs/op_errors/op_error_codes');

const opSuccessResp = require('../../../libs/op_response/op_success_resp');
const opFailedResp = require('../../../libs/op_response/op_failed_resp');

const UserService = require('../../../services/user/user.service');
const validateUser = require('../../../services/user/user.validator');

async function getAllUsers(req, res, next) {
    try {
        const result = await UserService.getAllUsers();
        if (result.success) {
            opSuccessResp.OP_SUCCESS(res, `Get all user`, {
                users: result.data
            });
        } else {
            opFailedResp.OP_FAILED(res, result.errors, 400);
        }
    } catch (err) {
        opLogger.logControllerError(
            CONTROLLER_NAME,
            'getAllUsers',
            err.message
        );
        err = errorCodes.OP_ERR_INTERNAL_SERVER();
        next(err);
    }
}

async function findUserByID(req, res, next) {
    try {
        const ID = req.params.id;
        const validate = validateUser.find(ID);
        if (!validate) {
            const result = await UserService.findUserByID(ID);
            if (result.success) {
                opSuccessResp.OP_SUCCESS(
                    res,
                    `User id '${ID}' details`,
                    result.data
                );
            } else {
                opFailedResp.OP_FAILED(res, result.errors, 400);
            }
        } else {
            opFailedResp.OP_FAILED(res, validate, 400);
        }
    } catch (err) {
        opLogger.logControllerError(CONTROLLER_NAME, 'findUserByID', err);
        err = errorCodes.OP_ERR_INTERNAL_SERVER();
        next(err);
    }
}

async function createUser(req, res, next) {
    try {
        const data = req.body;
        const validationErrors = validateUser.create(data);
        if (!validationErrors) {
            const result = await UserService.createUser(data);
            if (result.success) {
                opSuccessResp.OP_SUCCESS(
                    res,
                    `'${result.data.name}' user has been created successfully!`,
                    result.data
                );
            } else {
                opFailedResp.OP_FAILED(res, result.errors, 400);
            }
        } else {
            opFailedResp.OP_FAILED(res, validationErrors, 400);
        }
    } catch (err) {
        opLogger.logControllerError(CONTROLLER_NAME, 'createUser', err.message);
        err = errorCodes.OP_ERR_INTERNAL_SERVER();
        next(err);
    }
}
async function updateUser(req, res, next) {
    try {
        const data = req.body;
        const ID = req.params.id;
        const validationErrors = validateUser.find(ID);
        if (!validationErrors) {
            const result = await UserService.updateUser(data, ID);
            if (result.success) {
                opSuccessResp.OP_SUCCESS(
                    res,
                    `User id - '${ID}' has been updated successfully!`,
                    data
                );
            } else {
                opFailedResp.OP_FAILED(res, result.errors, 400);
            }
        } else {
            opFailedResp.OP_FAILED(res, validationErrors, 400);
        }
    } catch (err) {
        opLogger.logControllerError(CONTROLLER_NAME, 'updateUser', err.message);
        err = errorCodes.OP_ERR_INTERNAL_SERVER();
        next(err);
    }
}
async function deleteUser(req, res, next) {
    try {
        const ID = req.params.id;
        const validationErrors = validateUser.find(ID);
        if (!validationErrors) {
            const result = await UserService.deleteUser(ID);
            if (result.success) {
                opSuccessResp.OP_SUCCESS(
                    res,
                    `User id - '${ID}' has been deleted!`,
                    true
                );
            } else {
                opFailedResp.OP_FAILED(res, result.errors, 400);
            }
        } else {
            opFailedResp.OP_FAILED(res, validationErrors, 400);
        }
    } catch (err) {
        opLogger.logControllerError(CONTROLLER_NAME, 'deleteUser', err.message);
        err = errorCodes.OP_ERR_INTERNAL_SERVER();
        next(err);
    }
}

module.exports = {
    getAllUsers,
    findUserByID,
    createUser,
    updateUser,
    deleteUser
};
