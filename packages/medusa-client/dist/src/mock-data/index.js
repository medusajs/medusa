"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixtures = void 0;
var fixtures_json_1 = __importDefault(require("./fixtures.json"));
var resources = fixtures_json_1.default["resources"];
exports.fixtures = {
    get: function (entity) {
        return resources[entity];
    },
    list: function (entity, number) {
        if (number === void 0) { number = 2; }
        return Array(number)
            .fill(null)
            .map(function (_) { return exports.fixtures.get(entity); });
    },
};
//# sourceMappingURL=index.js.map