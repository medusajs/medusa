"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceListType = exports.PriceListStatus = void 0;
/**
 * @enum
 *
 * The price list's status.
 */
var PriceListStatus;
(function (PriceListStatus) {
    /**
     * The price list is enabled and its prices can be used.
     */
    PriceListStatus["ACTIVE"] = "active";
    /**
     * The price list is disabled, meaning its prices can't be used yet.
     */
    PriceListStatus["DRAFT"] = "draft";
})(PriceListStatus || (exports.PriceListStatus = PriceListStatus = {}));
/**
 * @enum
 *
 * The price list's type.
 */
var PriceListType;
(function (PriceListType) {
    /**
     * The price list's prices are used for a sale.
     */
    PriceListType["SALE"] = "sale";
    /**
     * The price list's prices override original prices. This affects the calculated price of associated price sets.
     */
    PriceListType["OVERRIDE"] = "override";
})(PriceListType || (exports.PriceListType = PriceListType = {}));
//# sourceMappingURL=price-list.js.map