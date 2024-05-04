"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModuleService = exports.LinkService = void 0;
__exportStar(require("./dynamic-service-class"), exports);
var link_1 = require("./link");
Object.defineProperty(exports, "LinkService", { enumerable: true, get: function () { return __importDefault(link_1).default; } });
var link_module_service_1 = require("./link-module-service");
Object.defineProperty(exports, "LinkModuleService", { enumerable: true, get: function () { return __importDefault(link_module_service_1).default; } });
