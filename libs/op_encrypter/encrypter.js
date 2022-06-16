'use strict';

const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();
var algorithm = process.env.ENCRYPT_METHOD;
var secret = process.env.ENCRYPT_SECRET;
const opLogger = require('../op_logger/op_logger.js');

class EncrypterClass {
    constructor() {
        this.algorithm = algorithm;
        this.salt = Buffer.from(Math.random().toString()).toString("base64").substr(0, 40);
        this.key = crypto.createHash('sha256').update(secret + this.salt).digest('hex').substring(0,32);
        this.secret = secret;
    }

    encrypt(clearText) {
        if(clearText !== undefined && clearText !== null && clearText !== ''){
            const iv = Buffer.from(Math.random().toString()).toString("base64").substr(0, 16);
            const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
            const encrypted = cipher.update(clearText, 'utf8', 'base64');

            return [
                Buffer.from(iv).toString('base64'),
                this.salt,
                encrypted + cipher.final('base64'),
            ].join('|');
        }else{
            opLogger.logServiceError(
                'OP_ENCRYPTER',
                'encrypt',
                'clearText can not be null'
            );
            return null;
        }
    }

    decrypt(encryptedText) {
        if(encryptedText !== undefined && encryptedText !== null && encryptedText !== ''){
            const [iv, salt,encrypted ] = encryptedText.split('|');

            if(iv === undefined || iv === null || iv === ''){
                opLogger.logServiceError(
                    'OP_ENCRYPTER',
                    'decrypt',
                    'iv can not be null'
                );
                return null;
            } else if(salt === undefined || salt === null || salt === ''){
                opLogger.logServiceError(
                    'OP_ENCRYPTER',
                    'decrypt',
                    'salt can not be null'
                );
                return null;

            } else if(encrypted === undefined || encrypted === null || encrypted === ''){
                opLogger.logServiceError(
                    'OP_ENCRYPTER',
                    'decrypt',
                    'encryted can not be null'
                );
                return null;

            } else{
                const decipher = crypto.createDecipheriv(
                    this.algorithm,
                    crypto.createHash('sha256').update(secret + salt).digest('hex').substring(0,32),
                    Buffer.from(iv, 'base64')
                );
                decipher.setAutoPadding(false);
                let decryptText =decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8')
                return decryptText.trim().toString().replace(/[^\x20-\x7E]/g, '');

            }
 
        }else{
            opLogger.logServiceError(
                'OP_ENCRYPTER',
                'decrypt',
                'encryptedText can not be null'
            );
            return null;
        }
    }
}
module.exports = EncrypterClass;
