"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleDefinition = void 0;
const _services_1 = require("./services");
const connection_1 = __importDefault(require("./loaders/connection"));
const container_1 = __importDefault(require("./loaders/container"));
const service = _services_1.SalesChannelModuleService;
const loaders = [container_1.default, connection_1.default];
exports.moduleDefinition = {
    service,
    loaders,
};
