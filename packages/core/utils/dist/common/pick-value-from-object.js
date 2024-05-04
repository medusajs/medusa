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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickValueFromObject = void 0;
var is_object_1 = require("./is-object");
function pickValueFromObject(path, object) {
    var e_1, _a;
    var segments = path.split(".");
    var result = undefined;
    var _loop_1 = function (segment) {
        var segmentsLeft = __spreadArray([], __read(segments), false).splice(1, segments.length - 1);
        var segmentOutput = object[segment];
        if (segmentsLeft.length === 0) {
            result = segmentOutput;
            return "break";
        }
        if ((0, is_object_1.isObject)(segmentOutput)) {
            result = pickValueFromObject(segmentsLeft.join("."), segmentOutput);
            return "break";
        }
        if (Array.isArray(segmentOutput)) {
            result = segmentOutput
                .map(function (segmentOutput_) {
                return pickValueFromObject(segmentsLeft.join("."), segmentOutput_);
            })
                .flat();
            return "break";
        }
        result = segmentOutput;
    };
    try {
        for (var segments_1 = __values(segments), segments_1_1 = segments_1.next(); !segments_1_1.done; segments_1_1 = segments_1.next()) {
            var segment = segments_1_1.value;
            var state_1 = _loop_1(segment);
            if (state_1 === "break")
                break;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (segments_1_1 && !segments_1_1.done && (_a = segments_1.return)) _a.call(segments_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
exports.pickValueFromObject = pickValueFromObject;
//# sourceMappingURL=pick-value-from-object.js.map