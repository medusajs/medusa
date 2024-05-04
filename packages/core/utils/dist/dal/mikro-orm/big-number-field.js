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
exports.MikroOrmBigNumberProperty = void 0;
var core_1 = require("@mikro-orm/core");
var common_1 = require("../../common");
var big_number_1 = require("../../totals/big-number");
function MikroOrmBigNumberProperty(options) {
    if (options === void 0) { options = {}; }
    return function (target, columnName) {
        var _a;
        var rawColumnName = (_a = options.rawColumnName) !== null && _a !== void 0 ? _a : "raw_".concat(columnName);
        Object.defineProperty(target, columnName, {
            get: function () {
                var _a, _b;
                var value = (_b = (_a = this.__helper) === null || _a === void 0 ? void 0 : _a.__data) === null || _b === void 0 ? void 0 : _b[columnName];
                if (!value && this[rawColumnName]) {
                    value = new big_number_1.BigNumber(this[rawColumnName].value, {
                        precision: this[rawColumnName].precision,
                    }).numeric;
                }
                return value;
            },
            set: function (value) {
                if ((options === null || options === void 0 ? void 0 : options.nullable) && !(0, common_1.isPresent)(value)) {
                    this.__helper.__data[columnName] = null;
                    this.__helper.__data[rawColumnName];
                    this[rawColumnName] = null;
                }
                else {
                    var bigNumber = void 0;
                    if (value instanceof big_number_1.BigNumber) {
                        bigNumber = value;
                    }
                    else if (this[rawColumnName]) {
                        var precision = this[rawColumnName].precision;
                        bigNumber = new big_number_1.BigNumber(value, {
                            precision: precision,
                        });
                    }
                    else {
                        bigNumber = new big_number_1.BigNumber(value);
                    }
                    var raw = bigNumber.raw;
                    raw.value = (0, common_1.trimZeros)(raw.value);
                    this.__helper.__data[columnName] = bigNumber.numeric;
                    this.__helper.__data[rawColumnName] = raw;
                    this[rawColumnName] = raw;
                }
                // This is custom code to keep track of which fields are bignumber, as well as their data
                if (!this.__helper.__bignumberdata) {
                    this.__helper.__bignumberdata = {};
                }
                this.__helper.__bignumberdata[columnName] =
                    this.__helper.__data[columnName];
                this.__helper.__bignumberdata[rawColumnName] =
                    this.__helper.__data[rawColumnName];
                this.__helper.__touched = !this.__helper.hydrator.isRunning();
            },
            enumerable: true,
            configurable: true,
        });
        (0, core_1.Property)(__assign({ type: "any", columnType: "numeric", trackChanges: false }, options))(target, columnName);
    };
}
exports.MikroOrmBigNumberProperty = MikroOrmBigNumberProperty;
//# sourceMappingURL=big-number-field.js.map