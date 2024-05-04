"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLineItemInCartWorkflow = exports.updateLineItemInCartWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const medusa_core_utils_1 = require("medusa-core-utils");
const use_remote_query_1 = require("../../../common/steps/use-remote-query");
const steps_1 = require("../../line-item/steps");
const steps_2 = require("../steps");
const refresh_cart_promotions_1 = require("../steps/refresh-cart-promotions");
const fields_1 = require("../utils/fields");
const prepare_confirm_inventory_input_1 = require("../utils/prepare-confirm-inventory-input");
const refresh_payment_collection_1 = require("./refresh-payment-collection");
// TODO: The UpdateLineItemsWorkflow are missing the following steps:
// - Validate shipping methods for new items (fulfillment module)
exports.updateLineItemInCartWorkflowId = "update-line-item-in-cart";
exports.updateLineItemInCartWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateLineItemInCartWorkflowId, (input) => {
    const variantIds = (0, workflows_sdk_1.transform)({ input }, (data) => {
        return [data.input.item.variant_id];
    });
    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = (0, workflows_sdk_1.transform)({ cart: input.cart }, (data) => {
        return {
            currency_code: data.cart.currency_code,
            region_id: data.cart.region_id,
            customer_id: data.cart.customer_id,
        };
    });
    const variants = (0, use_remote_query_1.useRemoteQueryStep)({
        entry_point: "variants",
        fields: [
            "id",
            "title",
            "sku",
            "barcode",
            "manage_inventory",
            "product.id",
            "product.title",
            "product.description",
            "product.subtitle",
            "product.thumbnail",
            "product.type",
            "product.collection",
            "product.handle",
            "calculated_price.calculated_amount",
            "inventory_items.inventory_item_id",
            "inventory_items.required_quantity",
            "inventory_items.inventory.location_levels.stock_locations.id",
            "inventory_items.inventory.location_levels.stock_locations.name",
            "inventory_items.inventory.location_levels.stock_locations.sales_channels.id",
            "inventory_items.inventory.location_levels.stock_locations.sales_channels.name",
        ],
        variables: {
            id: variantIds,
            calculated_price: {
                context: pricingContext,
            },
        },
        throw_if_key_not_found: true,
    });
    const confirmInventoryInput = (0, workflows_sdk_1.transform)({ input, variants }, (data) => {
        const managedVariants = data.variants.filter((v) => v.manage_inventory);
        if (!managedVariants.length) {
            return { items: [] };
        }
        const productVariantInventoryItems = [];
        const stockLocations = data.variants
            .map((v) => v.inventory_items)
            .flat()
            .map((ii) => {
            productVariantInventoryItems.push({
                variant_id: ii.variant_id,
                inventory_item_id: ii.inventory_item_id,
                required_quantity: ii.required_quantity,
            });
            return ii.inventory.location_levels;
        })
            .flat()
            .map((ll) => ll.stock_locations)
            .flat();
        const salesChannelId = data.input.cart.sales_channel_id;
        if (salesChannelId) {
            const salesChannels = stockLocations
                .map((sl) => sl.sales_channels)
                .flat()
                .filter((sc) => sc.id === salesChannelId);
            if (!salesChannels.length) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `Sales channel ${salesChannelId} is not associated with any stock locations.`);
            }
        }
        const priceNotFound = data.variants
            .filter((v) => !v.calculated_price)
            .map((v) => v.id);
        if (priceNotFound.length) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `Variants with IDs ${priceNotFound.join(", ")} do not have a price`);
        }
        const items = (0, prepare_confirm_inventory_input_1.prepareConfirmInventoryInput)({
            product_variant_inventory_items: productVariantInventoryItems,
            location_ids: stockLocations.map((l) => l.id),
            items: [data.input.item],
            variants: data.variants.map((v) => ({
                id: v.id,
                manage_inventory: v.manage_inventory,
            })),
        });
        return { items };
    });
    (0, steps_2.confirmInventoryStep)(confirmInventoryInput);
    const lineItemUpdate = (0, workflows_sdk_1.transform)({ input, variants }, (data) => {
        const variant = data.variants[0];
        const item = data.input.item;
        return {
            data: {
                ...data.input.update,
                unit_price: variant.calculated_price.calculated_amount,
            },
            selector: {
                id: item.id,
            },
        };
    });
    const result = (0, steps_1.updateLineItemsStep)(lineItemUpdate);
    const cart = (0, use_remote_query_1.useRemoteQueryStep)({
        entry_point: "cart",
        fields: fields_1.cartFieldsForRefreshSteps,
        variables: { id: input.cart.id },
        list: false,
    }).config({ name: "refetch–cart" });
    (0, steps_2.refreshCartShippingMethodsStep)({ cart });
    (0, refresh_cart_promotions_1.refreshCartPromotionsStep)({ id: input.cart.id });
    (0, refresh_payment_collection_1.refreshPaymentCollectionForCartStep)({ cart_id: input.cart.id });
    const updatedItem = (0, workflows_sdk_1.transform)({ result }, (data) => data.result?.[0]);
    return updatedItem;
});
