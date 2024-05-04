#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/stable");
require("regenerator-runtime/runtime");
const os_1 = __importDefault(require("os"));
const util_1 = __importDefault(require("util"));
const create_cli_1 = __importDefault(require("./create-cli"));
const useJsonLogger = process.argv.slice(2).some((arg) => arg.includes(`json`));
if (useJsonLogger) {
    process.env.GATSBY_LOGGER = `json`;
}
// Ensure stable runs on Windows when started from different shells (i.e. c:\dir vs C:\dir)
if (os_1.default.platform() === `win32`) {
    // ensureWindowsDriveLetterIsUppercase()
}
// Check if update is available
// updateNotifier({ pkg }).notify({ isGlobal: true })
const MIN_NODE_VERSION = `10.13.0`;
process.on(`unhandledRejection`, (reason) => {
    // This will exit the process in newer Node anyway so lets be consistent
    // across versions and crash
    // reason can be anything, it can be a message, an object, ANYTHING!
    // we convert it to an error object, so we don't crash on structured error validation
    if (!(reason instanceof Error)) {
        reason = new Error(util_1.default.format(reason));
    }
    console.log(reason);
    // report.panic(`UNHANDLED REJECTION`, reason as Error)
});
process.on(`uncaughtException`, (error) => {
    console.log(error);
    // report.panic(`UNHANDLED EXCEPTION`, error)
});
(0, create_cli_1.default)(process.argv);
//# sourceMappingURL=index.js.map