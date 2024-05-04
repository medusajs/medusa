"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbErrorMapper = void 0;
var core_1 = require("@mikro-orm/core");
var common_1 = require("../../common");
var dbErrorMapper = function (err) {
    var _a;
    if (err instanceof core_1.NotFoundError) {
        console.log(err);
        throw new common_1.MedusaError(common_1.MedusaError.Types.NOT_FOUND, err.message);
    }
    if (err instanceof core_1.UniqueConstraintViolationException ||
        err.code === "23505") {
        var info_1 = getConstraintInfo(err);
        if (!info_1) {
            throw err;
        }
        throw new common_1.MedusaError(common_1.MedusaError.Types.INVALID_DATA, "".concat((0, common_1.upperCaseFirst)(info_1.table.split("_").join(" ")), " with ").concat(info_1.keys
            .map(function (key, i) { return "".concat(key, ": ").concat(info_1.values[i]); })
            .join(", "), " already exists."));
    }
    if (err instanceof core_1.NotNullConstraintViolationException ||
        err.code === "23502") {
        throw new common_1.MedusaError(common_1.MedusaError.Types.INVALID_DATA, "Cannot set field '".concat(err.column, "' of ").concat((0, common_1.upperCaseFirst)(err.table.split("_").join(" ")), " to null"));
    }
    if (err instanceof core_1.InvalidFieldNameException ||
        err.code === "42703") {
        var userFriendlyMessage = (_a = err.message.match(/(column.*)/)) === null || _a === void 0 ? void 0 : _a[0];
        throw new common_1.MedusaError(common_1.MedusaError.Types.INVALID_DATA, userFriendlyMessage !== null && userFriendlyMessage !== void 0 ? userFriendlyMessage : err.message);
    }
    if (err instanceof core_1.ForeignKeyConstraintViolationException ||
        err.code === "23503") {
        var info_2 = getConstraintInfo(err);
        throw new common_1.MedusaError(common_1.MedusaError.Types.NOT_FOUND, "You tried to set relationship ".concat(info_2 === null || info_2 === void 0 ? void 0 : info_2.keys.map(function (key, i) { return "".concat(key, ": ").concat(info_2.values[i]); }), ", but such entity does not exist"));
    }
    throw err;
};
exports.dbErrorMapper = dbErrorMapper;
var getConstraintInfo = function (err) {
    var detail = err.detail;
    if (!detail) {
        return null;
    }
    var _a = __read(detail.match(/\([^\(.]*\)/g) || [], 2), keys = _a[0], values = _a[1];
    if (!keys || !values) {
        return null;
    }
    return {
        table: err.table.split("_").join(" "),
        keys: keys
            .substring(1, keys.length - 1)
            .split(",")
            .map(function (k) { return k.trim(); }),
        values: values
            .substring(1, values.length - 1)
            .split(",")
            .map(function (v) { return v.trim(); }),
    };
};
//# sourceMappingURL=db-error-mapper.js.map