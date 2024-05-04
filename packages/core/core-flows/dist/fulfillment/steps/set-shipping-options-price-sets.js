"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setShippingOptionsPriceSetsStep = exports.setShippingOptionsPriceSetsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
async function getCurrentShippingOptionPriceSetsLinks(shippingOptionIds, { remoteQuery }) {
    const query = (0, utils_1.remoteQueryObjectFromString)({
        service: utils_1.LINKS.ShippingOptionPriceSet,
        variables: {
            filters: { shipping_option_id: shippingOptionIds },
            take: null,
        },
        fields: ["shipping_option_id", "price_set_id"],
    });
    const shippingOptionPriceSetLinks = (await remoteQuery(query));
    return shippingOptionPriceSetLinks.map((shippingOption) => {
        return {
            [utils_1.Modules.FULFILLMENT]: {
                shipping_option_id: shippingOption.shipping_option_id,
            },
            [utils_1.Modules.PRICING]: {
                price_set_id: shippingOption.price_set_id,
            },
        };
    });
}
exports.setShippingOptionsPriceSetsStepId = "set-shipping-options-price-sets-step";
exports.setShippingOptionsPriceSetsStep = (0, workflows_sdk_1.createStep)(exports.setShippingOptionsPriceSetsStepId, async (data, { container }) => {
    if (!data.length) {
        return;
    }
    const dataInputToProcess = data.filter((inputData) => {
        return inputData.price_sets?.length;
    });
    if (!dataInputToProcess.length) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const remoteQuery = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_QUERY);
    const shippingOptionIds = dataInputToProcess.map((inputData) => inputData.id);
    const currentExistingLinks = await getCurrentShippingOptionPriceSetsLinks(shippingOptionIds, { remoteQuery });
    const linksToRemove = currentExistingLinks
        .filter((existingLink) => {
        return !dataInputToProcess.some((input) => {
            return (input.id === existingLink[utils_1.Modules.FULFILLMENT].shipping_option_id &&
                input.price_sets.includes(existingLink[utils_1.Modules.PRICING].price_set_id));
        });
    })
        .map((link) => {
        return {
            [utils_1.Modules.FULFILLMENT]: {
                shipping_option_id: link[utils_1.Modules.FULFILLMENT].shipping_option_id,
            },
            [utils_1.Modules.PRICING]: {
                price_set_id: link[utils_1.Modules.PRICING].price_set_id,
            },
        };
    });
    const linksToCreate = dataInputToProcess
        .map((inputData) => {
        return inputData.price_sets.map((priceSet) => {
            const alreadyExists = currentExistingLinks.some((link) => {
                return (link[utils_1.Modules.FULFILLMENT].shipping_option_id === inputData.id &&
                    link[utils_1.Modules.PRICING].price_set_id === priceSet);
            });
            if (alreadyExists) {
                return;
            }
            return {
                [utils_1.Modules.FULFILLMENT]: { shipping_option_id: inputData.id },
                [utils_1.Modules.PRICING]: { price_set_id: priceSet },
            };
        });
    })
        .flat()
        .filter((d) => !!d);
    const promises = [];
    if (linksToRemove.length) {
        promises.push(remoteLink.dismiss(linksToRemove));
    }
    if (linksToCreate.length) {
        promises.push(remoteLink.create(linksToCreate));
    }
    await (0, utils_1.promiseAll)(promises);
    return new workflows_sdk_1.StepResponse(void 0, {
        linksToCreate: linksToRemove,
        linksToRemove: linksToCreate,
    });
}, async (rollbackData, { container }) => {
    if (!rollbackData) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const promises = [];
    if (rollbackData.linksToRemove.length) {
        promises.push(remoteLink.dismiss(rollbackData.linksToRemove));
    }
    if (rollbackData.linksToCreate.length) {
        promises.push(remoteLink.create(rollbackData.linksToCreate));
    }
    await (0, utils_1.promiseAll)(promises);
});
