"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
exports.MathBN = void 0;
var bignumber_js_1 = require("bignumber.js");
var common_1 = require("../common");
var big_number_1 = require("./big-number");
var MathBN = /** @class */ (function () {
    function MathBN() {
    }
    MathBN.convert = function (num) {
        if (num == null) {
            return new bignumber_js_1.BigNumber(0);
        }
        if (num instanceof big_number_1.BigNumber) {
            return num.bigNumber;
        }
        else if (num instanceof bignumber_js_1.BigNumber) {
            return num;
        }
        else if ((0, common_1.isDefined)(num === null || num === void 0 ? void 0 : num.value)) {
            return new bignumber_js_1.BigNumber(num.value);
        }
        return new bignumber_js_1.BigNumber(num);
    };
    MathBN.add = function () {
        var e_1, _a;
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        var sum = new bignumber_js_1.BigNumber(0);
        try {
            for (var nums_1 = __values(nums), nums_1_1 = nums_1.next(); !nums_1_1.done; nums_1_1 = nums_1.next()) {
                var num = nums_1_1.value;
                var n = MathBN.convert(num);
                sum = sum.plus(n);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nums_1_1 && !nums_1_1.done && (_a = nums_1.return)) _a.call(nums_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return sum;
    };
    MathBN.sum = function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        return MathBN.add.apply(MathBN, __spreadArray([0], __read((nums !== null && nums !== void 0 ? nums : [0])), false));
    };
    MathBN.sub = function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        var agg = MathBN.convert(nums[0]);
        for (var i = 1; i < nums.length; i++) {
            var n = MathBN.convert(nums[i]);
            agg = agg.minus(n);
        }
        return agg;
    };
    MathBN.mult = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.times(num2);
    };
    MathBN.div = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.dividedBy(num2);
    };
    MathBN.abs = function (n) {
        var num = MathBN.convert(n);
        return num.absoluteValue();
    };
    MathBN.mod = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.modulo(num2);
    };
    MathBN.exp = function (n, exp) {
        if (exp === void 0) { exp = 2; }
        var num = MathBN.convert(n);
        var expBy = MathBN.convert(exp);
        return num.exponentiatedBy(expBy);
    };
    MathBN.min = function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        return bignumber_js_1.BigNumber.minimum.apply(bignumber_js_1.BigNumber, __spreadArray([], __read(nums.map(function (num) { return MathBN.convert(num); })), false));
    };
    MathBN.max = function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        return bignumber_js_1.BigNumber.maximum.apply(bignumber_js_1.BigNumber, __spreadArray([], __read(nums.map(function (num) { return MathBN.convert(num); })), false));
    };
    MathBN.gt = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.isGreaterThan(num2);
    };
    MathBN.gte = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.isGreaterThanOrEqualTo(num2);
    };
    MathBN.lt = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.isLessThan(num2);
    };
    MathBN.lte = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.isLessThanOrEqualTo(num2);
    };
    MathBN.eq = function (n1, n2) {
        var num1 = MathBN.convert(n1);
        var num2 = MathBN.convert(n2);
        return num1.isEqualTo(num2);
    };
    return MathBN;
}());
exports.MathBN = MathBN;
//# sourceMappingURL=math.js.map