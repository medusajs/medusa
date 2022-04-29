"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGiftCardsGiftCard = exports.getGiftCardsGiftCard = exports.deleteGiftCardsGiftCard = exports.getGiftCards = exports.postGiftCards = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Gift Card that can redeemed by its unique code. The Gift Card is only valid within 1 region.
 * @summary Create a Gift Card
 */
var postGiftCards = function (postGiftCardsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/gift-cards",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postGiftCardsBody,
    });
};
exports.postGiftCards = postGiftCards;
/**
 * Retrieves a list of Gift Cards.
 * @summary List Gift Cards
 */
var getGiftCards = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/gift-cards", method: "get" });
};
exports.getGiftCards = getGiftCards;
/**
 * Deletes a Gift Card
 * @summary Delete a Gift Card
 */
var deleteGiftCardsGiftCard = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/gift-cards/".concat(id),
        method: "delete",
    });
};
exports.deleteGiftCardsGiftCard = deleteGiftCardsGiftCard;
/**
 * Retrieves a Gift Card.
 * @summary Retrieve a Gift Card
 */
var getGiftCardsGiftCard = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/gift-cards/".concat(id),
        method: "get",
    });
};
exports.getGiftCardsGiftCard = getGiftCardsGiftCard;
/**
 * Creates a Gift Card that can redeemed by its unique code. The Gift Card is only valid within 1 region.
 * @summary Create a Gift Card
 */
var postGiftCardsGiftCard = function (id, postGiftCardsGiftCardBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/gift-cards/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postGiftCardsGiftCardBody,
    });
};
exports.postGiftCardsGiftCard = postGiftCardsGiftCard;
//# sourceMappingURL=gift-card.js.map