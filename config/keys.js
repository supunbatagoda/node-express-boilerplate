'use strict';
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    databaseHost: process.env.DATABASE_HOST,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    serverOs: process.env.SERVER_OS
};
