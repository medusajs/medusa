"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresError = void 0;
var PostgresError;
(function (PostgresError) {
    PostgresError["DUPLICATE_ERROR"] = "23505";
    PostgresError["FOREIGN_KEY_ERROR"] = "23503";
    PostgresError["SERIALIZATION_FAILURE"] = "40001";
    PostgresError["NULL_VIOLATION"] = "23502";
})(PostgresError || (exports.PostgresError = PostgresError = {}));
//# sourceMappingURL=postgres-error.js.map