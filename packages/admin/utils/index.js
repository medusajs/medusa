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
exports.__esModule = true;
exports.loadConfig = exports.getPluginPaths = void 0;
var get_plugin_paths_1 = require("./get-plugin-paths");
__createBinding(exports, get_plugin_paths_1, "getPluginPaths");
var load_config_1 = require("./load-config");
__createBinding(exports, load_config_1, "loadConfig");
