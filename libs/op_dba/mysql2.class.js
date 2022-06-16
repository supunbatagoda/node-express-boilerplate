'use strict';

const opLogger = require('../op_logger/op_logger');
const opErrorCodes = require('../op_errors/op_error_codes');

const dbConnection = require('./db_connection');

class mySql2PromisesClass {
    async create(query, data) {
        try {
            const connection = await dbConnection.connection();
            try {
                await connection.beginTransaction();
                const [rows] = await connection.query(query, [data]);
                await connection.commit();
                return { success: true, data: rows };
            } catch (err) {
                await connection.rollback();
                opLogger.error(
                    'mySql2PromisesClass::create()::EXECUTION_ERROR::' + err
                );
                throw opErrorCodes.OP_ERR_DB_EXECUTION();
            } finally {
                await connection.release();
            }
            return { success: false };
        } catch (err) {
            opLogger.error(
                'mySql2PromisesClass::create()::CONNECTION_ERROR::' + err
            );
            throw opErrorCodes.OP_ERR_DB_CONNECTION();
        }
    }

    async update(query, data) {
        try {
            const connection = await dbConnection.connection();
            try {
                await connection.beginTransaction();
                const [rows] = await connection.query(query, data);
                await connection.commit();
                return { success: true, data: rows };
            } catch (err) {
                await connection.rollback();
                opLogger.error(
                    'mySql2PromisesClass::update()::EXECUTION_ERROR::' + err
                );
                throw opErrorCodes.OP_ERR_DB_EXECUTION();
            } finally {
                await connection.release();
            }
            return { success: false };
        } catch (err) {
            opLogger.error(
                'mySql2PromisesClass::update()::CONNECTION_ERROR::' + err
            );
            throw opErrorCodes.OP_ERR_DB_CONNECTION();
        }
    }

    async delete(query, id) {
        try {
            const connection = await dbConnection.connection();
            try {
                await connection.beginTransaction();
                const [rows] = await connection.query(query, [id]);
                await connection.commit();
                return { success: true, data: rows };
            } catch (ex) {
                await connection.rollback();
                opLogger.error(
                    'mySql2PromisesClass::delete()::EXECUTION_ERROR::' + err
                );
                throw opErrorCodes.OP_ERR_DB_EXECUTION();
            } finally {
                await connection.release();
            }
            return { success: false };
        } catch (err) {
            opLogger.error(
                'mySql2PromisesClass::delete()::CONNECTION_ERROR::' + err
            );
            throw opErrorCodes.OP_ERR_DB_CONNECTION();
        }
    }

    async find(query, ids) {
        try {
            const connection = await dbConnection.connection();
            try {
                await connection.beginTransaction();
                let [findOne] = await connection.query(query, [ids]);
                await connection.commit();
                return { success: true, data: findOne[0] };
            } catch (err) {
                opLogger.error(
                    'mySql2PromisesClass::find()::EXECUTION_ERROR::' + err
                );
                throw opErrorCodes.OP_ERR_DB_EXECUTION();
            } finally {
                await connection.release();
            }
            return { success: false };
        } catch (err) {
            opLogger.error(
                'mySql2PromisesClass::find()::CONNECTION_ERROR::' + err
            );
            throw opErrorCodes.OP_ERR_DB_CONNECTION();
        }
    }

    async all(query) {
        try {
            const connection = await dbConnection.connection();
            try {
                await connection.beginTransaction();
                let all = await connection.query(query);
                await connection.commit();
                return { success: true, data: all[0] };
            } catch (err) {
                opLogger.error(
                    'mySql2PromisesClass::all()::EXECUTION_ERROR::' + err
                );
                throw opErrorCodes.OP_ERR_DB_EXECUTION();
            } finally {
                await connection.release();
            }
            return { success: false };
        } catch (err) {
            opLogger.error(
                'mySql2PromisesClass::all()::CONNECTION_ERROR::' + err
            );
            throw opErrorCodes.OP_ERR_DB_CONNECTION();
        }
    }

    async queryExecute(query) {
        try {
            const connection = await dbConnection.connection();
            try {
                await connection.beginTransaction();
                let all = await connection.query(query);
                await connection.commit();
                return { success: true, data: all[0] };
            } catch (err) {
                opLogger.error(
                    'mySql2PromisesClass::queryExecute()::EXECUTION_ERROR::' +
                        err
                );
                throw opErrorCodes.OP_ERR_DB_EXECUTION();
            } finally {
                await connection.release();
            }
            return { success: false };
        } catch (err) {
            opLogger.error(
                'mySql2PromisesClass::queryExecute()::CONNECTION_ERROR::' + err
            );
            throw opErrorCodes.OP_ERR_DB_CONNECTION();
        }
    }
}
module.exports = mySql2PromisesClass;
