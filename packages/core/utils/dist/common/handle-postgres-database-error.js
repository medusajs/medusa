"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePostgresDatabaseError = exports.DatabaseErrorCode = void 0;
var os_1 = require("os");
exports.DatabaseErrorCode = {
    databaseDoesNotExist: "3D000",
    connectionFailure: "ECONNREFUSED",
    wrongCredentials: "28000",
    notFound: "ENOTFOUND",
    migrationMissing: "42P01",
};
function handlePostgresDatabaseError(err) {
    if (exports.DatabaseErrorCode.databaseDoesNotExist === err.code) {
        throw new Error("The specified PostgreSQL database does not exist. Please create it and try again.".concat(os_1.EOL).concat(err.message));
    }
    if (exports.DatabaseErrorCode.connectionFailure === err.code) {
        throw new Error("Failed to establish a connection to PostgreSQL. Please ensure the following is true and try again:\n      - You have a PostgreSQL database running\n      - You have passed the correct credentials in medusa-config.js\n      - You have formatted the database connection string correctly. See below:\n      \"postgres://[username]:[password]@[host]:[post]/[db_name]\" - If there is no password, you can omit it from the connection string\n      ".concat(os_1.EOL, "\n      ").concat(err.message));
    }
    if (exports.DatabaseErrorCode.wrongCredentials === err.code) {
        throw new Error("The specified credentials does not exists for the specified PostgreSQL database.".concat(os_1.EOL).concat(err.message));
    }
    if (exports.DatabaseErrorCode.notFound === err.code) {
        throw new Error("The specified connection string for your PostgreSQL database might have illegal characters. Please check that it only contains allowed characters [a-zA-Z0-9]".concat(os_1.EOL).concat(err.message));
    }
    if (exports.DatabaseErrorCode.migrationMissing === err.code) {
        throw new Error("Migrations missing. Please run 'medusa migrations run' and try again.");
    }
    throw err;
}
exports.handlePostgresDatabaseError = handlePostgresDatabaseError;
//# sourceMappingURL=handle-postgres-database-error.js.map