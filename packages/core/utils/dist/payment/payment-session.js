"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSessionStatus = void 0;
/**
 * @enum
 *
 * The status of a payment session.
 */
var PaymentSessionStatus;
(function (PaymentSessionStatus) {
    /**
     * The payment is authorized.
     */
    PaymentSessionStatus["AUTHORIZED"] = "authorized";
    /**
     * The payment is pending.
     */
    PaymentSessionStatus["PENDING"] = "pending";
    /**
     * The payment requires an action.
     */
    PaymentSessionStatus["REQUIRES_MORE"] = "requires_more";
    /**
     * An error occurred while processing the payment.
     */
    PaymentSessionStatus["ERROR"] = "error";
    /**
     * The payment is canceled.
     */
    PaymentSessionStatus["CANCELED"] = "canceled";
})(PaymentSessionStatus || (exports.PaymentSessionStatus = PaymentSessionStatus = {}));
//# sourceMappingURL=payment-session.js.map