"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSessionStatus = exports.PaymentCollectionStatus = void 0;
/* ********** PAYMENT COLLECTION ********** */
/**
 * @enum
 *
 * The payment collection's status.
 */
var PaymentCollectionStatus;
(function (PaymentCollectionStatus) {
    /**
     * The payment collection isn't paid.
     */
    PaymentCollectionStatus["NOT_PAID"] = "not_paid";
    /**
     * The payment sessions in the payment collection are await authorization.
     */
    PaymentCollectionStatus["AWAITING"] = "awaiting";
    /**
     * The payment sessions in the payment collection are authorized.
     */
    PaymentCollectionStatus["AUTHORIZED"] = "authorized";
    /**
     * Some of the payments in the payment collection are authorized.
     */
    PaymentCollectionStatus["PARTIALLY_AUTHORIZED"] = "partially_authorized";
    /**
     * The payments in the payment collection are canceled.
     */
    PaymentCollectionStatus["CANCELED"] = "canceled";
})(PaymentCollectionStatus || (exports.PaymentCollectionStatus = PaymentCollectionStatus = {}));
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
//# sourceMappingURL=common.js.map