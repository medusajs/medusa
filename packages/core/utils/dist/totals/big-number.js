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
exports.BigNumber = void 0;
var bignumber_js_1 = require("bignumber.js");
var common_1 = require("../common");
var BigNumber = /** @class */ (function () {
    function BigNumber(rawValue, options) {
        this.setRawValueOrThrow(rawValue, options);
    }
    BigNumber.prototype.setRawValueOrThrow = function (rawValue, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, precision = _c.precision;
        precision !== null && precision !== void 0 ? precision : (precision = BigNumber.DEFAULT_PRECISION);
        if (rawValue instanceof BigNumber) {
            Object.assign(this, rawValue);
        }
        else if (bignumber_js_1.BigNumber.isBigNumber(rawValue)) {
            /**
             * Example:
             *  const bnUnitValue = new BigNumberJS("10.99")
             *  const unitValue = new BigNumber(bnUnitValue)
             */
            this.numeric_ = rawValue.toNumber();
            this.raw_ = {
                value: rawValue.toPrecision(precision),
                precision: precision,
            };
            this.bignumber_ = rawValue;
        }
        else if ((0, common_1.isString)(rawValue)) {
            /**
             * Example: const unitValue = "1234.1234"
             */
            var bigNum = new bignumber_js_1.BigNumber(rawValue);
            this.numeric_ = bigNum.toNumber();
            this.raw_ = this.raw_ = {
                value: bigNum.toPrecision(precision),
                precision: precision,
            };
            this.bignumber_ = bigNum;
        }
        else if ((0, common_1.isBigNumber)(rawValue)) {
            /**
             * Example: const unitValue = { value: "1234.1234" }
             */
            var definedPrecision = (_b = rawValue.precision) !== null && _b !== void 0 ? _b : precision;
            var bigNum = new bignumber_js_1.BigNumber(rawValue.value);
            this.numeric_ = bigNum.toNumber();
            this.raw_ = __assign(__assign({}, rawValue), { precision: definedPrecision });
            this.bignumber_ = bigNum;
        }
        else if (typeof rawValue === "number" && !Number.isNaN(rawValue)) {
            /**
             * Example: const unitValue = 1234
             */
            this.numeric_ = rawValue;
            var bigNum = new bignumber_js_1.BigNumber(rawValue);
            this.raw_ = {
                value: bigNum.toPrecision(precision),
                precision: precision,
            };
            this.bignumber_ = bigNum;
        }
        else {
            throw new Error("Invalid BigNumber value: ".concat(rawValue, ". Should be one of: string, number, BigNumber (bignumber.js), BigNumberRawValue"));
        }
    };
    Object.defineProperty(BigNumber.prototype, "numeric", {
        get: function () {
            var raw = this.raw_;
            if (raw) {
                return new bignumber_js_1.BigNumber(raw.value).toNumber();
            }
            else {
                return this.numeric_;
            }
        },
        set: function (value) {
            var newValue = new BigNumber(value);
            this.numeric_ = newValue.numeric_;
            this.raw_ = newValue.raw_;
            this.bignumber_ = newValue.bignumber_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigNumber.prototype, "raw", {
        get: function () {
            return this.raw_;
        },
        set: function (rawValue) {
            var newValue = new BigNumber(rawValue);
            this.numeric_ = newValue.numeric_;
            this.raw_ = newValue.raw_;
            this.bignumber_ = newValue.bignumber_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigNumber.prototype, "bigNumber", {
        get: function () {
            return this.bignumber_;
        },
        enumerable: false,
        configurable: true
    });
    BigNumber.prototype.toJSON = function () {
        var _a;
        return this.bignumber_
            ? (_a = this.bignumber_) === null || _a === void 0 ? void 0 : _a.toNumber()
            : this.raw_
                ? new bignumber_js_1.BigNumber(this.raw_.value).toNumber()
                : this.numeric_;
    };
    BigNumber.prototype.valueOf = function () {
        return this.numeric_;
    };
    BigNumber.DEFAULT_PRECISION = 20;
    return BigNumber;
}());
exports.BigNumber = BigNumber;
//# sourceMappingURL=big-number.js.map