"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
var _1 = __importDefault(require("."));
var getClient = function (config) {
    return _1.default.getInstance().handleRequest(config);
};
exports.getClient = getClient;
//# sourceMappingURL=custom-instance.js.map