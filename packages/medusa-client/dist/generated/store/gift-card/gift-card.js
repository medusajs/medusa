"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGiftCardsCode = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a Gift Card by its associated unqiue code.
 * @summary Retrieve Gift Card by Code
 */
var getGiftCardsCode = function (code) {
    return (0, custom_instance_1.getClient)({
        url: "/gift-cards/".concat(code),
        method: "get",
    });
};
exports.getGiftCardsCode = getGiftCardsCode;
//# sourceMappingURL=gift-card.js.map