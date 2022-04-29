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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __importDefault(require("./client"));
var admin_1 = __importDefault(require("./resources/admin"));
var store_1 = __importDefault(require("./resources/store"));
var Medusa = /** @class */ (function (_super) {
    __extends(Medusa, _super);
    function Medusa(config) {
        var _this = _super.call(this) || this;
        _this.client_ = new client_1.default(config);
        _this.admin = new admin_1.default();
        Medusa.instance = _this;
        return _this;
    }
    Medusa.getInstance = function () {
        return this.instance;
    };
    Medusa.prototype.handleRequest = function (config) {
        return this.client_.request(config);
    };
    return Medusa;
}(store_1.default));
exports.default = Medusa;
//# sourceMappingURL=index.js.map