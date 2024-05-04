"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateCartTotals = void 0;
var big_number_1 = require("../big-number");
var line_item_1 = require("../line-item");
var math_1 = require("../math");
var shipping_method_1 = require("../shipping-method");
var transform_properties_to_bignumber_1 = require("../transform-properties-to-bignumber");
function decorateCartTotals(cartLike, config) {
    var _a, _b, _c;
    if (config === void 0) { config = {}; }
    (0, transform_properties_to_bignumber_1.transformPropertiesToBigNumber)(cartLike);
    var items = ((_a = cartLike.items) !== null && _a !== void 0 ? _a : []);
    var shippingMethods = ((_b = cartLike.shipping_methods) !== null && _b !== void 0 ? _b : []);
    var includeTax = (config === null || config === void 0 ? void 0 : config.includeTaxes) || ((_c = cartLike.region) === null || _c === void 0 ? void 0 : _c.automatic_taxes);
    var itemsTotals = (0, line_item_1.getLineItemsTotals)(items, {
        includeTax: includeTax,
    });
    var shippingMethodsTotals = (0, shipping_method_1.getShippingMethodsTotals)(shippingMethods, {
        includeTax: includeTax,
    });
    var subtotal = math_1.MathBN.convert(0);
    var discountTotal = math_1.MathBN.convert(0);
    var discountTaxTotal = math_1.MathBN.convert(0);
    var itemsSubtotal = math_1.MathBN.convert(0);
    var itemsTotal = math_1.MathBN.convert(0);
    var itemsOriginalTotal = math_1.MathBN.convert(0);
    var itemsOriginalSubtotal = math_1.MathBN.convert(0);
    var itemsTaxTotal = math_1.MathBN.convert(0);
    var itemsOriginalTaxTotal = math_1.MathBN.convert(0);
    var shippingSubtotal = math_1.MathBN.convert(0);
    var shippingTotal = math_1.MathBN.convert(0);
    var shippingOriginalTotal = math_1.MathBN.convert(0);
    var shippingOriginalSubtotal = math_1.MathBN.convert(0);
    var shippingTaxTotal = math_1.MathBN.convert(0);
    var shippingTaxSubTotal = math_1.MathBN.convert(0);
    var shippingOriginalTaxTotal = math_1.MathBN.convert(0);
    var shippingOriginalTaxSubtotal = math_1.MathBN.convert(0);
    var cartItems = items.map(function (item, index) {
        var _a, _b;
        var itemTotals = Object.assign(item, (_b = itemsTotals[(_a = item.id) !== null && _a !== void 0 ? _a : index]) !== null && _b !== void 0 ? _b : {});
        var itemSubtotal = itemTotals.subtotal;
        var itemTotal = math_1.MathBN.convert(itemTotals.total);
        var itemOriginalTotal = math_1.MathBN.convert(itemTotals.original_total);
        var itemTaxTotal = math_1.MathBN.convert(itemTotals.tax_total);
        var itemOriginalTaxTotal = math_1.MathBN.convert(itemTotals.original_tax_total);
        var itemDiscountTotal = math_1.MathBN.convert(itemTotals.discount_total);
        var itemDiscountTaxTotal = math_1.MathBN.convert(itemTotals.discount_tax_total);
        subtotal = math_1.MathBN.add(subtotal, itemSubtotal);
        discountTotal = math_1.MathBN.add(discountTotal, itemDiscountTotal);
        discountTaxTotal = math_1.MathBN.add(discountTaxTotal, itemDiscountTaxTotal);
        itemsTotal = math_1.MathBN.add(itemsTotal, itemTotal);
        itemsOriginalTotal = math_1.MathBN.add(itemsOriginalTotal, itemOriginalTotal);
        itemsOriginalSubtotal = math_1.MathBN.add(itemsOriginalSubtotal, itemSubtotal);
        itemsSubtotal = math_1.MathBN.add(itemsSubtotal, itemSubtotal);
        itemsTaxTotal = math_1.MathBN.add(itemsTaxTotal, itemTaxTotal);
        itemsOriginalTaxTotal = math_1.MathBN.add(itemsOriginalTaxTotal, itemOriginalTaxTotal);
        return itemTotals;
    });
    var cartShippingMethods = shippingMethods.map(function (shippingMethod, index) {
        var _a, _b;
        var methodTotals = Object.assign(shippingMethod, (_b = shippingMethodsTotals[(_a = shippingMethod.id) !== null && _a !== void 0 ? _a : index]) !== null && _b !== void 0 ? _b : {});
        var methodSubtotal = math_1.MathBN.convert(methodTotals.subtotal);
        var methodTotal = math_1.MathBN.convert(methodTotals.total);
        var methodOriginalTotal = math_1.MathBN.convert(methodTotals.original_total);
        var methodTaxTotal = math_1.MathBN.convert(methodTotals.tax_total);
        var methodOriginalTaxTotal = math_1.MathBN.convert(methodTotals.original_tax_total);
        var methodDiscountTotal = math_1.MathBN.convert(methodTotals.discount_total);
        var methodDiscountTaxTotal = math_1.MathBN.convert(methodTotals.discount_tax_total);
        shippingSubtotal = math_1.MathBN.add(shippingSubtotal, methodSubtotal);
        shippingTotal = math_1.MathBN.add(shippingTotal, methodTotal);
        shippingOriginalTotal = math_1.MathBN.add(shippingOriginalTotal, methodOriginalTotal);
        shippingOriginalSubtotal = math_1.MathBN.add(shippingOriginalSubtotal, methodSubtotal);
        shippingTaxTotal = math_1.MathBN.add(shippingTaxTotal, methodTaxTotal);
        shippingOriginalTaxTotal = math_1.MathBN.add(shippingOriginalTaxTotal, methodOriginalTaxTotal);
        shippingOriginalTaxSubtotal = math_1.MathBN.add(shippingOriginalTaxSubtotal, methodSubtotal);
        discountTotal = math_1.MathBN.add(discountTotal, methodDiscountTotal);
        discountTaxTotal = math_1.MathBN.add(discountTaxTotal, methodDiscountTaxTotal);
        return methodTotals;
    });
    var taxTotal = math_1.MathBN.add(itemsTaxTotal, shippingTaxTotal);
    var originalTaxTotal = math_1.MathBN.add(itemsOriginalTaxTotal, shippingOriginalTaxTotal);
    // TODO: Gift Card calculations
    var originalTempTotal = math_1.MathBN.add(subtotal, shippingOriginalTotal, originalTaxTotal);
    var originalTotal = math_1.MathBN.sub(originalTempTotal, discountTotal);
    // TODO: subtract (cart.gift_card_total + cart.gift_card_tax_total)
    var tempTotal = math_1.MathBN.add(subtotal, shippingTotal, taxTotal);
    var total = math_1.MathBN.sub(tempTotal, discountTotal);
    var cart = cartLike;
    cart.total = new big_number_1.BigNumber(total);
    cart.subtotal = new big_number_1.BigNumber(subtotal);
    cart.tax_total = new big_number_1.BigNumber(taxTotal);
    cart.discount_total = new big_number_1.BigNumber(discountTotal);
    cart.discount_tax_total = new big_number_1.BigNumber(discountTaxTotal);
    // cart.gift_card_total = giftCardTotal.total || 0
    // cart.gift_card_tax_total = giftCardTotal.tax_total || 0
    cart.original_total = new big_number_1.BigNumber(originalTotal);
    cart.original_tax_total = new big_number_1.BigNumber(originalTaxTotal);
    // cart.original_gift_card_total =
    // cart.original_gift_card_tax_total =
    if (cartLike.items) {
        cart.items = cartItems;
        cart.item_total = new big_number_1.BigNumber(itemsTotal);
        cart.item_subtotal = new big_number_1.BigNumber(itemsSubtotal);
        cart.item_tax_total = new big_number_1.BigNumber(itemsTaxTotal);
        cart.original_item_total = new big_number_1.BigNumber(itemsOriginalTotal);
        cart.original_item_subtotal = new big_number_1.BigNumber(itemsOriginalSubtotal);
        cart.original_item_tax_total = new big_number_1.BigNumber(itemsOriginalTaxTotal);
    }
    if (cart.shipping_methods) {
        cart.shipping_methods = cartShippingMethods;
        cart.shipping_total = new big_number_1.BigNumber(shippingTotal);
        cart.shipping_subtotal = new big_number_1.BigNumber(shippingSubtotal);
        cart.shipping_tax_total = new big_number_1.BigNumber(shippingTaxTotal);
        cart.original_shipping_tax_total = new big_number_1.BigNumber(shippingOriginalTaxTotal);
        cart.original_shipping_tax_subtotal = new big_number_1.BigNumber(shippingOriginalTaxSubtotal);
        cart.original_shipping_total = new big_number_1.BigNumber(shippingOriginalTotal);
    }
    return cart;
}
exports.decorateCartTotals = decorateCartTotals;
//# sourceMappingURL=index.js.map