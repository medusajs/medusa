"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollectionStatus = void 0;
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
     * The payment collection is awaiting payment.
     */
    PaymentCollectionStatus["AWAITING"] = "awaiting";
    /**
     * The payment collection is authorized.
     */
    PaymentCollectionStatus["AUTHORIZED"] = "authorized";
    /**
     * Some of the payments in the payment collection are authorized.
     */
    PaymentCollectionStatus["PARTIALLY_AUTHORIZED"] = "partially_authorized";
    /**
     * The payment collection is canceled.
     */
    PaymentCollectionStatus["CANCELED"] = "canceled";
})(PaymentCollectionStatus || (exports.PaymentCollectionStatus = PaymentCollectionStatus = {}));
//# sourceMappingURL=payment-collection.js.map