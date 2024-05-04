"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPsqlIndexStatementHelper = void 0;
var core_1 = require("@mikro-orm/core");
/**
 * Create a PSQL index statement
 * @param name The name of the index, if not provided it will be generated in the format IDX_tableName_columnName
 * @param tableName The name of the table
 * @param columns The columns to index
 * @param type The type of index (e.g GIN, GIST, BTREE, etc)
 * @param where The where clause
 * @param unique If the index should be a unique index
 *
 * @example
 * createPsqlIndexStatementHelper({
 *   name: "idx_user_email",
 *   tableName: "user",
 *   columns: "email",
 *   type: "btree",
 *   where: "email IS NOT NULL"
 * });
 *
 * // expression:  CREATE INDEX IF NOT EXISTS idx_user_email ON user USING btree (email) WHERE email IS NOT NULL;
 *
 * createPsqlIndexStatementHelper({
 *   name: "idx_user_email",
 *   tableName: "user",
 *   columns: "email"
 * });
 *
 * // expression: CREATE INDEX IF NOT EXISTS idx_user_email ON user (email);
 *
 */
function createPsqlIndexStatementHelper(_a) {
    var name = _a.name, tableName = _a.tableName, columns = _a.columns, type = _a.type, where = _a.where, unique = _a.unique;
    var columnsName = Array.isArray(columns) ? columns.join("_") : columns;
    columns = Array.isArray(columns) ? columns.join(", ") : columns;
    name = name || "IDX_".concat(tableName, "_").concat(columnsName).concat(unique ? "_unique" : "");
    var typeStr = type ? " USING ".concat(type) : "";
    var optionsStr = where ? " WHERE ".concat(where) : "";
    var uniqueStr = unique ? "UNIQUE " : "";
    var expression = "CREATE ".concat(uniqueStr, "INDEX IF NOT EXISTS \"").concat(name, "\" ON \"").concat(tableName, "\"").concat(typeStr, " (").concat(columns, ")").concat(optionsStr);
    return {
        toString: function () {
            return expression;
        },
        valueOf: function () {
            return expression;
        },
        name: name,
        expression: expression,
        MikroORMIndex: function (options) {
            return (0, core_1.Index)(__assign({ name: name, expression: expression }, options));
        },
    };
}
exports.createPsqlIndexStatementHelper = createPsqlIndexStatementHelper;
//# sourceMappingURL=create-psql-index-helper.js.map