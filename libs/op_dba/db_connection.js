'use strict';

const mysql = require('mysql2/promise');
const keys = require('../../config/keys');
const opErrorCodes = require('../op_errors/op_error_codes');

function createPool() {
    try {
        const promisePool = mysql.createPool({
            host: keys.databaseHost,
            user: keys.databaseUser,
            password: keys.databasePassword,
            database: keys.database,
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0
        });

        return promisePool;
    } catch (err) {
        opLogger.error('dbConnection::createPool()::CONNECTION_ERROR::' + err);
        throw opErrorCodes.OP_ERR_DB_CONNECTION();
    }
}

const pool = createPool();

module.exports = {
    connection: async () => pool.getConnection(),
    execute: (...params) => pool.execute(...params)
};
