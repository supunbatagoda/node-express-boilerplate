'use strict';

const SERVICE_NAME = 'Sample';

const opLogger = require('../../libs/op_logger/op_logger.js');
const opErrorCodes = require('../../libs/op_errors/op_error_codes');
const opValidationCodes = require('../../libs/op_errors/op_validation_code');

const userValidator = require('./sample.validator');
const dbConnection = require('../../libs/op_dba/mysql2.class');
const userModel = require('./sample.model');

const user = new userModel('Users');
const dbInstance = new dbConnection();

async function getAllUsers() {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const dbQuery = await user.getAllUsers();
        const dbTrn = await dbInstance.all(dbQuery);
        if (dbTrn.success && dbTrn.data && dbTrn.data.length > 0) {
            returnData.success = true;
            returnData.data = dbTrn.data;
        } else {
            returnData.errors.push({
                code: opValidationCodes.OP_ERR_INTERNAL_SERVER,
                message: `Internal Server Error`
            });
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'getAllUsers', err);
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'getAllUsers');
    }
}

async function findUserByID(userID) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const validateErrors = userValidator.find(userID);
        if (!validateErrors) {
            const dbQuery = await user.findUserByID();
            const dbTrn = await dbInstance.find(dbQuery, userID);
            if (dbTrn.success && dbTrn.data && dbTrn.data.affectedRows > 0) {
                returnData.success = true;
                returnData.data = dbTrn.data;
            } else {
                returnData.errors.push({
                    code: opValidationCodes.OP_FIELD_INVALID_INPUT,
                    message: `'${userID}' user not found!`
                });
            }
        } else {
            returnData.success = false;
            returnData.errors = validateErrors;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'findUserByID', err);
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'findUserByID');
    }
}

async function createUser(data) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const validateErrors = userValidator.create(data);
        if (!validateErrors) {
            const dbQuery = await user.createQuery();
            const dbTrn = await dbInstance.create(dbQuery, data);
            if (dbTrn.success) {
                returnData.success = true;
                returnData.data = {
                    name: `${data.firstName} ${data.lastName}`,
                    username: data.userName,
                    email: data.email,
                    id: dbTrn.data.insertId
                };
            } else {
                returnData.errors.push({
                    code: opValidationCodes.OP_ERR_INTERNAL_SERVER,
                    message: `Internal Server Error`
                });
            }
        } else {
            returnData.success = false;
            returnData.errors = validateErrors;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'createUser', err);
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'createUser');
    }
}

async function updateUser(data, userID) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const validateErrors = userValidator.find(userID);
        if (!validateErrors) {
            const dbQuery = await user.updateQuery('id');
            const dbTrn = await dbInstance.update(dbQuery, [data, userID]);
            if (dbTrn.success && dbTrn.data && dbTrn.data.affectedRows > 0) {
                returnData.success = true;
            } else {
                returnData.errors.push({
                    code: opValidationCodes.OP_FIELD_INVALID_INPUT,
                    message: `User '${userID}' not found!`
                });
            }
        } else {
            returnData.success = false;
            returnData.errors = validateErrors;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'updateUser', err);
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'updateUser');
    }
}

async function deleteUser(userID) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const validateErrors = userValidator.find(userID);
        if (!validateErrors) {
            const dbQuery = await user.deleteQuery('id');
            const dbTrn = await dbInstance.delete(dbQuery, userID);
            if (dbTrn.success && dbTrn.data && dbTrn.data.affectedRows > 0) {
                returnData.success = true;
            } else {
                returnData.errors.push({
                    code: opValidationCodes.OP_FIELD_INVALID_INPUT,
                    message: `User '${userID}' not found!`
                });
            }
        } else {
            returnData.success = false;
            returnData.errors = validateErrors;
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'deleteUser', err);
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'deleteUser');
    }
}

async function getUsersByUuidUsingSP(uuid) {
    let returnData = {
        success: false,
        data: null,
        error_message: null,
        errors: []
    };
    try {
        const dbQuery = await user.getUsersByUuidUsingSP(uuid);
        const dbTrn = await dbInstance.queryExecute(dbQuery);
        if (dbTrn.success && dbTrn.data && dbTrn.data.length > 0) {
            returnData.success = true;
            returnData.data = dbTrn.data;
        } else {
            returnData.errors.push({
                code: opValidationCodes.OP_ERR_INTERNAL_SERVER,
                message: `Internal Server Error`
            });
        }
        return returnData;
    } catch (err) {
        opLogger.logServiceError(SERVICE_NAME, 'getAllUsersUsingSP', err);
        throw opErrorCodes.OP_ERR_SERVICE(SERVICE_NAME, 'getAllUsersUsingSP');
    }
}

module.exports = {
    getAllUsers,
    findUserByID,
    createUser,
    updateUser,
    deleteUser,
    getUsersByUuidUsingSP
};
