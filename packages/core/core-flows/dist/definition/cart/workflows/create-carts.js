"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCartWorkflow = exports.createCartWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const medusa_core_utils_1 = require("medusa-core-utils");
const use_remote_query_1 = require("../../../common/steps/use-remote-query");
const steps_1 = require("../steps");
const refresh_cart_promotions_1 = require("../steps/refresh-cart-promotions");
const update_tax_lines_1 = require("../steps/update-tax-lines");
const prepare_confirm_inventory_input_1 = require("../utils/prepare-confirm-inventory-input");
const prepare_line_item_data_1 = require("../utils/prepare-line-item-data");
const refresh_payment_collection_1 = require("./refresh-payment-collection");
// TODO: The createCartWorkflow are missing the following steps:
// - Refresh/delete shipping methods (fulfillment module)
exports.createCartWorkflowId = "create-cart";
exports.createCartWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createCartWorkflowId, (input) => {
    const variantIds = (0, workflows_sdk_1.transform)({ input }, (data) => {
        return (data.input.items ?? []).map((i) => i.variant_id);
    });
    const [salesChannel, region, customerData] = (0, workflows_sdk_1.parallelize)((0, steps_1.findSalesChannelStep)({
        salesChannelId: input.sales_channel_id,
    }), (0, steps_1.findOneOrAnyRegionStep)({
        regionId: input.region_id,
    }), (0, steps_1.findOrCreateCustomerStep)({
        customerId: input.customer_id,
        email: input.email,
    }));
    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = (0, workflows_sdk_1.transform)({ input, region, customerData }, (data) => {
        return {
            currency_code: data.input.currency_code ?? data.region.currency_code,
            region_id: data.region.id,
            customer_id: data.customerData.customer?.id,
        };
    });
    const variants = (0, use_remote_query_1.useRemoteQueryStep)({
        entry_point: "variants",
        fields: [
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
    const confirmInventoryInput = (0, workflows_sdk_1.transform)({ input, salesChannel, variants }, (data) => {
        const managedVariants = data.variants.filter((v) => v.manage_inventory);
        if (!managedVariants.length) {
            return { items: [] };
        }
        const productVariantInventoryItems = [];
        const stockLocations = managedVariants
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
        const salesChannelId = data.salesChannel?.id;
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
            items: data.input.items,
            variants: data.variants.map((v) => ({
                id: v.id,
                manage_inventory: v.manage_inventory,
            })),
        });
        return { items };
    });
    (0, steps_1.confirmInventoryStep)(confirmInventoryInput);
    const priceSets = (0, steps_1.getVariantPriceSetsStep)({
        variantIds,
        context: pricingContext,
    });
    const cartInput = (0, workflows_sdk_1.transform)({ input, region, customerData, salesChannel }, (data) => {
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
            return (0, prepare_line_item_data_1.prepareLineItemData)({
                variant: variant,
                unitPrice: data.priceSets[item.variant_id].calculated_amount,
                quantity: item.quantity,
                metadata: item?.metadata ?? {},
            });
        });
        return items;
    });
    const cartToCreate = (0, workflows_sdk_1.transform)({ lineItems, cartInput }, (data) => {
        return {
            ...data.cartInput,
            items: data.lineItems,
        };
    });
    const carts = (0, steps_1.createCartsStep)([cartToCreate]);
    const cart = (0, workflows_sdk_1.transform)({ carts }, (data) => data.carts?.[0]);
    (0, refresh_cart_promotions_1.refreshCartPromotionsStep)({
        id: cart.id,
        promo_codes: input.promo_codes,
    });
    (0, update_tax_lines_1.updateTaxLinesStep)({ cart_or_cart_id: cart.id });
    (0, refresh_payment_collection_1.refreshPaymentCollectionForCartStep)({
        cart_id: cart.id,
    });
    return cart;
});
