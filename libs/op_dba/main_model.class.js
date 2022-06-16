'use strict';

class mainModel {
    tableName;

    constructor(tableName) {
        this.tableName = tableName;
    }

    getAllQuery(fields) {
        return `SELECT ${fields} FROM ${this.tableName}`;
    }
    createQuery() {
        return `INSERT INTO ${this.tableName} SET ?`;
    }
    updateQuery(field) {
        return `UPDATE ${this.tableName} SET ? WHERE ${this.tableName}.${field} = ?`;
    }
    deleteQuery(field) {
        return `DELETE FROM ${this.tableName} WHERE ${this.tableName}.${field} = ?`;
    }
    findByColumnQuery(column, fields = false) {
        return `SELECT ${fields} from ${this.tableName} WHERE ${column} IN (?)`;
    }
    storedProcedureQuery(storedProcedureName, fields = null) {
        if (fields != null) {
            return `CALL ${storedProcedureName}('${fields}')`;
        } else {
            return `CALL ${storedProcedureName}()`;
        }
    }
}
module.exports = mainModel;
