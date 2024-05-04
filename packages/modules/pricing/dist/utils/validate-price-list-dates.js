"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePriceListDates = void 0;
const utils_1 = require("@medusajs/utils");
const validatePriceListDates = (priceListData) => {
    if (!!priceListData.starts_at && !(0, utils_1.isDate)(priceListData.starts_at)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot set price list starts at with with invalid date string: ${priceListData.starts_at}`);
    }
    if (!!priceListData.ends_at && !(0, utils_1.isDate)(priceListData.ends_at)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot set price list ends at with with invalid date string: ${priceListData.ends_at}`);
    }
};
exports.validatePriceListDates = validatePriceListDates;
