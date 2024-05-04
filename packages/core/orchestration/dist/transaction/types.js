"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributedTransactionEvent = exports.TransactionStepStatus = exports.TransactionState = exports.TransactionHandlerType = void 0;
var utils_1 = require("@medusajs/utils");
Object.defineProperty(exports, "TransactionHandlerType", { enumerable: true, get: function () { return utils_1.TransactionHandlerType; } });
Object.defineProperty(exports, "TransactionState", { enumerable: true, get: function () { return utils_1.TransactionState; } });
Object.defineProperty(exports, "TransactionStepStatus", { enumerable: true, get: function () { return utils_1.TransactionStepStatus; } });
var DistributedTransactionEvent;
(function (DistributedTransactionEvent) {
    DistributedTransactionEvent["BEGIN"] = "begin";
    DistributedTransactionEvent["RESUME"] = "resume";
    DistributedTransactionEvent["COMPENSATE_BEGIN"] = "compensateBegin";
    DistributedTransactionEvent["FINISH"] = "finish";
    DistributedTransactionEvent["TIMEOUT"] = "timeout";
    DistributedTransactionEvent["STEP_BEGIN"] = "stepBegin";
    DistributedTransactionEvent["STEP_SUCCESS"] = "stepSuccess";
    DistributedTransactionEvent["STEP_FAILURE"] = "stepFailure";
    DistributedTransactionEvent["STEP_AWAITING"] = "stepAwaiting";
    DistributedTransactionEvent["COMPENSATE_STEP_SUCCESS"] = "compensateStepSuccess";
    DistributedTransactionEvent["COMPENSATE_STEP_FAILURE"] = "compensateStepFailure";
})(DistributedTransactionEvent || (exports.DistributedTransactionEvent = DistributedTransactionEvent = {}));
//# sourceMappingURL=types.js.map