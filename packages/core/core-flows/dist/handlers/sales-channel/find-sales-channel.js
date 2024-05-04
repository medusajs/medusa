"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSalesChannel = void 0;
const utils_1 = require("@medusajs/utils");
const medusa_core_utils_1 = require("medusa-core-utils");
var Aliases;
(function (Aliases) {
    Aliases["SalesChannel"] = "sales_channel";
})(Aliases || (Aliases = {}));
async function findSalesChannel({ container, data, }) {
    const salesChannelService = container.resolve("salesChannelService");
    const storeService = container.resolve("storeService");
    let salesChannelId = data[Aliases.SalesChannel].sales_channel_id;
    let salesChannel;
    const salesChannelDTO = {};
    const publishableApiKeyScopes = data[Aliases.SalesChannel].publishableApiKeyScopes || {};
    delete data[Aliases.SalesChannel].publishableApiKeyScopes;
    if (!(0, medusa_core_utils_1.isDefined)(salesChannelId) &&
        publishableApiKeyScopes?.sales_channel_ids?.length) {
        if (publishableApiKeyScopes.sales_channel_ids.length > 1) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.UNEXPECTED_STATE, "The provided PublishableApiKey has multiple associated sales channels.");
        }
        salesChannelId = publishableApiKeyScopes.sales_channel_ids[0];
    }
    if ((0, medusa_core_utils_1.isDefined)(salesChannelId)) {
        salesChannel = await salesChannelService.retrieve(salesChannelId);
    }
    else {
        salesChannel = (await storeService.retrieve({
            relations: ["default_sales_channel"],
        })).default_sales_channel;
    }
    if (salesChannel.is_disabled) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Unable to assign the cart to a disabled Sales Channel "${salesChannel.name}"`);
    }
    salesChannelDTO.sales_channel_id = salesChannel?.id;
    return salesChannelDTO;
}
exports.findSalesChannel = findSalesChannel;
findSalesChannel.aliases = Aliases;
