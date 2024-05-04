"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrorLike = exports.serializeError = exports.TransactionTimeoutError = exports.TransactionStepTimeoutError = exports.PermanentStepFailureError = void 0;
class PermanentStepFailureError extends Error {
    static isPermanentStepFailureError(error) {
        return (error instanceof PermanentStepFailureError ||
            error?.name === "PermanentStepFailure");
    }
    constructor(message) {
        super(message);
        this.name = "PermanentStepFailure";
    }
}
exports.PermanentStepFailureError = PermanentStepFailureError;
class TransactionStepTimeoutError extends Error {
    static isTransactionStepTimeoutError(error) {
        return (error instanceof TransactionStepTimeoutError ||
            error?.name === "TransactionStepTimeoutError");
    }
    constructor(message) {
        super(message);
        this.name = "TransactionStepTimeoutError";
    }
}
exports.TransactionStepTimeoutError = TransactionStepTimeoutError;
class TransactionTimeoutError extends Error {
    static isTransactionTimeoutError(error) {
        return (error instanceof TransactionTimeoutError ||
            error?.name === "TransactionTimeoutError");
    }
    constructor(message) {
        super(message);
        this.name = "TransactionTimeoutError";
    }
}
exports.TransactionTimeoutError = TransactionTimeoutError;
function serializeError(error) {
    const serialized = {
        message: error.message,
        name: error.name,
        stack: error.stack,
    };
    Object.getOwnPropertyNames(error).forEach((key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!serialized.hasOwnProperty(key)) {
            serialized[key] = error[key];
        }
    });
    return serialized;
}
exports.serializeError = serializeError;
function isErrorLike(value) {
    return (!!value &&
        typeof value === "object" &&
        "name" in value &&
        "message" in value &&
        "stack" in value);
}
exports.isErrorLike = isErrorLike;
//# sourceMappingURL=errors.js.map