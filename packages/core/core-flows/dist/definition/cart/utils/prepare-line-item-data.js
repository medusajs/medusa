"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareAdjustmentsData = exports.prepareTaxLinesData = exports.prepareLineItemData = void 0;
function prepareLineItemData(data) {
    const { variant, unitPrice, quantity, metadata, cartId, taxLines, adjustments, } = data;
    if (!variant.product) {
        throw new Error("Variant does not have a product");
    }
    const lineItem = {
        quantity,
        title: variant.title,
        subtitle: variant.product.title,
        thumbnail: variant.product.thumbnail,
        product_id: variant.product.id,
        product_title: variant.product.title,
        product_description: variant.product.description,
        product_subtitle: variant.product.subtitle,
        product_type: variant.product.type?.[0].value ?? null,
        product_collection: variant.product.collection?.[0]?.value ?? null,
        product_handle: variant.product.handle,
        variant_id: variant.id,
        variant_sku: variant.sku,
        variant_barcode: variant.barcode,
        variant_title: variant.title,
        unit_price: unitPrice,
        metadata,
    };
    if (taxLines) {
        lineItem.tax_lines = prepareTaxLinesData(taxLines);
    }
    if (adjustments) {
        lineItem.adjustments = prepareAdjustmentsData(adjustments);
    }
    if (cartId) {
        lineItem.cart_id = cartId;
    }
    return lineItem;
}
exports.prepareLineItemData = prepareLineItemData;
function prepareTaxLinesData(data) {
    return data.map((d) => ({
        description: d.description,
        tax_rate_id: d.tax_rate_id,
        code: d.code,
        rate: d.rate,
        provider_id: d.provider_id,
    }));
}
exports.prepareTaxLinesData = prepareTaxLinesData;
function prepareAdjustmentsData(data) {
    return data.map((d) => ({
        code: d.code,
        amount: d.amount,
        description: d.description,
        promotion_id: d.promotion_id,
        provider_id: d.promotion_id,
    }));
}
exports.prepareAdjustmentsData = prepareAdjustmentsData;
