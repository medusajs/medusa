"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var randomatic_1 = __importDefault(require("randomatic"));
var IdMap = /** @class */ (function () {
    function IdMap() {
        this.ids = {};
    }
    IdMap.prototype.getId = function (key, prefix, length) {
        if (prefix === void 0) { prefix = ""; }
        if (length === void 0) { length = 10; }
        if (this.ids[key]) {
            return this.ids[key];
        }
        var id = "".concat(prefix && prefix + "_").concat((0, randomatic_1.default)("Aa0", length));
        this.ids[key] = id;
        return id;
    };
    return IdMap;
}());
var instance = new IdMap();
exports.default = instance;
//# sourceMappingURL=id-map.js.map