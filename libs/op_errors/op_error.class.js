const { format } = require('util');

class OpErrorClass extends Error {
    constructor(opErrCode, message, a, b, c, statusCode = 500) {
        if (!opErrCode) throw new Error('OP error code must not be empty');
        if (!message) throw new Error('OP error message must not be empty');

        opErrCode = opErrCode.toUpperCase();

        let msg = message;
        if (a && b && c) {
            msg = format(message, a, b, c);
        } else if (a && b) {
            msg = format(message, a, b);
        } else if (a) {
            msg = format(message, a);
        }
        super(msg);
        this.statusCode = statusCode;
        this.opErrCode = opErrCode;
        this.opErrMessage = msg;
        Error.captureStackTrace(this, this.constructor);
    }

    static createError(opErrCode, message, a, b, c, statusCode = 500) {
        if (!(this instanceof OpErrorClass)) {
            return new OpErrorClass(opErrCode, message, a, b, c, statusCode);
        }
    }
}
module.exports = OpErrorClass;
