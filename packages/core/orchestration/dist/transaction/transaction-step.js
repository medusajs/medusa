"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStep = void 0;
const utils_1 = require("@medusajs/utils");
const types_1 = require("./types");
/**
 * @class TransactionStep
 * @classdesc A class representing a single step in a transaction flow
 */
class TransactionStep {
    constructor() {
        /**
         * @member id - The id of the step
         * @member depth - The depth of the step in the flow
         * @member definition - The definition of the step
         * @member invoke - The current state and status of the invoke action of the step
         * @member compensate - The current state and status of the compensate action of the step
         * @member attempts - The number of attempts made to execute the step
         * @member failures - The number of failures encountered while executing the step
         * @member lastAttempt - The timestamp of the last attempt made to execute the step
         * @member hasScheduledRetry - A flag indicating if a retry has been scheduled
         * @member retryRescheduledAt - The timestamp of the last retry scheduled
         * @member next - The ids of the next steps in the flow
         * @member saveResponse - A flag indicating if the response of a step should be shared in the transaction context and available to subsequent steps - default is true
         */
        this.stepFailed = false;
    }
    getStates() {
        return this.isCompensating() ? this.compensate : this.invoke;
    }
    beginCompensation() {
        if (this.isCompensating()) {
            return;
        }
        this.stepFailed = true;
        this.attempts = 0;
        this.failures = 0;
        this.lastAttempt = null;
    }
    isCompensating() {
        return this.stepFailed;
    }
    isInvoking() {
        return !this.stepFailed;
    }
    changeState(toState) {
        const allowed = {
            [utils_1.TransactionStepState.DORMANT]: [utils_1.TransactionStepState.NOT_STARTED],
            [utils_1.TransactionStepState.NOT_STARTED]: [
                utils_1.TransactionStepState.INVOKING,
                utils_1.TransactionStepState.COMPENSATING,
                utils_1.TransactionStepState.FAILED,
                utils_1.TransactionStepState.SKIPPED,
            ],
            [utils_1.TransactionStepState.INVOKING]: [
                utils_1.TransactionStepState.FAILED,
                utils_1.TransactionStepState.DONE,
                utils_1.TransactionStepState.TIMEOUT,
            ],
            [utils_1.TransactionStepState.COMPENSATING]: [
                utils_1.TransactionStepState.REVERTED,
                utils_1.TransactionStepState.FAILED,
            ],
            [utils_1.TransactionStepState.DONE]: [utils_1.TransactionStepState.COMPENSATING],
        };
        const curState = this.getStates();
        if (curState.state === toState ||
            allowed?.[curState.state]?.includes(toState)) {
            curState.state = toState;
            return;
        }
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Updating State from "${curState.state}" to "${toState}" is not allowed.`);
    }
    changeStatus(toStatus) {
        const allowed = {
            [types_1.TransactionStepStatus.WAITING]: [
                types_1.TransactionStepStatus.OK,
                types_1.TransactionStepStatus.TEMPORARY_FAILURE,
                types_1.TransactionStepStatus.PERMANENT_FAILURE,
            ],
            [types_1.TransactionStepStatus.TEMPORARY_FAILURE]: [
                types_1.TransactionStepStatus.IDLE,
                types_1.TransactionStepStatus.PERMANENT_FAILURE,
            ],
            [types_1.TransactionStepStatus.PERMANENT_FAILURE]: [types_1.TransactionStepStatus.IDLE],
        };
        const curState = this.getStates();
        if (curState.status === toStatus ||
            toStatus === types_1.TransactionStepStatus.WAITING ||
            allowed?.[curState.status]?.includes(toStatus)) {
            curState.status = toStatus;
            return;
        }
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Updating Status from "${curState.status}" to "${toStatus}" is not allowed.`);
    }
    hasRetryScheduled() {
        return !!this.hasScheduledRetry;
    }
    hasRetryInterval() {
        return !!this.definition.retryInterval;
    }
    hasTimeout() {
        return !!this.getTimeout();
    }
    getTimeout() {
        return this.definition.timeout;
    }
    canRetry() {
        return (!this.definition.retryInterval ||
            !!(this.lastAttempt &&
                this.definition.retryInterval &&
                Date.now() - this.lastAttempt > this.definition.retryInterval * 1e3));
    }
    hasAwaitingRetry() {
        return !!this.definition.retryIntervalAwaiting;
    }
    canRetryAwaiting() {
        return !!(this.hasAwaitingRetry() &&
            this.lastAttempt &&
            Date.now() - this.lastAttempt >
                this.definition.retryIntervalAwaiting * 1e3);
    }
    canInvoke(flowState) {
        const { status, state } = this.getStates();
        return ((!this.isCompensating() &&
            state === utils_1.TransactionStepState.NOT_STARTED &&
            flowState === types_1.TransactionState.INVOKING) ||
            status === types_1.TransactionStepStatus.TEMPORARY_FAILURE);
    }
    canCompensate(flowState) {
        return (this.isCompensating() &&
            this.getStates().state === utils_1.TransactionStepState.NOT_STARTED &&
            flowState === types_1.TransactionState.COMPENSATING);
    }
    canCancel() {
        return (!this.isCompensating() &&
            [
                types_1.TransactionStepStatus.WAITING,
                types_1.TransactionStepStatus.TEMPORARY_FAILURE,
            ].includes(this.getStates().status));
    }
}
exports.TransactionStep = TransactionStep;
//# sourceMappingURL=transaction-step.js.map