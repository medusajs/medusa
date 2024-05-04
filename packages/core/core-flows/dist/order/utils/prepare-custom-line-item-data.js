"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareCustomLineItemData = void 0;
function prepareCustomLineItemData(data) {
    const { variant, unitPrice, quantity, metadata } = data;
    const lineItem = {
        quantity,
        title: variant.title,
        variant_sku: variant.sku,
        variant_barcode: variant.barcode,
        variant_title: variant.title,
        unit_price: unitPrice,
        metadata,
    };
    return lineItem;
}
exports.prepareCustomLineItemData = prepareCustomLineItemData;
