"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doNotForceTransaction = exports.shouldForceTransaction = void 0;
function shouldForceTransaction() {
    return true;
}
exports.shouldForceTransaction = shouldForceTransaction;
function doNotForceTransaction() {
    return false;
}
exports.doNotForceTransaction = doNotForceTransaction;
