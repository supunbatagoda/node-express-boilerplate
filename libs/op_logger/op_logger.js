const pino = require('pino');
const moment = require('moment');
const { colorizerFactory, prettifier } = require('pino-pretty');
const levelColorize = colorizerFactory(true);

//log levels
//'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.
//
// trace: 10,
// debug: 20,
// info: 30,
// warn: 40,
// error: 50,
// fatal: 60

// Create a logging instance
const devLogger = pino(
    {
        name: 'OP_DEV',
        enabled: process.env.NODE_ENV === 'production' ? false : true,
        prettifier: require('pino-colada')
    }
    //pino.destination({ dest: './logs/dev-logs', sync: false })
);

// Create a logging instance
const prodLogger = pino(
    {
        name: 'OP_PROD',
        level: 'warn',
        prettifier: require('pino-colada')
        // enabled: process.env.NODE_ENV === 'production' ? true : true,
    }
    // pino.destination({ dest: './logs/op-logs', sync: false })
);

function logServiceError(serviceName, methodName, message) {
    prodLogger.error(
        'SERVICE_ERROR::' +
            serviceName +
            '::' +
            methodName +
            '::' +
            message +
            '::'
    );
}

function logControllerError(controllerName, methodName, message) {
    prodLogger.error(
        'CONTROLLER_ERROR::' +
            controllerName +
            '::' +
            methodName +
            '::' +
            message +
            '::'
    );
}

function error(message) {
    prodLogger.error('ERROR::' + message + '::');
}

function info(message) {
    prodLogger.info('INFO::' + message + '::');
}

const logOptions = {
    level: 'info',
    prettyPrint: {
        colorize: false,
        levelFirst: true,
        singleLine: false,
        ignore: 'pid,hostname,filename',
        translateTime: 'SYS:standard'
    }
};

const logOp = {
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            singleLine: false,
            ignore: 'pid,hostname,filename',
            translateTime: 'SYS:standard',
            messageKey: 'msg',
            destination: 2
        }
    }
};

const fileLogger = (path) =>
    pino(logOptions, pino.destination({ dest: `./logs/${path}`, sync: false }));
// const logger = pino({ base: undefined }, pinoPretty({ destination: 2, colorize: true }))

function logFileLogger(msg, path) {
    var currentDate = moment().format('YYYY-MM-DD');
    fileLogger(`${currentDate}.${path}`).info({ msg });
}

module.exports = {
    opDevLogger: devLogger,
    opLogger: prodLogger,
    logServiceError: logServiceError,
    logControllerError: logControllerError,
    error: error,
    info: info,
    logFileLogger
};
