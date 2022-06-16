'use strict';

const mainModel = require('../../libs/op_dba/main_model.class');
const UserTable = [
    {
        Field: 'id',
        Type: 'int',
        Length: 11,
        Nullable: 'NO',
        Key: 'PRI',
        Default: null
    },
    {
        Field: 'firstName',
        Type: 'varchar',
        Length: 255,
        Nullable: 'YES',
        Key: '',
        Default: null
    },
    {
        Field: 'lastName',
        Type: 'varchar',
        Length: 255,
        Nullable: 'YES',
        Key: '',
        Default: null
    },
    {
        Field: 'email',
        Type: 'varchar',
        Length: 255,
        Nullable: 'YES',
        Key: 'MUL',
        Default: null
    },
    {
        Field: 'userName',
        Type: 'varchar',
        Length: 255,
        Nullable: 'YES',
        Key: '',
        Default: null
    }
];

class UserModel extends mainModel {
    constructor(table) {
        super(table);
        this.table = table;
    }

    static getTableProperties() {
        return UserTable;
    }

    getAllUsers() {
        return this.getAllQuery(
            `${UserTable[0].Field},${UserTable[1].Field},${UserTable[2].Field}`
        );
    }

    findUserByID() {
        return this.findByColumnQuery(
            'id',
            `${UserTable[0].Field},${UserTable[1].Field},${UserTable[2].Field},${UserTable[3].Field}`
        );
    }

    getUsersByUuidUsingSP(uuid) {
        return this.executeStoredProcedure('getUserByUuid', uuid);
    }
}

module.exports = UserModel;
