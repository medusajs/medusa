"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShippingOptionsForCartWorkflow = exports.listShippingOptionsForCartWorkflowId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const use_remote_query_1 = require("../../../common/steps/use-remote-query");
exports.listShippingOptionsForCartWorkflowId = "list-shipping-options-for-cart";
exports.listShippingOptionsForCartWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.listShippingOptionsForCartWorkflowId, (input) => {
    const scLocationFulfillmentSets = (0, use_remote_query_1.useRemoteQueryStep)({
        entry_point: "sales_channels",
        fields: [
            "stock_locations.fulfillment_sets.id",
            "stock_locations.fulfillment_sets.name",
            "stock_locations.fulfillment_sets.price_type",
            "stock_locations.fulfillment_sets.service_zone_id",
            "stock_locations.fulfillment_sets.shipping_profile_id",
            "stock_locations.fulfillment_sets.provider_id",
            "stock_locations.fulfillment_sets.data",
            "stock_locations.fulfillment_sets.amount",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.id",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.name",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.price_type",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.service_zone_id",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.shipping_profile_id",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.provider_id",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.data",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.amount",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.type.id",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.type.label",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.type.description",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.type.code",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.provider.id",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.provider.is_enabled",
            "stock_locations.fulfillment_sets.service_zones.shipping_options.calculated_price.calculated_amount",
        ],
        variables: {
            id: input.sales_channel_id,
            "stock_locations.fulfillment_sets.service_zones.shipping_options": {
                filters: {
                    address: {
                        city: input.shipping_address?.city,
                        country_code: input.shipping_address?.country_code,
                        province_code: input.shipping_address?.province,
                    },
                },
            },
            "stock_locations.fulfillment_sets.service_zones.shipping_options.calculated_price": {
                context: {
                    currency_code: input.currency_code,
                },
            },
        },
    });
    const shippingOptionsWithPrice = (0, workflows_sdk_1.transform)({ options: scLocationFulfillmentSets }, (data) => {
        const optionsMissingPrices = [];
        const options = (0, utils_1.deepFlatMap)(data.options, "stock_locations.fulfillment_sets.service_zones.shipping_options.calculated_price", ({ shipping_options }) => {
            const { calculated_price, ...options } = shipping_options ?? {};
            if (!calculated_price) {
                optionsMissingPrices.push(options.id);
            }
            return {
                ...options,
                amount: calculated_price?.calculated_amount,
            };
        });
        if (optionsMissingPrices.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Shipping options with IDs ${optionsMissingPrices.join(", ")} do not have a price`);
        }
        return options;
    });
    return shippingOptionsWithPrice;
});
