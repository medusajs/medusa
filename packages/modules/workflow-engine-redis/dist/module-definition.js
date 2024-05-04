"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleDefinition = void 0;
const _services_1 = require("./services");
const connection_1 = __importDefault(require("./loaders/connection"));
const container_1 = __importDefault(require("./loaders/container"));
const redis_1 = __importDefault(require("./loaders/redis"));
const utils_1 = __importDefault(require("./loaders/utils"));
const service = _services_1.WorkflowsModuleService;
const loaders = [
    container_1.default,
    connection_1.default,
    utils_1.default,
    redis_1.default,
];
exports.moduleDefinition = {
    service,
    loaders,
};
