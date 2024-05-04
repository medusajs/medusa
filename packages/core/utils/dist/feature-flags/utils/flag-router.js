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
exports.FlagRouter = void 0;
var common_1 = require("../../common");
var FlagRouter = /** @class */ (function () {
    function FlagRouter(flags) {
        this.flags = {};
        this.flags = flags;
    }
    /**
     * Check if a feature flag is enabled.
     * There are two ways of using this method:
     * 1. `isFeatureEnabled("myFeatureFlag")`
     * 2. `isFeatureEnabled({ myNestedFeatureFlag: "someNestedFlag" })`
     * We use 1. for top-level feature flags and 2. for nested feature flags. Almost all flags are top-level.
     * An example of a nested flag is workflows. To use it, you would do:
     * `isFeatureEnabled({ workflows: Workflows.CreateCart })`
     * @param flag - The flag to check
     * @return {boolean} - Whether the flag is enabled or not
     */
    FlagRouter.prototype.isFeatureEnabled = function (flag) {
        var _this = this;
        var _a;
        if ((0, common_1.isObject)(flag)) {
            var _b = __read(Object.entries(flag)[0], 2), nestedFlag = _b[0], value = _b[1];
            if (typeof this.flags[nestedFlag] === "boolean") {
                return this.flags[nestedFlag];
            }
            return !!((_a = this.flags[nestedFlag]) === null || _a === void 0 ? void 0 : _a[value]);
        }
        var flags = (Array.isArray(flag) ? flag : [flag]);
        return flags.every(function (flag_) {
            if (!(0, common_1.isString)(flag_)) {
                throw Error("Flag must be a string an array of string or an object");
            }
            return !!_this.flags[flag_];
        });
    };
    /**
     * Sets a feature flag.
     * Flags take two shapes:
     * `setFlag("myFeatureFlag", true)`
     * `setFlag("myFeatureFlag", { nestedFlag: true })`
     * These shapes are used for top-level and nested flags respectively, as explained in isFeatureEnabled.
     * @param key - The key of the flag to set.
     * @param value - The value of the flag to set.
     * @return {void} - void
     */
    FlagRouter.prototype.setFlag = function (key, value) {
        if ((0, common_1.isObject)(value)) {
            var existing = this.flags[key];
            if (!existing) {
                this.flags[key] = value;
                return;
            }
            this.flags[key] = __assign(__assign({}, this.flags[key]), value);
            return;
        }
        this.flags[key] = value;
    };
    FlagRouter.prototype.listFlags = function () {
        return Object.entries(this.flags || {}).map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return ({
                key: key,
                value: value,
            });
        });
    };
    return FlagRouter;
}());
exports.FlagRouter = FlagRouter;
//# sourceMappingURL=flag-router.js.map