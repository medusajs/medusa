"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrdersWorkflow = exports.createOrdersWorkflowId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const common_1 = require("../../common");
const confirm_inventory_1 = require("../../definition/cart/steps/confirm-inventory");
const find_one_or_any_region_1 = require("../../definition/cart/steps/find-one-or-any-region");
const find_or_create_customer_1 = require("../../definition/cart/steps/find-or-create-customer");
const find_sales_channel_1 = require("../../definition/cart/steps/find-sales-channel");
const get_variant_price_sets_1 = require("../../definition/cart/steps/get-variant-price-sets");
const get_variants_1 = require("../../definition/cart/steps/get-variants");
const validate_variants_existence_1 = require("../../definition/cart/steps/validate-variants-existence");
const prepare_confirm_inventory_input_1 = require("../../definition/cart/utils/prepare-confirm-inventory-input");
const prepare_line_item_data_1 = require("../../definition/cart/utils/prepare-line-item-data");
const steps_1 = require("../steps");
const prepare_custom_line_item_data_1 = require("../utils/prepare-custom-line-item-data");
exports.createOrdersWorkflowId = "create-orders";
exports.createOrdersWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createOrdersWorkflowId, (input) => {
    const variantIds = (0, workflows_sdk_1.transform)({ input }, (data) => {
        return (data.input.items ?? [])
            .map((item) => item.variant_id)
            .filter(Boolean);
    });
    const [salesChannel, region, customerData] = (0, workflows_sdk_1.parallelize)((0, find_sales_channel_1.findSalesChannelStep)({
        salesChannelId: input.sales_channel_id,
    }), (0, find_one_or_any_region_1.findOneOrAnyRegionStep)({
        regionId: input.region_id,
    }), (0, find_or_create_customer_1.findOrCreateCustomerStep)({
        customerId: input.customer_id,
        email: input.email,
    }), (0, validate_variants_existence_1.validateVariantsExistStep)({ variantIds }));
    const variants = (0, get_variants_1.getVariantsStep)({
        filter: { id: variantIds },
        config: {
            select: [
                "id",
                "title",
                "sku",
                "manage_inventory",
                "barcode",
                "product.id",
                "product.title",
                "product.description",
                "product.subtitle",
                "product.thumbnail",
                "product.type",
                "product.collection",
                "product.handle",
            ],
            relations: ["product"],
        },
    });
    const salesChannelLocations = (0, common_1.useRemoteQueryStep)({
        entry_point: "sales_channels",
        fields: ["id", "name", "stock_locations.id", "stock_locations.name"],
        variables: { id: salesChannel.id },
    });
    const productVariantInventoryItems = (0, common_1.useRemoteQueryStep)({
        entry_point: "product_variant_inventory_items",
        fields: ["variant_id", "inventory_item_id", "required_quantity"],
        variables: { variant_id: variantIds },
    }).config({ name: "inventory-items" });
    const confirmInventoryInput = (0, workflows_sdk_1.transform)({ productVariantInventoryItems, salesChannelLocations, input, variants }, (data) => {
        if (!data.input.items) {
            return { items: [] };
        }
        if (!data.salesChannelLocations.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Sales channel ${data.input.sales_channel_id} is not associated with any stock locations.`);
        }
        const items = (0, prepare_confirm_inventory_input_1.prepareConfirmInventoryInput)({
            product_variant_inventory_items: data.productVariantInventoryItems,
            location_ids: data.salesChannelLocations[0].stock_locations.map((l) => l.id),
            items: data.input.items,
            variants: data.variants.map((v) => ({
                id: v.id,
                manage_inventory: v.manage_inventory,
            })),
        });
        return { items };
    });
    (0, confirm_inventory_1.confirmInventoryStep)(confirmInventoryInput);
    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = (0, workflows_sdk_1.transform)({ input, region, customerData }, (data) => {
        return {
            currency_code: data.input.currency_code ?? data.region.currency_code,
            region_id: data.region.id,
            customer_id: data.customerData.customer?.id,
        };
    });
    const priceSets = (0, get_variant_price_sets_1.getVariantPriceSetsStep)({
        variantIds,
        context: pricingContext,
    });
    const orderInput = (0, workflows_sdk_1.transform)({ input, region, customerData, salesChannel }, (data) => {
        const data_ = {
            ...data.input,
            currency_code: data.input.currency_code ?? data.region.currency_code,
            region_id: data.region.id,
        };
        if (data.customerData.customer?.id) {
            data_.customer_id = data.customerData.customer.id;
            data_.email = data.input?.email ?? data.customerData.customer.email;
        }
        if (data.salesChannel?.id) {
            data_.sales_channel_id = data.salesChannel.id;
        }
        return data_;
    });
    const lineItems = (0, workflows_sdk_1.transform)({ priceSets, input, variants }, (data) => {
        const items = (data.input.items ?? []).map((item) => {
            const variant = data.variants.find((v) => v.id === item.variant_id);
            if (!variant) {
                return (0, prepare_custom_line_item_data_1.prepareCustomLineItemData)({
                    variant: {
                        ...item,
                    },
                    unitPrice: utils_1.MathBN.max(0, item.unit_price),
                    quantity: item.quantity,
                    metadata: item?.metadata ?? {},
                });
            }
            return (0, prepare_line_item_data_1.prepareLineItemData)({
                variant: variant,
                unitPrice: utils_1.MathBN.max(0, item.unit_price ??
                    data.priceSets[item.variant_id]?.calculated_amount),
                quantity: item.quantity,
                metadata: item?.metadata ?? {},
                taxLines: item.tax_lines || [],
                adjustments: item.adjustments || [],
            });
        });
        return items;
    });
    const orderToCreate = (0, workflows_sdk_1.transform)({ lineItems, orderInput }, (data) => {
        return {
            ...data.orderInput,
            items: data.lineItems,
        };
    });
    const orders = (0, steps_1.createOrdersStep)([orderToCreate]);
    const order = (0, workflows_sdk_1.transform)({ orders }, (data) => data.orders?.[0]);
    /* TODO: Implement Order promotions
    refreshOrderPromotionsStep({
      id: order.id,
      promo_codes: input.promo_codes,
    })
    */
    (0, steps_1.updateOrderTaxLinesStep)({ order_id: order.id });
    return order;
});
