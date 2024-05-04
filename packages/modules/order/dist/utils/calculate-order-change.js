"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOrderChange = exports.OrderChangeProcessing = void 0;
const utils_1 = require("@medusajs/utils");
const _types_1 = require("../types");
class OrderChangeProcessing {
    static registerActionType(key, type) {
        OrderChangeProcessing.typeDefinition[key] = type;
    }
    constructor({ order, transactions, actions, }) {
        this.actionsProcessed = {};
        this.groupTotal = {};
        this.order = JSON.parse(JSON.stringify(order));
        this.transactions = JSON.parse(JSON.stringify(transactions ?? []));
        this.actions = JSON.parse(JSON.stringify(actions ?? []));
        const transactionTotal = utils_1.MathBN.add(...transactions.map((tr) => tr.amount));
        (0, utils_1.transformPropertiesToBigNumber)(this.order.metadata);
        this.summary = {
            futureDifference: 0,
            futureTemporaryDifference: 0,
            temporaryDifference: 0,
            pendingDifference: 0,
            futureTemporarySum: 0,
            differenceSum: 0,
            currentOrderTotal: this.order.total ?? 0,
            originalOrderTotal: this.order.total ?? 0,
            transactionTotal,
        };
    }
    isEventActive(action) {
        const status = action.status;
        return (status === undefined ||
            status === _types_1.EVENT_STATUS.PENDING ||
            status === _types_1.EVENT_STATUS.DONE);
    }
    isEventDone(action) {
        const status = action.status;
        return status === _types_1.EVENT_STATUS.DONE;
    }
    isEventPending(action) {
        const status = action.status;
        return status === undefined || status === _types_1.EVENT_STATUS.PENDING;
    }
    processActions() {
        var _a, _b;
        for (const action of this.actions) {
            this.processAction_(action);
        }
        const summary = this.summary;
        for (const action of this.actions) {
            if (!this.isEventActive(action)) {
                continue;
            }
            const type = {
                ...OrderChangeProcessing.defaultConfig,
                ...OrderChangeProcessing.typeDefinition[action.action],
            };
            const amount = utils_1.MathBN.mult(action.amount, type.isDeduction ? -1 : 1);
            if (action.group_id && !action.evaluationOnly) {
                (_a = this.groupTotal)[_b = action.group_id] ?? (_a[_b] = 0);
                this.groupTotal[action.group_id] = utils_1.MathBN.add(this.groupTotal[action.group_id], amount);
            }
            if (type.awaitRequired && !this.isEventDone(action)) {
                if (action.evaluationOnly) {
                    summary.futureTemporarySum = utils_1.MathBN.add(summary.futureTemporarySum, amount);
                }
                else {
                    summary.temporaryDifference = utils_1.MathBN.add(summary.temporaryDifference, amount);
                }
            }
            if (action.evaluationOnly) {
                summary.futureDifference = utils_1.MathBN.add(summary.futureDifference, amount);
            }
            else {
                if (!this.isEventDone(action) && !action.group_id) {
                    summary.differenceSum = utils_1.MathBN.add(summary.differenceSum, amount);
                }
                summary.currentOrderTotal = utils_1.MathBN.add(summary.currentOrderTotal, amount);
            }
        }
        const groupSum = utils_1.MathBN.add(...Object.values(this.groupTotal));
        summary.differenceSum = utils_1.MathBN.add(summary.differenceSum, groupSum);
        summary.transactionTotal = utils_1.MathBN.sum(...this.transactions.map((tr) => tr.amount));
        summary.futureTemporaryDifference = utils_1.MathBN.sub(summary.futureDifference, summary.futureTemporarySum);
        summary.temporaryDifference = utils_1.MathBN.sub(summary.differenceSum, summary.temporaryDifference);
        summary.pendingDifference = utils_1.MathBN.sub(summary.currentOrderTotal, summary.transactionTotal);
    }
    processAction_(action, isReplay = false) {
        var _a, _b, _c;
        const type = {
            ...OrderChangeProcessing.defaultConfig,
            ...OrderChangeProcessing.typeDefinition[action.action],
        };
        (_a = this.actionsProcessed)[_b = action.action] ?? (_a[_b] = []);
        if (!isReplay) {
            this.actionsProcessed[action.action].push(action);
        }
        let previousEvents;
        if (type.commitsAction) {
            previousEvents = (this.actionsProcessed[type.commitsAction] ?? []).filter((ac_) => ac_.reference_id === action.reference_id &&
                ac_.status !== _types_1.EVENT_STATUS.VOIDED);
        }
        let calculatedAmount = action.amount ?? 0;
        const params = {
            actions: this.actions,
            action,
            previousEvents,
            currentOrder: this.order,
            summary: this.summary,
            transactions: this.transactions,
            type,
        };
        if (typeof type.validate === "function") {
            type.validate(params);
        }
        if (typeof type.operation === "function") {
            calculatedAmount = type.operation(params);
            // the action.amount has priority over the calculated amount
            if (!(0, utils_1.isDefined)(action.amount)) {
                action.amount = calculatedAmount ?? 0;
            }
        }
        // If an action commits previous ones, replay them with updated values
        if (type.commitsAction) {
            for (const previousEvent of previousEvents ?? []) {
                this.processAction_(previousEvent, true);
            }
        }
        if (action.resolve) {
            if (action.resolve.reference_id) {
                this.resolveReferences(action);
            }
            const groupId = action.resolve.group_id ?? "__default";
            if (action.resolve.group_id) {
                // resolve all actions in the same group
                this.resolveGroup(action);
            }
            if (action.resolve.amount && !action.evaluationOnly) {
                (_c = this.groupTotal)[groupId] ?? (_c[groupId] = 0);
                this.groupTotal[groupId] = utils_1.MathBN.sub(this.groupTotal[groupId], action.resolve.amount);
            }
        }
        return calculatedAmount;
    }
    resolveReferences(self) {
        const resolve = self.resolve;
        const resolveType = OrderChangeProcessing.typeDefinition[self.action];
        Object.keys(this.actionsProcessed).forEach((actionKey) => {
            const type = OrderChangeProcessing.typeDefinition[actionKey];
            const actions = this.actionsProcessed[actionKey];
            for (const action of actions) {
                if (action === self ||
                    !this.isEventPending(action) ||
                    action.reference_id !== resolve?.reference_id) {
                    continue;
                }
                if (type.revert && (action.evaluationOnly || resolveType.void)) {
                    let previousEvents;
                    if (type.commitsAction) {
                        previousEvents = (this.actionsProcessed[type.commitsAction] ?? []).filter((ac_) => ac_.reference_id === action.reference_id &&
                            ac_.status !== _types_1.EVENT_STATUS.VOIDED);
                    }
                    type.revert({
                        actions: this.actions,
                        action,
                        previousEvents,
                        currentOrder: this.order,
                        summary: this.summary,
                        transactions: this.transactions,
                        type,
                    });
                    for (const previousEvent of previousEvents ?? []) {
                        this.processAction_(previousEvent, true);
                    }
                    action.status =
                        action.evaluationOnly || resolveType.void
                            ? _types_1.EVENT_STATUS.VOIDED
                            : _types_1.EVENT_STATUS.DONE;
                }
            }
        });
    }
    resolveGroup(self) {
        const resolve = self.resolve;
        Object.keys(this.actionsProcessed).forEach((actionKey) => {
            const type = OrderChangeProcessing.typeDefinition[actionKey];
            const actions = this.actionsProcessed[actionKey];
            for (const action of actions) {
                if (!resolve?.group_id || action?.group_id !== resolve.group_id) {
                    continue;
                }
                if (type.revert &&
                    action.status !== _types_1.EVENT_STATUS.DONE &&
                    action.status !== _types_1.EVENT_STATUS.VOIDED &&
                    (action.evaluationOnly || type.void)) {
                    let previousEvents;
                    if (type.commitsAction) {
                        previousEvents = (this.actionsProcessed[type.commitsAction] ?? []).filter((ac_) => ac_.reference_id === action.reference_id &&
                            ac_.status !== _types_1.EVENT_STATUS.VOIDED);
                    }
                    type.revert({
                        actions: this.actions,
                        action: action,
                        previousEvents,
                        currentOrder: this.order,
                        summary: this.summary,
                        transactions: this.transactions,
                        type: OrderChangeProcessing.typeDefinition[action.action],
                    });
                    for (const previousEvent of previousEvents ?? []) {
                        this.processAction_(previousEvent, true);
                    }
                    action.status =
                        action.evaluationOnly || type.void
                            ? _types_1.EVENT_STATUS.VOIDED
                            : _types_1.EVENT_STATUS.DONE;
                }
            }
        });
    }
    getSummary() {
        const summary = this.summary;
        const orderSummary = {
            transactionTotal: new utils_1.BigNumber(summary.transactionTotal),
            originalOrderTotal: new utils_1.BigNumber(summary.originalOrderTotal),
            currentOrderTotal: new utils_1.BigNumber(summary.currentOrderTotal),
            temporaryDifference: new utils_1.BigNumber(summary.temporaryDifference),
            futureDifference: new utils_1.BigNumber(summary.futureDifference),
            futureTemporaryDifference: new utils_1.BigNumber(summary.futureTemporaryDifference),
            pendingDifference: new utils_1.BigNumber(summary.pendingDifference),
            differenceSum: new utils_1.BigNumber(summary.differenceSum),
        };
        /*
        {
          total: summary.currentOrderTotal
          
          subtotal: number
          total_tax: number
    
          ordered_total: summary.originalOrderTotal
          fulfilled_total: number
          returned_total: number
          return_request_total: number
          write_off_total: number
          projected_total: number
    
          net_total: number
          net_subtotal: number
          net_total_tax: number
    
          future_total: number
          future_subtotal: number
          future_total_tax: number
          future_projected_total: number
    
          balance: summary.pendingDifference
          future_balance: number
        }
        */
        return orderSummary;
    }
    getCurrentOrder() {
        return this.order;
    }
}
exports.OrderChangeProcessing = OrderChangeProcessing;
OrderChangeProcessing.typeDefinition = {};
OrderChangeProcessing.defaultConfig = {
    awaitRequired: false,
    isDeduction: false,
};
function calculateOrderChange({ order, transactions = [], actions = [], }) {
    const calc = new OrderChangeProcessing({ order, transactions, actions });
    calc.processActions();
    return {
        summary: calc.getSummary(),
        order: calc.getCurrentOrder(),
    };
}
exports.calculateOrderChange = calculateOrderChange;
//# sourceMappingURL=calculate-order-change.js.map