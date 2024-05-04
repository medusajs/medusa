"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedusaError = exports.MedusaErrorCodes = exports.MedusaErrorTypes = void 0;
/**
 * @typedef MedusaErrorType
 *
 */
exports.MedusaErrorTypes = {
    /** Errors stemming from the database */
    DB_ERROR: "database_error",
    DUPLICATE_ERROR: "duplicate_error",
    INVALID_ARGUMENT: "invalid_argument",
    INVALID_DATA: "invalid_data",
    UNAUTHORIZED: "unauthorized",
    NOT_FOUND: "not_found",
    NOT_ALLOWED: "not_allowed",
    UNEXPECTED_STATE: "unexpected_state",
    CONFLICT: "conflict",
    PAYMENT_AUTHORIZATION_ERROR: "payment_authorization_error",
};
exports.MedusaErrorCodes = {
    INSUFFICIENT_INVENTORY: "insufficient_inventory",
    CART_INCOMPATIBLE_STATE: "cart_incompatible_state",
};
/**
 * Standardized error to be used across Medusa project.
 * @extends Error
 */
var MedusaError = /** @class */ (function (_super) {
    __extends(MedusaError, _super);
    /**
     * Creates a standardized error to be used across Medusa project.
     * @param {string} type - type of error
     * @param {string} message - message to go along with error
     * @param {string} code - code of error
     * @param {Array} params - params
     */
    function MedusaError(type, message, code) {
        var params = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            params[_i - 3] = arguments[_i];
        }
        var _this = _super.apply(this, __spreadArray([], __read(params), false)) || this;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MedusaError);
        }
        _this.type = type;
        _this.code = code;
        _this.message = message;
        _this.date = new Date();
        return _this;
    }
    MedusaError.Types = exports.MedusaErrorTypes;
    MedusaError.Codes = exports.MedusaErrorCodes;
    return MedusaError;
}(Error));
exports.MedusaError = MedusaError;
//# sourceMappingURL=errors.js.map