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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesChannelHandlers = exports.RegionHandlers = exports.ProductHandlers = exports.MiddlewaresHandlers = exports.InventoryHandlers = exports.CustomerHandlers = exports.CommonHandlers = exports.AddressHandlers = void 0;
exports.AddressHandlers = __importStar(require("./address"));
exports.CommonHandlers = __importStar(require("./common"));
exports.CustomerHandlers = __importStar(require("./customer"));
exports.InventoryHandlers = __importStar(require("./inventory"));
exports.MiddlewaresHandlers = __importStar(require("./middlewares"));
exports.ProductHandlers = __importStar(require("./product"));
exports.RegionHandlers = __importStar(require("./region"));
exports.SalesChannelHandlers = __importStar(require("./sales-channel"));
