"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRegionsPaymentProvidersStep = exports.setRegionsPaymentProvidersStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
async function validatePaymentProvidersExists(paymentService, paymentProviderIds) {
    const paymentProviders = await paymentService.listPaymentProviders({
        id: { $in: paymentProviderIds },
        is_enabled: true,
    });
    const retrievedPaymentProviderIds = paymentProviders.map((p) => p.id);
    const missingProviders = (0, utils_1.arrayDifference)(paymentProviderIds, retrievedPaymentProviderIds);
    if (missingProviders.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Payment providers with ids ${missingProviders.join(", ")} not found or not enabled`);
    }
}
async function getCurrentRegionPaymentProvidersLinks(regionIds, { remoteQuery }) {
    const query = (0, utils_1.remoteQueryObjectFromString)({
        service: utils_1.LINKS.RegionPaymentProvider,
        variables: {
            filters: { region_id: regionIds },
            take: null,
        },
        fields: ["region_id", "payment_provider_id"],
    });
    const regionProviderLinks = (await remoteQuery(query));
    return regionProviderLinks.map((region) => {
        return {
            [utils_1.Modules.REGION]: {
                region_id: region.region_id,
            },
            [utils_1.Modules.PAYMENT]: {
                payment_provider_id: region.payment_provider_id,
            },
        };
    });
}
exports.setRegionsPaymentProvidersStepId = "add-region-payment-providers-step";
exports.setRegionsPaymentProvidersStep = (0, workflows_sdk_1.createStep)(exports.setRegionsPaymentProvidersStepId, async (data, { container }) => {
    const dataInputToProcess = data.input.filter((inputData) => {
        return inputData.payment_providers?.length;
    });
    if (!dataInputToProcess.length) {
        return new workflows_sdk_1.StepResponse(void 0);
    }
    const paymentService = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const remoteQuery = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_QUERY);
    const allPaymentProviderIds = dataInputToProcess
        .map((inputData) => {
        return inputData.payment_providers;
    })
        .flat();
    const uniquePaymentProviderIds = Array.from(new Set(allPaymentProviderIds));
    await validatePaymentProvidersExists(paymentService, uniquePaymentProviderIds);
    const regionIds = dataInputToProcess.map((inputData) => inputData.id);
    const currentExistingLinks = await getCurrentRegionPaymentProvidersLinks(regionIds, { remoteQuery });
    const linksToRemove = currentExistingLinks
        .filter((existingLink) => {
        return !dataInputToProcess.some((input) => {
            return (input.id === existingLink[utils_1.Modules.REGION].region_id &&
                input.payment_providers.includes(existingLink[utils_1.Modules.PAYMENT].payment_provider_id));
        });
    })
        .map((link) => {
        return {
            [utils_1.Modules.REGION]: { region_id: link[utils_1.Modules.REGION].region_id },
            [utils_1.Modules.PAYMENT]: {
                payment_provider_id: link[utils_1.Modules.PAYMENT].payment_provider_id,
            },
        };
    });
    const linksToCreate = dataInputToProcess
        .map((inputData) => {
        return inputData.payment_providers.map((provider) => {
            const alreadyExists = currentExistingLinks.some((link) => {
                return (link[utils_1.Modules.REGION].region_id === inputData.id &&
                    link[utils_1.Modules.PAYMENT].payment_provider_id === provider);
            });
            if (alreadyExists) {
                return;
            }
            return {
                [utils_1.Modules.REGION]: { region_id: inputData.id },
                [utils_1.Modules.PAYMENT]: { payment_provider_id: provider },
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
